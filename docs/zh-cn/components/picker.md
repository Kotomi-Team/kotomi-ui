# SketchPicker 颜色选择器

## 如何使用？

```jsx
export const sketchPicker = () => {
    return (
        <SketchPicker />
    )
}
```

## SketchPicker 属性说明

|名称        | 类型                | 默认值            | 描述
|----       |----                |-----               |------
|color      | string              | 无                |当前颜色值
|width      | string &#124; number | 无                |颜色选择器的宽度
|onChange   | (color: Color) => void |无               |选择颜色后触发的事件