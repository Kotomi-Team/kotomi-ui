import React, { useState } from 'react'
import { Form } from '../../components/index'
import { Input, Button } from 'antd'


const form = React.createRef<any>()
const StateForm = () => {
    const [prohibit, setProhibit] = useState(true)
    const [clickNumber, setClickNumber] = useState(0)
    return (
        <>
            <Button
                onClick={()=>{
                    setClickNumber(clickNumber+1)
                    setProhibit(!prohibit)
                    form.current!.validateFieldsPromise().then(({errors,values}:{errors: any,values: any})=>{
                        if(!errors){
                            console.log(values)
                        }
                    })
                }}
            >
                click number {clickNumber}
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