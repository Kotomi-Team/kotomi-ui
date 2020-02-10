# Modal 对话框



## Modal 属性

|名称        | 类型                | 默认值            | 描述
|----       |----                |-----               |------
|title      |string              |无                  |对话框的标题
|onConfirm  |(self: Modal) => Promise<boolean> | 无    |    按钮的确认事件
|onCancel  |(self: Modal) => Promise<boolean> | 无     |   按钮取消事件，非必须
|width     |  string | number    | 无 | 按钮宽度

