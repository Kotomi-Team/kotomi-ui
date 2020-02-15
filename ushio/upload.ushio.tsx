import React from 'react'
import { Upload } from '../components/index';


export default { title: 'Upload' };

export const imageUpload = () => {
    return (
        <Upload.ImageUpload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        />
    )
}