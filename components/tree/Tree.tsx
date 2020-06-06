import React from 'react'
import { Tree as AntTree } from 'antd';
import { AntTreeNode, AntTreeNodeSelectedEvent, AntTreeNodeDropEvent, AntTreeNodeMouseEvent } from 'antd/lib/tree/Tree'
import lodash from 'lodash'
import Dropdown from '../dropdown/Dropdown'

/**
 * 节点数据信息
 */
export type TreeNodeData = {
    // 唯一的key
    key: string
    // 标题
    title: string
    // 原数据信息
    dataRef: any
    // 子节点数据
    children: TreeNodeData[],

    isLeaf?: boolean
    // 是否装载
    loaded?: boolean
    extChildren?: TreeNodeData[],
}

type Props = {
    /**
     * 装载子节点数据
     * @param node 请求的数据，如果是第一次加载则数据为undefined
     * @returns 必须返回统一的 TreeNodeData 结构
     */
    loadData: (node: TreeNodeData | undefined) => Promise<TreeNodeData[]>

    /**
     * 节点前添加 Checkbox 复选框
     */
    checkable?: boolean

    /**
     * 选中的key,表示当前Tree中设置选中状态
     */
    checkedKeys?: string[]

    /**
     * 右键菜单的信息列表
     */
    contextMenu?: JSX.Element[]

    /**
     * 是否独占一行
     */
    blockNode?: boolean,

    /**
     * 是否是目录树
     */
    isDirectoryTree?: boolean

    /**
     * 渲染节点title的时候触发的事件，返回一个新的title对象
     * @param data 当前树状节点的数据
     * @param render 当前渲染的节点数据
     */
    onRenderTreeNodeTitle?: (data: TreeNodeData) => string | React.ReactNode,

    /**
     * 点击树节点触发的事件
     * @param data 当前节点的数据信息
     * @param selected 当前节点是否选中，true表示选中，false表示不选中
     */
    onTreeNodeClick?: (data: TreeNodeData, selected: boolean) => void

    /**
     * 点击右键菜单
     * - node.props.dataRef 可获取绑定的数据
     */
    onClickContextMenu?: (key: string | number, node?: AntTreeNode) => void

    onRightClick?: (options: AntTreeNodeMouseEvent) => boolean

    /**
     * 拖动Tree的节点触发的事件
     * @param  源数据
     * @param  目标数据
     */
    onDrag?: (dropEven: AntTreeNodeDropEvent) => Promise<boolean>,
}

type State = {
    treeData: TreeNodeData[]
    pageX: number
    pageY: number
    isShowMenu: boolean,
    node?: AntTreeNode,
    selectedKeys?: string[],
}

/**
 * 树形组件
 */
export class Tree extends React.Component<Props, State>{

    static defaultProps = {
        checkable: false,
        checkedKeys: [],
        onRightClick: async() => true,
        isDirectoryTree: false,
    }

    state = {
        treeData: [],
        pageX: 0,
        pageY: 0,
        isShowMenu: false,
        node: undefined,
        selectedKeys: [],
    }

    constructor(props: Props) {
        super(props)
        this.onLoadData = this.onLoadData.bind(this)
    }

    componentDidMount() {
        this.props.loadData(undefined).then((treeData: TreeNodeData[]) => {
            this.setState({
                treeData,
            })
        })
    }

    public updateNode(key: string, callback: (treeNode: TreeNodeData) => TreeNodeData) {
        return new Promise((resolve) => {
            const loops = (nodeDatas: TreeNodeData[]) => {
                nodeDatas.some((element) => {
                    if (element.key === key) {
                        element = callback(element)
                        return true
                    }
                    loops(element.children)
                    return false
                })
            }

            loops(this.state.treeData)
            this.setState({
                treeData: [...this.state.treeData],
            }, () => {
                resolve()
            })
        })

    }

    public setSelectedKeys(keys: string[]) {
        this.setState({
            selectedKeys: keys,
        })
    }

    public appendNode(parent: string | null, nodes: TreeNodeData[]) {
        return new Promise((resolve) => {
            const loops = (nodeDatas: TreeNodeData[], callback: (node: TreeNodeData) => Boolean) => {
                nodeDatas.some((element) => {
                    if (element.children && element.children.length > 0) {
                        loops(element.children, callback)
                    }
                    return callback(element)
                })
            }
            let parentNode: TreeNodeData | undefined;
            loops(this.state.treeData, (node) => {
                if (node.key === parent) {
                    parentNode = node
                    return true
                }
                return false
            })

            if (parentNode) {
                if (parentNode.loaded) {
                    nodes.forEach((element) => {
                        parentNode!.children.push(element)
                    })
                }

                if (lodash.isArray(parentNode.extChildren)) {
                    nodes.forEach((element) => {
                        parentNode!.extChildren!.push(element)
                    })
                }else {
                    parentNode.extChildren = nodes
                }

                this.setState({
                    treeData: [...this.state.treeData],
                }, () => {
                    resolve()
                })
            }
        })

    }

    // 删除指定的节点信息
    public delNode(keys: string | string[]) {
        return new Promise((resolve) => {
            let delKey: string[] = []
            if (lodash.isArray(keys)) {
                delKey = keys
            }else {
                delKey.push(keys)
            }

            const loops = (treeData: TreeNodeData[], callback: (node: TreeNodeData) => boolean) => {
                const result: TreeNodeData[] = []

                for (let i = 0; i < treeData.length ; i++) {
                    if (treeData[i].children && treeData[i].children.length > 0) {
                        const node = {
                            ...treeData[i],
                            children: loops(treeData[i].children, callback),
                        } as unknown as TreeNodeData
                        result.push(node)
                    }else {
                        if (callback(treeData[i])) {
                            result.push(treeData[i])
                        }
                    }
                }
                return result
            }
            const tempTreeData = loops(this.state.treeData, (node: TreeNodeData) => {
                return delKey.indexOf(node.key) === -1
            })

            this.setState({
                treeData: tempTreeData,
            }, () => {
                resolve()
            })
        })

    }

