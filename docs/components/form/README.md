# Form 表单

具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。

## 代码演示


<code src="../../../ushio/form/BaseForm.tsx" />

<code src="../../../ushio/form/InputForm.tsx" />

<code src="../../../ushio/form/StateForm.tsx" />

<code src="../../../ushio/form/RowSpaceForm.tsx" />

## Form 属性

|名称         | 类型                | 默认值            | 描述
|----         |----                |-----               |------
|script       |`string`              |无                  | 语义话脚本来进行布局
|onSubmit     | `React.FormEventHandler`| 无               | 用户提交后触发的事件
|rowSpace     | `number`| 无               | Form表单Row行的间距
|labelCol     |[ColProps](https://ant.design/components/grid-cn/#Col) | | label默认占用的位置
|wrapperCol   |[ColProps](https://ant.design/components/grid-cn/#Col)| | 组件默认占用的位置
|initialValues|`any`                | 无                 | 初始化的默认值，仅仅只是在第一次设置有效
|components   |`EditorComponent[]` | 无                 | 注册的组件信息,所有注册的组件都可以在语义化脚本中进行布局操作       



### FormUtils

|名称                  | 类型                                     | 默认值   | 描述
|----                  |----                                     |-----     |------
|validateFieldsPromise |`()=> Promise<{errors: any,values: V}>`    |           | 采用validateFieldsPromise的方式进行校验

> 其他参数参照 https://ant.design/components/form-cn/#Form  

### FormEvent 事件

|名称           | 类型                | 默认值            | 描述
|----           |----                |-----               |------
|onValuesChange |`(changedValues: any, allValues: any) => void`| 无| 表格数据改变后触发的事件。


### Rule 校验

|名称           | 类型                | 默认值            | 描述
|----           |----                |-----               |------
|name           |`string`               |无                 |组件的唯一名称
|rules         | [ValidationRule](https://ant.design/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99)[] |无 | 当前组件的校验规则


### EditorComponent 组件

|名称           | 类型                | 默认值            | 描述
|----           |----                |-----               |------
|name           |`string`               |无                 |组件的唯一名称
|component      |`JSX.Element`         |无 | 当前的组件实列