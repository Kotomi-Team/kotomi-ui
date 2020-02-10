import React from 'react'
import { Tree as AntTree } from 'antd'
import { AntTreeNode } from 'antd/lib/tree/Tree'

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
    children: TreeNodeData[]
}

export type TreeEvent = {

    /**
     * 渲染节点title的时候触发的事件，返回一个新的title对象
     * @param data 当前树状节点的数据
     * @param render 当前渲染的节点数据
     */
    onRenderTreeNodeTitle?: (data: TreeNodeData) => string | React.ReactNode
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
     * 当前表格的事件
     */
    event?: TreeEvent
}

type State = {
    treeData: TreeNodeData[]
}

/**
 * 树形组件
 */
export class Tree extends React.Component<Props, State>{

    state = {
        treeData: []
    }

    static defaultProps={
        checkable: false,
        checkedKeys: []
    }

    constructor(props: Props) {
        super(props)

        this.onLoadData = this.onLoadData.bind(this)
    }

    componentDidMount() {
        this.props.loadData(undefined).then((treeData:TreeNodeData[])=>{
            this.setState({
                treeData
            })
        })
    }

    // 装载节点数据
    protected async onLoadData(node: AntTreeNode) {
        const children = await this.props.loadData(node.props.dataRef)
        if(children && children.length > 0){
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

            if (this.props.event) {
                if (this.props.event.onRenderTreeNodeTitle) {
                    title = this.props.event.onRenderTreeNodeTitle(item)
                }
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

    render() {
        return (
            <AntTree
                loadData={this.onLoadData}
                checkedKeys={this.props.checkedKeys}
                checkable = {this.props.checkable}
            >
                {this.renderTreeNodes(this.state.treeData)}
            </AntTree>
        )
    }
}
