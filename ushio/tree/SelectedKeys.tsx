/**
 * title: 目录树
 * desc: 选择受控的目录树
 */

import React, { useState } from 'react'

import { Tree, TreeNodeData } from '../../components/tree/Tree';
import { Button } from 'antd';


const SelectTree = () => {
    const [selectKey, setSelectKey] = useState<string[]>([])
    return (
        <>
            <Button
                onClick={() => {
                    setSelectKey(['1'])
                }}
            >
                选择Key 为 1的数据
            </Button>
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
                isDirectoryTree
                selectedKeys={selectKey}
            />
        </>
    )
}

export default SelectTree

