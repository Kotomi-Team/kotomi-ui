import React from 'react'
import { DragSource, DropTarget , DragSourceConnector, DropTargetConnector, DropTargetMonitor } from 'react-dnd'
import { TableContext } from './Table'
import './style/index.less'

let dragingProps: any = {}

/**
 * 可拖拽的表格行
 */

class DragRow extends React.Component<any> {

    renderRow = () => {
      let { connectDragSource, connectDropTarget, isOver, className , index , ...restProps } = this.props
      if (isOver) {
        if (index < dragingProps.index) {
          className += ' kotomi-table-row-drag-upward'
        }
        if (index > dragingProps.index) {
          className += ' kotomi-table-row-drag-downward'
        }
      }
      const props: any = restProps
      if (props.table) {
        delete props.table
      }
      return connectDropTarget(connectDragSource((
        <tr {...props} className={className} />
      )))
    }

    render() {
      return (
        <TableContext.Consumer>
          {this.renderRow}
        </TableContext.Consumer>
      )
    }
}

export default DropTarget('kotomi-table-drag-row', {
  drop: (props: any, monitor: DropTargetMonitor) => {
    if (props.index === monitor.getItem().index) {
      return
    }

    const { onDragRow } = props.table.props

    if (onDragRow) {
      const source = dragingProps.record
      const targe = props.record
      onDragRow(source, targe).then((respState: boolean) => {
        if (respState === true) {
          props.table.exchangeRow(source, targe)
        }
      })
    }
  },
}, (connect: DropTargetConnector, monitor: DropTargetMonitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
    }
})(
  DragSource('kotomi-table-drag-row', {
    beginDrag: (props: any) => {
      dragingProps = props
      return {
        index: props.index,
        record: props.record,
      }
    },
  }, (connect: DragSourceConnector) => {
    return {
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
    }
  })(DragRow),
);
