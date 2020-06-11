import React from 'react'
import BaseTree from './Tree'
import ContextMenuTree from './ContextMenuTree'
import DraggableTree from './DraggableTree'
import SelectedKeys from './SelectedKeys'
import FilterTree from './FilterTree'

export const baseTree = () => {
  return <BaseTree />
}

export const contextMenuTree = () => {
  return <ContextMenuTree />
}

export const draggableTree = () => {
  return <DraggableTree />
}

export const selectedKeys = () => {
  return <SelectedKeys />
}

export const filterTree = () => {
  return <FilterTree />
}

export default { title: 'Tree' };