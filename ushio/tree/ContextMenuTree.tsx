/**
 * title: 支持右键菜单的树
 * desc: 可右键添加菜单信息的Tree
 */

import React from 'react'
import * as shortid from 'shortid'
import { Tree, TreeNodeData } from '../../components/tree/Tree';
import { message } from 'antd';


const BaseTree = () => {
    const tree = React.createRef<Tree>()
    return (
        <Tree
            ref={tree}
            contextMenu={[
                <span key ='add'>add</span>,
                <span key ='delete'>delete</span>,
                <span key ='update'>update</span>
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
            onExpand={(_, info) =>{
                const key = info.node.props.dataRef.key
                if(tree.current){
                    tree.current.updateNode(key, (treeNode) => {
                        treeNode.title = '修改数据'
                        return treeNode
                    })
                }
            }}
            onClickContextMenu={(key,node)=>{
                if(key === 'delete'){
                    if(tree.current){
                        const id = node!.props.dataRef.key as string 
                        tree.current.delNode(id)
                    }
                }else if(key === 'add'){
                    const tempData: TreeNodeData[] = [{
                            title: `add - ${new Date().getTime()}`,
                            key: shortid.generate(),
                            dataRef: 12,
                            children: []
                        }]
                    if(tree.current){
                        const id = node!.props.dataRef.key as string 
                        tree.current.appendNode(id, tempData)
                    }
                }else if(key === 'update'){
                    if(tree.current){
                        const id = node!.props.dataRef.key as string
                        tree.current.updateNode(id, (treeNode) => {
                            treeNode.title = '修改数据'
                            return treeNode
                        })
                    }
                }else{
                    message.info(`key: ${key}, dataRef: ${JSON.stringify(node!.props.dataRef)}`)
                }
            }}
        />
    )
}

export default BaseTree

