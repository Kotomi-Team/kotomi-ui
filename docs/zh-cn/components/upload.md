# Upload 上传文件

上传组件

|名称               |描述
|-------            |---------
|Upload.ImageUpload | 图片上传组件

## ImageUpload 图片上传组件

### 如何使用 ? 

```jsx
export const imageUpload = () => {
    return (
        <Upload.ImageUpload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        />
    )
}
```

### ImageUpload 属性

|名称        | 类型                | 默认值            | 描述
|----       |----                |-----               |------
|action      |string              |无                  |上传到服务器的地址
|style  |React.CSSProperties | 无    |    css样式
|disabled  |boolean | 无     |  是否禁用当前组件
|locale     |UploadLocale   | 无 | 国际化信息
|method     | 'POST' &#124; 'PUT' &#124; 'post' &#124; 'put'| 'POST' |  请求方式，默认为post请求
|headers | HttpRequestHeader |无|  上传组件的headers头部
|beforeUpload | (file: RcFile, FileList: RcFile[]) => boolean | PromiseLike<void> | 无 |上传之前触发的事件，可以用作文件大小拦截
|defaultImageUrl | string | 无  | 当前图片的url地址，用作默认显示的图片地址
|showUploadList | boolean | 无 | 是否是图片集合 true表示显示多张图片，false表示显示一张图片，默认为false
