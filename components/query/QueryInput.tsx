import React, { useState } from 'react'
import { Input, Select, Col } from 'antd'

export interface Field {
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

    onChange: (field: string, symbol: string, value: string) => JSX.Element | void
}

export const QueryInput = (props: QueryInputProps) => {
    const [field, setField] = useState(props.field)
    const [value, setValue] = useState(props.value)
    const [symbol, setSymbol] = useState(props.symbol)
    const [valueInput, setValueInput] = useState<any>(props.onChange(field!, symbol!, value!))
    return (
        <>
            <Input.Group compact>
                <Col span={9}>
                    <Select
                        style={{ width: '100%' }}
                        value={field}
                        onChange={(changeValue: string) => {
                            setField(changeValue)
                            setValue('')
                            if (props.onChange) {

                                const tempElement = props.onChange(changeValue, symbol!, '')
                                 // @ts-ignore
                                if (React.isValidElement(tempElement)) {
                                    setValueInput(tempElement)
                                }

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
                    {valueInput === undefined ? (
                        <Input
                            style={{ width: '100%' }}
                            value={value}
                            onChange={(e) => {
                                const { value: tempValue } = e.target
                                if (props.onChange) {
                                    props.onChange(field!, symbol!, tempValue)
                                    setValue(tempValue)
                                }
                            }}
                        />
                    ) : React.cloneElement(valueInput, {
                        style: { width: '100%' },
                        value,
                        onChange: (tempValue: string) => {
                            setValue(tempValue)
                            if (props.onChange) {
                                props.onChange(field!, symbol!, tempValue!)
                            }
                        },
                    })}
                </Col>
            </Input.Group>
        </>
    )
};
