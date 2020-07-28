import React from 'react'
import BaseTable from './BaseTable'
import RowEditorTable from './RowEditorTable'
import DropdownMenuTable from './DropdownMenuTable'
import CellTable from './CellTable'
import TreeTable from './TreeTable'
import RuleTable from './RuleTable'

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

export const treeTable = () =>{
  return <TreeTable />
}

export const ruleTable = () =>{
  return <RuleTable />
}


export default { title: 'Table' };