/**
 * title: 支持右键菜单的树
 * desc: 可右键添加菜单信息的Tree
 */

import React from 'react'
import * as shortid from 'shortid'
import { Tree, TreeNodeData } from '../../components/tree/Tree';
import { message } from 'asp-antd-compatible';


const BaseTree = () => {
    const tree = React.createRef<Tree>()
    return (
        <div style={{
            height: 200,
            overflow: 'scroll'
        }}>
            <div
                style={{
                    height: 2000
                }}
            >
                <Tree
                    // @ts-ignore
                    getPopupContainer={(dom) => dom.parentNode!.parentNode!}
                    ref={tree}
                    contextMenu={[
                        <span key='add'>add</span>,
                        <span key='delete'>delete</span>,
                        <span key='update'>update</span>,
                        <span key='insert'>insert</span>,
                        <span key='refresh'>refresh</span>
                    ]}
                    loadData={async (data: TreeNodeData) => {
                        if (data === undefined) {
                            return [{
                                title: '节点-1',
                                key: shortid.generate(),
                                dataRef: 1,
                                children: []
                            }]
                        }
                        const newData = JSON.parse(JSON.stringify(data))
                        newData.key = shortid.generate()
                        newData.dataRef = data.dataRef + 1
                        newData.title = `节点-${data.dataRef + 1}`
                        if (data.dataRef >= 10) {
                            return []
                        }
                        return [newData]
                    }}
                    // onExpand={(_, info) => {
                    //     const key = info.node.props.dataRef.key
                    //     if (tree.current) {
                    //         tree.current.updateNode(key, (treeNode) => {
                    //             treeNode.title = '修改数据'
                    //             return treeNode
                    //         })
                    //     }
                    // }}
                    onClickContextMenu={(key, node) => {
                        if (key === 'delete') {
                            if (tree.current) {
                                const id = node!.props.dataRef.key as string
                                tree.current.delNode(id)
                            }
                        } else if (key === 'add') {
                            const tempData: TreeNodeData[] = [{
                                title: `add - ${shortid.generate()}`,
                                key: shortid.generate(),
                                dataRef: 12,
                                children: []
                            }]
                            if (tree.current) {
                                const id = node!.props.dataRef.key as string
                                tree.current.appendNode(id, tempData)
                            }
                        } else if (key === 'update') {
                            if (tree.current) {
                                const id = node!.props.dataRef.key as string
                                tree.current.updateNode(id, (treeNode) => {
                                    treeNode.title = '修改数据'
                                    return treeNode
                                })
                            }
                        } else if (key === 'insert') {
                            const tempData: TreeNodeData[] = [{
                                title: `add - ${shortid.generate()}`,
                                key: shortid.generate(),
                                dataRef: 12,
                                children: []
                            }]
                            if (tree.current) {
                                const id = node!.props.dataRef.key as string
                                tree.current.insertNode(id, tempData, (node, children) => {
                                    children.splice(0, 0, node)
                                    return children
                                })
                            }
                        } else if (key === 'refresh'){
                            if (tree.current) {
                                console.log(node)
                                const id = node!.props.dataRef.key as string
                                tree.current.refresh(id)
                            }
                        }
                         else {
                            message.info(`key: ${key}, dataRef: ${JSON.stringify(node!.props.dataRef)}`)
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default BaseTree