    render() {

        const TempTree = this.props.isDirectoryTree === true ? AntTree.DirectoryTree : AntTree

        return (
            <>
                <TempTree
                    loadData={this.onLoadData}
                    checkedKeys={this.props.checkedKeys}
                    checkable={this.props.checkable}
                    selectedKeys={this.state.selectedKeys}
                    onRightClick={(e) => {
                        const self = this
                        if (this.props.onRightClick) {
                            const respState = this.props.onRightClick(e)
                            if (respState) {
                                self.setState({
                                    pageX: e.event.clientX,
                                    pageY: e.event.clientY,
                                    isShowMenu: true,
                                    node: e.node,
                                })
                            }
                        }else {
                            this.setState({
                                pageX: e.event.clientX,
                                pageY: e.event.clientY,
                                isShowMenu: true,
                                node: e.node,
                            })
                        }
                    }}
                    blockNode={this.props.blockNode}
                    onSelect={(selectedKeys: string[], e: AntTreeNodeSelectedEvent) => {
                        this.setState({
                            selectedKeys: lodash.cloneDeep(selectedKeys),
                        })
                        if (this.props.onTreeNodeClick) {
                            this.props.onTreeNodeClick(e.node.props.dataRef, e.selected!)
                        }
                    }}
                    draggable={this.props.onDrag ? true : false}
                    onDrop={(dropEven: AntTreeNodeDropEvent) => {
                        if (this.props.onDrag) {
                            this.props.onDrag(dropEven).then((respState) => {
                                if (respState) {
                                    const loop = (datas: TreeNodeData[], callback: (data: TreeNodeData) => TreeNodeData[]) => {
                                        const newDatas: TreeNodeData[] = []
                                        datas.forEach((element) => {
                                            const callbackData = callback(element)
                                            if (element.children && element.children.length > 0) {
                                                if (callbackData) {
                                                    callbackData.forEach((callbackElement) => {
                                                        newDatas.push({
                                                            ...callbackElement,
                                                            children: loop(callbackElement.children, callback),
                                                        })
                                                    })
                                                }
                                            } else {
                                                if (callbackData) {
                                                    callbackData.forEach((callbackElement) => {
                                                        newDatas.push(callbackElement)
                                                    })
                                                }
                                            }
                                        })
                                        return newDatas
                                    }

                                    const filteTreeData = loop(this.state.treeData, (element: TreeNodeData) => {
                                        if (element.key === dropEven.dragNode.props.dataRef.key) {
                                            return []
                                        }
                                        return [{
                                            ...element,
                                        }]
                                    })

                                    const newTreeData = loop(filteTreeData, (element: TreeNodeData) => {
                                        if (element.key === dropEven.node.props.dataRef.key) {
                                            const dragNode = dropEven.dragNode.props.dataRef
                                            if (dropEven.dropPosition === -1) {
                                                return [dragNode, element]
                                            }
                                            if (dropEven.dropToGap) {
                                                return [element, dragNode]
                                            }
                                            return [{
                                                ...element,
                                                children: [
                                                    ...element.children,
                                                    dragNode,
                                                ],
                                            }]
                                        }
                                        return [element]
                                    })

                                    this.setState({
                                        treeData: newTreeData,
                                    })
                                }
                            })
                        }

                    }}
                >
                    {this.renderTreeNodes(this.state.treeData)}
                </TempTree>
                <Dropdown
                    visible={this.state.isShowMenu}
                    left={this.state.pageX}
                    top={this.state.pageY}
                    onBlur={() => {
                        this.setState({
                            isShowMenu: false,
                        })
                    }}
                    menus={this.props.contextMenu}
                    onClick={(element) => {
                        if (this.props.onClickContextMenu) {
                            if (element.key) {
                                this.props.onClickContextMenu(element.key, this.state.node)
                            } else {
                                throw new Error(`KOTOMI-TABLE-5003: The key attribute of ContextMenu element cannot be empty. key [${element.key}] `)
                            }
                        }
                        this.setState({
                            isShowMenu: false,
                        })
                    }}
                />
            </>
        )
    }

    // 装载节点数据
    protected async onLoadData(node: AntTreeNode) {

        const children = await this.props.loadData(node.props.dataRef)
        if (children && children.length > 0) {
            let tempChildren = children
            if (node.props.dataRef.extChildren) {
                tempChildren = tempChildren.concat(node.props.dataRef.extChildren)
            }
            node.props.dataRef.children = tempChildren
            node.props.dataRef.loaded = true
            this.setState({
                treeData: [...this.state.treeData],
            });
        }
    }

    // 渲染所有节点数据
    protected renderTreeNodes = (treeData: TreeNodeData[]) => {
        return treeData.map(item => {
            let title: string | React.ReactNode = item.title

            if (this.props.onRenderTreeNodeTitle) {
                title = this.props.onRenderTreeNodeTitle(item)
            }

            const extProps: any = {}
            if (item.isLeaf) {
                extProps.isLeaf = item.isLeaf
            }

            if (item.children) {
                return (
                    <AntTree.TreeNode {...extProps} title={title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </AntTree.TreeNode>
                )
            }
            return <AntTree.TreeNode {...extProps} title={title} key={item.key} dataRef={item} />;
        })
    }
}
