/**
 * title: 禁用Form表单
 * desc: 可通过state来禁用部分的表单信息
 */

import React, { useState } from 'react'
import { Input, Button } from 'antd'
import { Form } from '../../components/index'


const form = React.createRef<any>()
const StateForm = () => {
    const [prohibit, setProhibit] = useState(true)
    return (
        <>
            <Button
                style={{
                    marginBottom: 20
                }}
                onClick={()=>{
                    setProhibit(!prohibit)
                    form.current!.validateFieldsPromise().then(({errors,values}:{errors: any,values: any})=>{
                        if(!errors){
                            console.log(values)
                        }
                    })
                }}
            >
                {!prohibit ? '禁用': '激活'}
            </Button>
            <Form
                script={`
                    [name|Field4 drop 8-8-16]        [code|Field2 drop 8-8-16 ]        [code1|Field3 drop 8-8-16] 
                    [name1|Field4 drop 8-8-16]       [code2|Field5 drop 16-2-22]
                    [name2|Field6 drop 16-2-22]      [code3|Field7 drop 8-8-16]
                `}
                refExt={form}
                components={[{
                    name: 'drop',
                    component: <Input  disabled={prohibit}/>
                }]}
                onValuesChange ={(changedValues: any, allValues: any)=>{
                  console.log('----------------')
                  console.log('changedValues: ')
                  console.log(changedValues)
                  console.log('----------------')
                  console.log('allValues: ')
                  console.log(allValues)
                }}
            />
        </>
    )
}

export default StateForm