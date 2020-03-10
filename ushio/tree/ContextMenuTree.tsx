/**
 * title: 支持右键菜单的树
 * desc: 可右键添加菜单信息的Tree
 */

import React from 'react'

import { Tree, TreeNodeData } from '../../components/tree/Tree';
import { message } from 'antd';


const BaseTree = () => {
    return (
        <>
            <Tree
                contextMenu={[
                  <span key ='1'>Kotomi</span>,
                  <span key ='2'>Ushio</span>,
                  <span key ='3'>Clannad</span>
                ]}
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
                onClickContextMenu={(key,node)=>{
                  message.info(`key: ${key}, dataRef: ${JSON.stringify(node!.props.dataRef)}`)
                }}
            />
        </>
    )
}

export default BaseTree

