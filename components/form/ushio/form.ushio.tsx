import React from 'react'

import { Form } from '../Form';


export default { title: 'Form' };


export const baseForm = () => {
    return (
        <Form
            script={`
                [name|显示名称 input 12] [code|显示代号 input 12]
                [name1|名称 input 12] [code1|代号 input 12]
            `}
        />
    )
}

