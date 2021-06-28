/**
 * title: 基础的树组件
 * desc: 一个简单的树组件
 */

import React, { useRef } from 'react'

import { Tree, TreeNodeData } from '../../components/tree/Tree';
import { Input } from 'asp-antd-compatible';


const BaseTree = () => {
    const tree = useRef<any>()
    return (
        <>
            <Input
                onChange={(e) => {
                    const value = e.target.value
                    
                    if(tree.current){
                        tree.current.expandAll()
                        tree.current.filter((node: any) => {
                            if(value){
                              return node.title.indexOf(value) !== -1
                            }
                            if(value === ''){
                                return true
                            }
                            return node.title === value
                        })
                    }
                }}
            />
            <Tree
                ref={tree}
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
                    newData.key = `${data.dataRef + 1}`
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

