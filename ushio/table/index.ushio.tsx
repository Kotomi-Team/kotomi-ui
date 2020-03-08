import React from 'react'
import BaseTable from './BaseTable'
import RowEditorTable from './RowEditorTable'
import DropdownMenuTable from './DropdownMenuTable'
import CellTable from './CellTable'

export const baseTable = () => {
  return <BaseTable />
}

export const rowEditorTable = () => {
  return <RowEditorTable />
}

export const dropdownMenuTable = () => {
  return <DropdownMenuTable />
}

export const cellEditorTable = () => {
  return <CellTable />
}

export default { title: 'Table' };