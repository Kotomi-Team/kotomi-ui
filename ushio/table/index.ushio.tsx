import React from 'react'
import BaseTable from './BaseTable'
import RowEditorTable from './RowEditorTable'
import DropdownMenuTable from './DropdownMenuTable'

export const baseTable = () => {
  return <BaseTable />
}

export const rowEditorTable = () => {
  return <RowEditorTable />
}

export const dropdownMenuTable = () => {
  return <DropdownMenuTable />
}

export default { title: 'Table' };