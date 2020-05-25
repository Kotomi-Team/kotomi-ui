import React, { useState, useImperativeHandle } from 'react'
import * as shortid from 'shortid'
import { QueryBuild as RcQueryBuild } from 'rc-query'
import { Query } from 'rc-query/dist/interface'
import { Input, Select, Col, Icon } from 'antd'

import Dropdown from '../dropdown/Dropdown'

interface DropdownState {
    key: string
    visible: boolean
    pageX: number
    pageY: number
    menus: JSX.Element[]
}

const queryRender = (
        type: string,
        dropState: any,
        setDropState: any,
        queryProps: QueryBuildProps,
        querys: Query[],
        setQuerys: any,
        key: string,
        width: number,
        height: number,

) => {
    const menus = [
        <span key ='AND'>并且</span>,
        <span key ='OR'>或者</span>,
        <span key ='NORMAL'>添加条件</span>,
    ]
    return (props: any) => {
        const { style } = props
        const deleteIcon = (
            <Icon
                style={{
                    position: 'absolute' ,
                    top: style.top - 7 + (height / 2),
                    left: style.left + width + 5,
                }}
                type="minus-circle"
                onClick={() => {
                    // 删除当前节点信息
                    const loopsDelQuery = (loopsQuery: Query[]) => {
                        const result: Query[] = []
                        loopsQuery.forEach((query) => {
                            if (query.key !== key) {
                                if (query.children && query.children.length > 0) {
                                    result.push({
                                        ...query,
                                        children: loopsDelQuery(query.children),
                                    })
                                }else {
                                    result.push(query)
                                }
                            }
                        })
                        return result
                    }
                    const newQuery = loopsDelQuery(querys)
                    setQuerys(newQuery)
                }}
             />
        )
        if (type === 'AND') {
            return (
                <>
                    <div
                        style={{
                            ...style,
                            textAlign: 'center',
                            lineHeight: '30px',
                            border: '1px solid #000',
                            display: 'inline-block',
                        }}
                        onContextMenu={(e) => {
                            setDropState({
                                ...dropState,
                                visible: true,
                                pageX: e.pageX,
                                pageY: e.pageY,
                                key,
                                menus,
                            })
                        }}
                    >
                        并且
                    </div>
                    {deleteIcon}
                </>
            )
        }
        else if (type === 'OR') {
            return (
                <>
                    <div
                        style={{
                            ...style,
                            textAlign: 'center',
                            lineHeight: '30px',
                            border: '1px solid #000',
                        }}
                        onContextMenu={(e) => {
                            setDropState({
                                ...dropState,
                                visible: true,
                                pageX: e.pageX,
                                pageY: e.pageY,
                                key,
                                menus,
                            })
                        }}
                    >
                        或者
                    </div>
                    {deleteIcon}
                </>
            )
        }

        return (
            <>
                <div style={style}>
                    <QueryInput
                        fields={queryProps.fields}
                        symbols={queryProps.symbols}
                        onChange={(field, symbol, value) => {
                            let tempQuery: Query | undefined ;
                            const loopsFindQuery = (tempQuerys: Query[]) => {
                                tempQuerys.some(element => {
                                    if (element.children && element.children.length > 0) {
                                       loopsFindQuery(element.children)
                                    }
                                    if (element.key === key) {
                                        tempQuery = element
                                        return true
                                    }
                                    return false
                                })
                            }
                            loopsFindQuery(querys)
                            tempQuery!.dataRef = {
                                field, symbol, value,
                            }

                        }}
                    />
                </div>
                {deleteIcon}
            </>
        )
    }
}

const getQuery = (
        type: string,
        dropState: any,
        setDropState: any,
        queryProps: QueryBuildProps,
        querys: Query[],
        setQuerys: any,
    ) => {
    const key = shortid.generate()
    const width = type === 'NORMAL' ? 400 : 60
    const height = type === 'NORMAL' ? 32 : 30
    return {
        key,
        height,
        width,
        margin: {
            x: 10,
            y: 20,
        },
        render: queryRender(
            type,
            dropState,
            setDropState,
            queryProps,
            querys,
            setQuerys,
            key,
            width,
            height,
        ),
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

interface Field {
    name: string
    title: string
}

interface QueryInputProps {
    // 字段信息
    fields: Field[]
    // 符号信息
    symbols: string[]

    field?: string
    value?: string
    symbol?: string

    onChange?: (field: string , symbol: string , value: string) => void
}

const QueryInput = (props: QueryInputProps) => {

    const [field, setField] = useState(props.field)
    const [value, setValue] = useState(props.value)
    const [symbol, setSymbol] = useState(props.symbol)

    return (
        <>
            <Input.Group compact>
                <Col span={9}>
                    <Select
                        style={{ width: '100%' }}
                        value={field}
                        onChange={(changeValue: string) => {
                            setField(changeValue)
                            if (props.onChange) {
                                props.onChange(changeValue, symbol!, value!)
                            }
                        }}
                    >
                        {props.fields.map((element) => <Select.Option key={element.name} value={element.name}>{element.title}</Select.Option>)}
                    </Select>
                </Col>
                <Col span={6}>
                    <Select
                        style={{ width: '100%' }}
                        value={symbol}
                        onChange={(changeValue: string) => {
                            setSymbol(changeValue)
                            if (props.onChange) {
                                props.onChange(field!, changeValue, value!)
                            }
                        }}
                    >
                        {props.symbols.map(element => <Select.Option key={element} value={element}>{element}</Select.Option>)}
                    </Select>
                </Col>
                <Col span={9}>
                    <Input
                        style={{ width: '100%' }}
                        value={value}
                        onChange={(e) => {
                            const { value: tempValue } = e.target
                            setValue(tempValue)
                            if (props.onChange) {
                                props.onChange(field!, symbol!, tempValue)
                            }
                        }}
                    />
                </Col>
            </Input.Group>
        </>
    )
}

interface QueryBuildProps {
    fields: Field[]
    symbols: string[]
}

export const QueryBuild = React.forwardRef((props: QueryBuildProps, ref: any) => {
    const [querys, setQuerys] = useState<Query[]>([])
    const [dropState, setDropState] = useState<DropdownState>({
        key: '',
        visible: false,
        pageX: 0,
        pageY: 0,
        menus: [
            <span key ='AND'>并且</span>,
            <span key ='OR'>或者</span>,
            <span key ='NORMAL'>添加条件</span>,
        ],
    })

    useImperativeHandle(ref, () => ({
        getQueryJSON: () => JSON.parse(JSON.stringify(querys)),
    }))

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
                        menus: [
                            <span key ='AND'>并且</span>,
                            <span key ='OR'>或者</span>,
                        ],
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
                menus={dropState.menus}
                onClick={(element) => {
                    const key = element.key as string
                    const tempQuery = getQuery(key, dropState, setDropState, props, querys, setQuerys)

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
})
