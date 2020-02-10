# Modal 对话框

模态对话框。

## 如何使用 ? 

```jsx
export const baseoMdal = () => {
    let modal:Modal | null = null
    return (
        <>
          <Button
            onClick={()=>{
              modal!.show()
            }}          
          > click me show modal </Button>

          <Modal
            ref={(_modal)=>{
              modal = _modal
            }}
            title='My title is Modal'
            onConfirm={()=>{
              return new Promise((re)=>{
                setTimeout(()=>{
                  re(true)
                },3000)
              })
            }}
          >
                <p> show children0 </p>
                <p> show children1 </p>
                <p> show children2 </p>
                <p> show children3 </p>
                <p> show children4 </p>
                <p> show children5 </p>
          </Modal>          
        </>
    )
}
```



## Modal 属性

|名称        | 类型                | 默认值            | 描述
|----       |----                |-----               |------
|title      |string              |无                  |对话框的标题
|onConfirm  |(self: Modal) => Promise<boolean> | 无    |    按钮的确认事件
|onCancel  |(self: Modal) => Promise<boolean> | 无     |   按钮取消事件，非必须
|width     |  string | number    | 无 | 按钮宽度

