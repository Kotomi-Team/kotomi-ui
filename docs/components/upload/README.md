# Upload 上传文件

上传组件


## 代码演示

<code src="../../../ushio/upload/Upload.tsx" />


## 组件信息


|名称               |描述
|-------            |---------
|Upload.ImageUpload | 图片上传组件

## ImageUpload 属性

|名称            | 描述
|----            |------
|action          |上传到服务器的地址
|style           | css样式
|disabled        | 是否禁用当前组件
|locale          | 国际化信息
|method          | 请求方式，默认为post请求
|headers         | 上传组件的headers头部
|beforeUpload    | 上传之前触发的事件，可以用作文件大小拦截
|defaultImageUrl | 当前图片的url地址，用作默认显示的图片地址
|showUploadList  | 是否是图片集合 true表示显示多张图片，false表示显示一张图片，默认为false
