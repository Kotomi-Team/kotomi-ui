/**
 * title: 拖拽树
 * desc: 可拖动节点的Tree控件
 */

import React from 'react'

import { Tree, TreeNodeData } from '../../components/tree/Tree';


const DraggableTree = () => {
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
                      },{
                        title: '节点-11',
                        key: '11',
                        dataRef: 11,
                        children: []
                    }]
                  }
                  const newData = JSON.parse(JSON.stringify(data))
                  newData.key = `${data.dataRef + 1}`
                  newData.dataRef = data.dataRef + 1
                  newData.title = `节点-${data.dataRef + 1}`
                  if (data.dataRef >= 10) {
                      return []
                  }
                  return [newData]
              }}
              onDrag={async ()=>{
                return true
              }}
            />
        </>
    )
}

export default DraggableTree

