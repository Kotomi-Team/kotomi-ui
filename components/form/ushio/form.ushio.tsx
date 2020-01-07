import React from 'react'

import { Form } from '../Form';
import { Input } from 'antd';


export default { title: 'Form' };


export const baseForm = () => {
    return (
        <Form
            script={`
                [name|Field1 drop 8]        [code|Field2 input 8 ]        [code1|Field3 input 8] 
                [name1|Field4 input 8]       [code2|Field5 input 16-2-22]
                [name2|Field6 input 16-2-22] [code3|Field7 input 8]
            `}
            rules={[{
                name:'name',
                rules:[{ required: true, message: '请输入用户名' }]
            }]}
            components={[{
                name: 'drop',
                component: <Input />
            }]}
        />
    )
}

