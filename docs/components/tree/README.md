# Tree 树形控件

树形控件

## 代码演示

<code src="../../../ushio/tree/Tree.tsx" />

## Tree 属性

|名称         | 描述
|----         |------
|loadData    | 装载子节点数据
|checkable   | 是否在节点前添加 Checkbox 复选框
|checkedKeys  | 选中的key,表示当前Tree中设置选中状态
|onRenderTreeNodeTitle  | 渲染节点title的时候触发的事件，返回一个新的title对象
|onTreeNodeClick       | 点击树节点触发的事件

## TreeNodeData 

|名称        | 描述
|----        |------
|key         |唯一的key
|title       |表格显示的标题
|dataRef     |关联的数据
|children    | 子节点数据
