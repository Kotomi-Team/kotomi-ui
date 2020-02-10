# Tree 表格

树形控件

## 如何使用 ? 

指定表格的数据源 loadData ，装载数据的方法，这是一个异步的方法。 

```jsx
<Tree 
    loadData={async (data: TreeNodeData)=>{
        if(data === undefined){
            return [{
                title: '节点-1',
                key: '1',
                dataRef: 1,
                children: []
            }]
        }
        const newData = JSON.parse(JSON.stringify(data))
        newData.key = data.dataRef + 1
        newData.dataRef = data.dataRef + 1
        newData.title = `节点-${data.dataRef + 1}`
        if(data.dataRef === 10){
            return []
        }
        return [newData]
    }}
/>
```
> 在loadData参数中,如果参数为undefined,那么就表示当前是第一次加载数据。



## Tree 属性

|名称        | 类型                        | 默认值  | 描述
|----       |----                          |-----   |------
|loadData  | (node: TreeNodeData | undefined) => Promise<TreeNodeData[]>| 无 | 装载子节点数据
|checkable  | boolean         | false | 是否在节点前添加 Checkbox 复选框
|checkedKeys | string[]       | []    | 选中的key,表示当前Tree中设置选中状态
|event       | TreeEvent      | 无     | 当前Tree的事件

## TreeEvent 事件

|名称        | 类型                        | 默认值  | 描述
|----       |----                          |-----   |------
|onRenderTreeNodeTitle |(data: TreeNodeData) => string | React.ReactNode| 无 | 渲染节点title的时候触发的事件，返回一个新的title对象

## TreeNodeData

|名称        | 类型                        | 默认值  | 描述
|----       |----                          |-----   |------
|key         | string                     |无      |唯一的key
|title       | string                     |无      |表格显示的标题
|dataRef     |any                         |无      |关联的数据
|children    |TreeNodeData[]              |无       | 子节点数据
