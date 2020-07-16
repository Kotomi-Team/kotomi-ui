import React, { useState } from 'react'
import { Upload as AntUpload, Icon } from 'antd'
import { UploadChangeParam, UploadLocale, HttpRequestHeader, RcFile } from 'antd/lib/upload/interface'

type Props = {
    // 上传到服务器的地址
    action: string
    // css样式
    style?: React.CSSProperties
    // 是否禁用当前组件
    disabled?: boolean
    // 国际化信息
    locale?: UploadLocale
    // 请求方式，默认为post请求
    method?: 'POST' | 'PUT' | 'post' | 'put'
    // 上传组件的headers头部
    headers?: HttpRequestHeader
    // 上传之前触发的事件，可以用作文件大小拦截
    beforeUpload?: (file: RcFile, FileList: RcFile[]) => boolean | PromiseLike<void>
    // 当前图片的url地址，用作默认显示的图片地址
    defaultImageUrl?: string
    // 是否是图片集合 true表示显示多张图片，false表示显示一张图片，默认为false
    showUploadList?: boolean,
}

/**
 * 将File对象转换为base64
 */
function toBase64(img: File | Blob, callback: (result: string | ArrayBuffer) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result! as string));
    reader.readAsDataURL(img);
}

const ImageUpload = function(props: Props) {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const uploadButton = (
        <div>
          <Icon type={loading ? 'loading' : 'plus'} />
        </div>
    )
    return (
        <AntUpload
            {...props}
            listType="picture-card"
            onChange={(info: UploadChangeParam) => {
                if (info.file.status === 'uploading') {
                    setLoading(true)
                }
                if (info.file.status === 'done') {
                    toBase64(info.file.originFileObj!, (result: string) => {
                        setImageUrl(result)
                        setLoading(false)
                    })
                }
            }}
        >
            {props.defaultImageUrl || imageUrl !== '' ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </AntUpload>
    )
}

ImageUpload.defaultProps = {
    // 默认单个文件上传
    showUploadList: false,
}

export const Upload = {
    ImageUpload,
}
