import React from 'react'
import classNames from 'classnames';
import { Tree as AntTree } from 'antd'
import { AntTreeNode, AntTreeNodeSelectedEvent } from 'antd/lib/tree/Tree'

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
    onClickContextMenu?: (key: string | number, node?: AntTreeNode) => void,
}

type State = {
    treeData: TreeNodeData[]
    pageX?: number
    pageY?: number
    isShowMenu: boolean,
    node?: AntTreeNode,
}

/**
 * 树形组件
 */
export class Tree extends React.Component<Props, State>{

    static defaultProps = {
        checkable: false,
        checkedKeys: [],
    }

    state = {
        treeData: [],
        pageX: undefined,
        pageY: undefined,
        isShowMenu: false,
        node: undefined,
    }

    private dropdownElement: React.RefObject<HTMLDivElement> = React.createRef()

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

    focusDropdown() {
        if (this.dropdownElement.current) {
            this.dropdownElement.current.focus()
        }
    }

    renderRightClickMenu() {
        const { pageX, pageY } = this.state
        const { contextMenu } = this.props
        if (pageX && pageY && contextMenu && contextMenu.length > 0) {
            return (
              <div
               ref={this.dropdownElement}
               className={classNames(
                   'ant-dropdown',
                   'ant-dropdown-placement-bottomLeft',
                    this.state.isShowMenu ? '' : 'ant-dropdown-hidden',
                )}
               tabIndex={-1}
               style={{
                left: pageX,
                top: pageY,
                position: 'fixed'
               }}

               onBlur={() => {
                    this.setState({
                        isShowMenu: false,
                    })
               }}
              >
                <ul className={classNames(
                    'ant-dropdown-menu',
                    'ant-dropdown-menu-light',
                    'ant-dropdown-menu-root',
                    'ant-dropdown-menu-vertical',
                )}>
                    {(contextMenu as any[]).map((element: JSX.Element, index: number) => {
                        return (
                            <li
                                key={index}
                                className="ant-dropdown-menu-item"
                                onClick={() => {
                                    if (this.props.onClickContextMenu) {
                                        if (element.key) {
                                            this.props.onClickContextMenu(element.key, this.state.node)
                                        }else {
                                            throw new Error(`KOTOMI-TABLE-5003: The key attribute of ContextMenu element cannot be empty. key [${element.key}] `)
                                        }
                                    }
                                    this.setState({
                                        isShowMenu: false,
                                    })
                                }}
                                role="menuitem"
                            >
                                {element}
                            </li>
                        )
                    })}
                </ul>
               </div>
            )
        }
        return undefined
    }

    render() {
        return (
            <>
                <AntTree
                    loadData={this.onLoadData}
                    checkedKeys={this.props.checkedKeys}
                    checkable={this.props.checkable}
                    onRightClick={(e) => {
                        this.setState({
                            pageX: e.event.pageX,
                            pageY: e.event.pageY,
                            isShowMenu: true,
                            node: e.node,
                        }, () => {
                            this.focusDropdown()
                        })
                    }}
                    onSelect={(_selectedKeys: string[], e: AntTreeNodeSelectedEvent) => {
                        if (this.props.onTreeNodeClick) {
                            this.props.onTreeNodeClick(e.node.props.dataRef, e.selected!)
                        }
                    }}
                >
                    {this.renderTreeNodes(this.state.treeData)}
                </AntTree>
                {this.renderRightClickMenu()}
            </>
        )
    }

    // 装载节点数据
    protected async onLoadData(node: AntTreeNode) {
        const children = await this.props.loadData(node.props.dataRef)
        if (children && children.length > 0) {
            node.props.dataRef.children = children
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
            if (item.children) {
                return (
                    <AntTree.TreeNode title={title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </AntTree.TreeNode>
                )
            }
            return <AntTree.TreeNode title={title} key={item.key} dataRef={item} />;
        })
    }
}
