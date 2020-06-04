import React, { useState, useImperativeHandle, useReducer, useContext } from 'react'
import * as shortid from 'shortid'
import { QueryBuild as RcQueryBuild } from 'rc-query'
import { Query } from 'rc-query/dist/interface'
import { Icon } from 'antd'
import Dropdown from '../dropdown/Dropdown'
import { reducer, initialState, State } from './Reducer'
import { QueryInput, Field } from './QueryInput'

interface DropdownState {
    key: string
    visible: boolean
    pageX: number
    pageY: number
    menus: JSX.Element[]
}

const loops = (querys: Query[], cellback: (query: Query) => boolean) => {
    querys.some((query) => {
        if (query.children && query.children.length > 0) {
            loops(query.children, cellback)
        }
        return cellback(query)
    })
}

interface QueryBuildProps {
    fields: Field[]
    symbols: string[]
    // 默认的查询构建语法
    defaultQuerys?: Query[]
    onChangeField?: (field: string, symbol: string, value: string) => JSX.Element | void
}

interface IContextProps {
    state: State;
    dispatch: ({ type, payload }: { type: string, payload: Query[] }) => void;
}
const QueryContext = React.createContext({} as IContextProps);

const queryRender = (
    dataRef: any,
    dropState: any,
    setDropState: any,
    key: string,
    width: number,
    height: number,
    props: QueryBuildProps,
) => {
    const menus = [
        <span key='AND'>并且</span>,
        <span key='OR'>或者</span>,
        <span key='NORMAL'>添加条件</span>,
    ]
    return ({ style }: { style: any }) => {
        const { dispatch: rDispatch, state: rState } = useContext(QueryContext)
        const deleteIcon = (
            <Icon
                style={{
                    position: 'absolute',
                    top: style.top - 7 + (height / 2),
                    left: style.left + width + 5,
                }}
                type="minus-circle"
                onClick={() => {
                    // 删除当前节点信息
                    const loopsDelQuery = (loopsQuery: Query[]) => {
                        const result: Query[] = []
                        loopsQuery.forEach((query) => {
                            if (query.key === key) {
                                return
                            }
                            if (query.children && query.children.length > 0) {
                                result.push({
                                    ...query,
                                    children: loopsDelQuery(query.children),
                                })
                            } else {
                                result.push(query)
                            }
                        })
                        return result
                    }
                    const newQuery = loopsDelQuery(rState.querys)

                    rDispatch({ type: 'SET_QUERYS', payload: newQuery });
                }}
            />
        )
        if (dataRef.type === 'AND') {
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
                                pageX: e.clientX,
                                pageY: e.clientY,
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
        else if (dataRef.type === 'OR') {
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
                                pageX: e.clientX,
                                pageY: e.clientY,
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
                        fields={props.fields}
                        symbols={props.symbols}
                        field={dataRef.field}
                        value={dataRef.value}
                        symbol={dataRef.symbol}
                        onChange={(field, symbol, value) => {
                            let tempQuery: Query | undefined;
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
                            loopsFindQuery(rState.querys)
                            if (tempQuery) {
                                tempQuery!.dataRef = {
                                    ...tempQuery!.dataRef,
                                    field, symbol, value,
                                }
                                if (props.onChangeField) {
                                    return props.onChangeField(field, symbol, value)
                                }
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
    dataRef: any,
    dropState: any,
    setDropState: any,
    queryBuildProps: QueryBuildProps,
) => {
    const key = shortid.generate()
    const width = dataRef.type === 'NORMAL' ? 400 : 60
    const height = dataRef.type === 'NORMAL' ? 32 : 30
    return {
        key,
        height,
        width,
        margin: {
            x: 10,
            y: 20,
        },
        dataRef,
        render: queryRender(
            dataRef,
            dropState,
            setDropState,
            key,
            width,
            height,
            queryBuildProps,
        ),
        children: [],
    } as unknown as Query
}

export const QueryBuild = React.forwardRef((props: QueryBuildProps, ref: any) => {
    const defaultQuerys = props.defaultQuerys || []
    const [dropState, setDropState] = useState<DropdownState>({
        key: '',
        visible: false,
        pageX: 0,
        pageY: 0,
        menus: [
            <span key='AND'>并且</span>,
            <span key='OR'>或者</span>,
            <span key='NORMAL'>添加条件</span>,
        ],
    })

    /** 初始化保存的节点信息 */
    const loopsQuerys = (loopQuery: Query[]) => {
        loopQuery.forEach((query: Query) => {
            if (query.children && query.children.length > 0) {
                loopsQuerys(query.children)
            }
            const tempQuery = getQuery(query.dataRef, dropState, setDropState, props)
            query.render = tempQuery.render
            query.key = tempQuery.key
            query.dataRef = query.dataRef
        })
    }
    loopsQuerys(defaultQuerys)
    initialState.querys = defaultQuerys
    const [state, dispatch] = useReducer(reducer, initialState);

    const { querys } = state

    useImperativeHandle(ref, () => ({
        getQueryJSON: () => JSON.parse(JSON.stringify(querys)),
        setQueryJSON: (json: Query[]) => {
            loopsQuerys(json)
            dispatch({ type: 'SET_QUERYS', payload: [...json] });
        },
    }))

    return (
        <QueryContext.Provider value={{ dispatch, state }}>
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
                            <span key='AND'>并且</span>,
                            <span key='OR'>或者</span>,
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
                    const tempQuery = getQuery({ type: key }, dropState, setDropState, props)
                    if (dropState.key === '') {
                        querys.push(tempQuery)

                    } else {
                        let cQuery: Query;
                        loops(querys, loopQuery => {
                            if (dropState.key === loopQuery.key) {
                                cQuery = loopQuery
                                return true
                            }
                            return false
                        })
                        cQuery!.children.push(tempQuery)
                    }

                    dispatch({ type: 'SET_QUERYS', payload: [...querys] });
                    setDropState({
                        ...dropState,
                        visible: false,
                    })
                }}
            />
        </QueryContext.Provider>
    )
})
