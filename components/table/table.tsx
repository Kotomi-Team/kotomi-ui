import React from 'react'
import { Table as AntTable , Icon} from 'antd'
import {TableSize, ColumnProps, TableRowSelection,TableEventListeners } from 'antd/lib/table/interface'

export { ColumnProps } from 'antd/lib/table/interface'


type Props<T> = {
    // 列的信息
    columns:ColumnProps<T>[]
    // 装载数据的方法
    loadData({page, pageSize,param,sorter}:{page:number,pageSize:number,param?:any,sorter?:Sorter}):Promise<{dataSource:T[],total:number}>
    // 表格显示大小
    theme?: TableSize 
    // 默认页面显示大小，默认为300条
    defaultPageSize?: number
    // 表格高度
    height?: boolean | number | string
    // 表格的宽度
    width?: boolean | number | string
    // 数据中默认的key
    rowKey: string
    // 是否可以选中行，默认为不显示选择框
    rowSelection?: 'single'| 'multiple' | undefined
    // 当前表格的事件
    event?: TableEvent<T>
}

type State<T> = {
    dataSource:T[]
    total: number,
    loading: boolean,
    param: any,
    page: number,
    pageSize: number,
    sorter?: Sorter
}

export type Sorter = {
    // 字段名称
    name: string
    // 排序方式
    order: string
}

export type TableEvent<T> = {

    /**
     * 当前表格的选择状态
     * @param selectedRowKeys 当前所有变化的Row的key
     * @param selected        变化状态true表示选中，false表示取消
     */
    onSelect(selectedRowKeys:string[],selected: boolean):void

    /**
     * 当前行的事件
     * @param record 当前行的数据
     * @param index  当前行的索引
     */
    onRow(record: T, index: number):TableEventListeners;
}

export class Table<T> extends React.Component<Props<T>,State<T>>{
    
    state = {
        dataSource:[],
        total: 0,
        loading: false,
        param:{},
        page: 1,
        pageSize: 0,
        sorter: undefined
    }

    static defaultProps = {
        theme: "small",
        defaultPageSize: 300,
        width: false,
        height: 400,
        rowKey: 'id',
        event: {
            onSelect:()=>{},
            onRow:()=>{}
        }
    }

    componentDidMount(){
        this.requestLoadData({
            page: 1,
            pageSize: this.props.defaultPageSize!
        })
    }

    /**
     * 获得当前列的信息
     */
    protected getColumns():ColumnProps<T>[]{
        this.props.columns.forEach((column)=>{
            if(column.ellipsis === undefined){
                column.ellipsis = true
            }
            if(column.sortDirections === undefined){
                column.sortDirections = ['descend', 'ascend']
                column.sorter = true
            }
           
        })
        return this.props.columns
    }

    /**
     * 获取当前表格数据的数据源
     */
    protected getDataSource():T[]{
        return this.state.dataSource
    }

    /**
     * 用来进行表格的数据刷新，如果无参数，就是重新请求后台
     * @param param 刷新表格的参数
     */
    public refresh(param?: any){
        this.requestLoadData({
            page:this.state.page,
            pageSize:this.state.pageSize!,
            param:{
                ...this.state.param,
                ...(param || {})
            },
            sorter:this.state.sorter
        })
    }

    /**
     * 向后台请求数据
     * @param page     当前页面
     * @param pageSize 当前页面显示的数据条数
     */
    protected requestLoadData({page, pageSize,param,sorter}:{page:number,pageSize:number,param?:any,sorter?:Sorter}){
        this.setState({
            loading: true
        })

        // 如果请求失败，则做任何操作
        this.props.loadData({page, pageSize,param,sorter}).then(({dataSource,total})=>{
            this.setState({
                dataSource,
                total
            })
        }).finally(()=>{
            this.setState({
                loading: false
            })
        })
    }

    protected getRowSelection():TableRowSelection<T> | undefined{
        const self = this
        let rowProps:TableRowSelection<T> = {
            type: 'checkbox',
            onSelect:(record: T, selected: boolean, selectedRows: Object[], nativeEvent: Event)=>{
                self.props.event!.onSelect(record[self.props.rowKey],selected)
            },
            onSelectAll:(selected: boolean, selectedRows: T[], changeRows: T[])=>{
                self.props.event!.onSelect(changeRows.map((record)=> record[self.props.rowKey]),selected)
            },
        }
        switch(this.props.rowSelection){
            case 'single':
                rowProps.type = 'radio'
                return rowProps
            case 'multiple':
                rowProps.type = 'checkbox'
                return rowProps
            default:
                return undefined
        }
    }

    render(){
        return (
            <AntTable
                rowKey={this.props.rowKey}
                columns={this.getColumns()}
                dataSource={this.getDataSource()}
                loading={{
                    indicator:<Icon
                                type="loading"
                                style={{ fontSize: 24 }}
                                spin
                            />,
                    spinning:this.state.loading
                }}
                pagination={{
                    size:"small" ,
                    defaultPageSize:this.props.defaultPageSize,
                    total:this.state.total,
                }}
                onChange={(pagination, filters, sorter, extra)=>{
                    this.requestLoadData({
                        page:pagination.current!,
                        pageSize:pagination.pageSize!,
                        param: this.state.param,
                        sorter:{
                            name: sorter.field,
                            order: sorter.order
                        } as Sorter
                    })
                }}
                rowSelection = {this.getRowSelection()}
                onRow={this.props.event!.onRow}
                size="small" 
                scroll={{
                    x: this.props.width,
                    y: this.props.height
                }}
            />
        )
    }
}