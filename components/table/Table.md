## Table 表格


### Table 属性

|名称        | 类型                | 默认值  | 描述
|----       |----                |-----   |------
|columns     |ColumnProps        |       | 数据的列的信息
|loadData    |({ page, pageSize, param, sorter }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }): Promise<{ dataSource: T[], total: number }>| 无 |请求后台返回的分页数据
|theme      |TableSize           |'small' | 表格的显示样式，有以下取值 'default' | 'middle' | 'small'
|defaultPageSize |number         |300     | 默认当前表格显示的数据大小，默认为显示300条数据
|defaultParam    |any            |{}      | 请求数据的默认带参数，设置此参数，会在每次请求的时候都会带上此参数信息，建议在第一次加载数据的时候进行设置，不要通过setState来进行控制
|height          |boolean &#124; number &#124; string  | 400 | 表格的高度，默认为400px
|width           |boolean &#124; number &#124; string  | `100%` | 表格的宽度，默认为百分之百
|rowKey          |string         | `id`       | 当前表格默认的rowKey，默认为id字段，可手动设置为其他字段
|rowSelection   | 'single' &#124; 'multiple' &#124; undefined &#124; undefined | 表格的选择模式，默认为undefined不显示选择框
|editingType    | 'cell' &#124; 'row' &#124; 'none' | 'none' | 当前单元格编辑类型，cell表示单元格编辑，row表示行编辑,none 表示无编辑模式
|style          | React.CSSProperties |  | 表格的css样式
|refExt         | (self: Table<T>) => void |  | 初始化表格数据的时候，可通过self获取当前表格对象
|isAutoLoadData | boolean   | true  | 是否第一次自动装载表格数据，默认为true，第一次初始化就装载数据
|event          |  TableEvent<T>   |    |  当前表格的事件信息


### Table 事件

|名称        | 类型                                                    | 默认值  | 描述
|----       |----                                                     |-----   |------
|onSelect   |(selectedRowKeys: string[], selected: boolean) => void   |        | 用户点击选择框选中，或者取消的时候触发的事件
|onRow      |(record: T, index: number) => TableEventListeners        |        |用户点击当前行触发的事件。
|onSave     | (record: T, type: 'DELETE' | 'UPDATE' | 'CREATE') => Promise<boolean>| | 用户编辑保存会触发他的onSave事件。
|onBeforeRenderPromiseColumn     | (record:T , column: ColumnProps<T> ,render: JSX.Element) => JSX.Element| |渲染特殊单元格触发的事件
|onRenderBodyRowCssStyle     | (rowIndex: number, record: T ) => React.CSSProperties| |控制body row的css样式
|onRenderHeaderRowCssStyle     | () => React.CSSProperties| |控制header row的css样式

> 保存数据，只针对row编辑模式，cell编辑模式下onSave会在点击下一个单元格的时候触发

### Table 方法

|名称       | 描述
|----       |------
|editStash  | 暂存当前所有状态，并且确认当前所有的修改状态
|editStatus | 判断当前是否有编辑的数据，返回true表示当前表格有修改的数据，false表示当前没有修改的数据
|restore    | 恢复修改的数据，将当前表格恢复到未修改之前


### Column 属性
 
|名称        | 类型                | 默认值  | 描述
|----       |----                |-----   |------
|isEditing  |boolean             | false  | 是否可编辑，默认为false，不可编辑状态，true为可编辑
|inputType  |JSX.Element         | Input  | 当前Form的Item元素，默认为antd 的[Input](https://ant.design/components/input-cn/)组件
|rules      |ValidationRule      | []     | 当前表格列的校验规则，可参照antd的[校验规则](https://ant.design/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99)
|inputModal |'click' &#124; 'display' | 'click' | 当前表格的编辑模式，display表示一直显示在表格上，click表示点击后才能进行编辑
|aliasDataIndex |string            | `undefined` |当前表格的显示字段， dataIndex表示实际的值，aliasDataIndex表示这列的显示值，实际调用onSave保存还是操作的dataIndex字段的数据

> 以上是对于Ant Design表格的扩展属性，其他常规属性参照 [https://ant.design/components/table-cn/#Column](https://ant.design/components/table-cn/#Column) 的表格的参数。

#### Column.dataIndex 约定特殊字符

在Column的dataIndex中约定了一下的特殊字符具有特殊的含义

|名称              | 描述
|----             |------
|$operating       | 操作的列，提供了编辑和删除图标的功能列
|$operating#edit  | 只提供编辑的功能列
|$operating#del   | 只提供删除的功能列
|$state           | 显示当前表格的编辑状态
|$index           | 显示当前表格的序号

### CodeSandbox例子

- [一个简单的表格进行数据显示](https://codesandbox.io/s/basetable-v3609)
