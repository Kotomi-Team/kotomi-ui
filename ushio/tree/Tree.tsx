/**
 * title: 基础的树组件
 * desc: 一个简单的树组件
 */

import React from 'react'

import { Tree, TreeNodeData } from '../../components/tree/Tree';


const BaseTree = () => {
    return (
        <>
            <Tree
                loadData={async (data: TreeNodeData) => {
                    if (data === undefined) {
                        return [{
                            title: '节点-1',
                            key: '1',
                            dataRef: 1,
                            children: []
                        }]
                    }
                    const newData = JSON.parse(JSON.stringify(data))
                    newData.key = data.dataRef + 1
                    newData.dataRef = data.dataRef + 1
                    newData.title = `节点-${data.dataRef + 1}`
                    if (data.dataRef === 10) {
                        return []
                    }
                    return [newData]
                }}
                onTreeNodeClick={(data: TreeNodeData, select: boolean) => {
                    console.log(data)
                    console.log(select)
                }}
            />
        </>
    )
}

export default BaseTree

