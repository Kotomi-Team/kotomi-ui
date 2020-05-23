import React, { useState } from 'react'
import * as shortid from 'shortid'
import { QueryBuild as RcQueryBuild } from 'rc-query'
import { Query } from 'rc-query/dist/interface'
import { Input } from 'antd'

import Dropdown from '../dropdown/Dropdown'

interface DropdownState {
    key: string
    visible: boolean
    pageX: number
    pageY: number
}

const getQuery = (type: string, dropState: any, setDropState: any) => {
    const key = shortid.generate()
    return {
        key,
        height: type === 'NORMAL' ? undefined : 30,
        width: type === 'NORMAL' ? undefined : 60,
        margin: {
            x: 30,
            y: 20,
        },
        render: (props: any) => {
            const { style } = props
            if (type === 'AND') {
                return (
                    <div
                        style={{
                            ...style,
                            textAlign: 'center',
                            lineHeight: '30px',
                            border: '1px dashed #000',
                        }}
                        onContextMenu={(e) => {
                            setDropState({
                                ...dropState,
                                visible: true,
                                pageX: e.pageX,
                                pageY: e.pageY,
                                key,
                            })
                        }
                    }>
                        并且
                    </div>
                )
            }
            else if (type === 'OR') {
                return (<div style={{
                    ...style,
                    textAlign: 'center',
                    lineHeight: '30px',
                    border: '1px dashed #000',
                }} onContextMenu={(e) => {
                    setDropState({
                        ...dropState,
                        visible: true,
                        pageX: e.pageX,
                        pageY: e.pageY,
                        key,
                    })
                } }>
                        或者
                </div>)
            }
            return <div style={style}> <Input /> </div>
        },
        children: [],
    } as unknown as Query
}

const loops = (querys: Query[] , cellback: (query: Query) => boolean) => {
    querys.some((query) => {
        if (query.children && query.children.length > 0) {
            loops(query.children, cellback)
        }
        return cellback(query)
    })
}

export const QueryBuild = () => {
    const [querys, setQuerys] = useState<Query[]>([])
    const [dropState, setDropState] = useState<DropdownState>({
        key: '',
        visible: false,
        pageX: 0,
        pageY: 0,
    })

    return (
        <>
            <RcQueryBuild
                querys={querys}
                rightClick={(position) => {
                    setDropState({
                        ...dropState,
                        key: '',
                        pageX: position.x,
                        pageY: position.y,
                        visible: true,
                    })
                }}
            />
            <Dropdown
                visible={dropState.visible}
                left={dropState.pageX}
                top={dropState.pageY}
                onBlur={() => {
                    setDropState({
                        ...dropState,
                        visible: false,
                    })
                }}
                menus={[
                    <span key ='AND'>并且</span>,
                    <span key ='OR'>或者</span>,
                    <span key ='NORMAL'>添加条件</span>,
                ]}
                onClick={(element) => {
                    const key = element.key as string
                    const tempQuery = getQuery(key, dropState, setDropState)

                    if (dropState.key === '') {
                        querys.push(tempQuery)
                        setQuerys([...querys])

                    }else {
                        let cQuery: Query;
                        loops(querys, loopQuery => {
                            if (dropState.key === loopQuery.key) {
                                cQuery = loopQuery
                                return true
                            }
                            return false
                        })
                        cQuery!.children.push(tempQuery)
                        setQuerys([...querys])
                    }
                    setDropState({
                        ...dropState,
                        visible: false,
                    })
                }}
            />
        </>
    )
}
