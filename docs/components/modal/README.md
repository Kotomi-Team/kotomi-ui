# Modal 对话框

模态对话框。


## 代码演示

<code src="../../../ushio/modal/BaseModal.tsx" />


## Modal 属性

|名称                |类型         | 描述
|----                |----        |------
|title               |`string`    |按钮的标题
|footerButtonVisible | `boolean`   |底部按钮是否不可见，默认为`false`，表示可见
|onConfirm           |`(self: Modal) => Promise<boolean>` | 点击确认按钮触发的事件，返回一个`true`,表示隐藏对话框，`false`表示不隐藏，注意是一个`Promise`对象
|onCancel            |`(self: Modal) => Promise<boolean>` | 同`onConfirm`
|width               |`string | number`  | 对话框的宽度