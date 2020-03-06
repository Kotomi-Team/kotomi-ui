import React from 'react'
import SketchPicker from './Picker'
import TestPickerBug from './TestPickerBug'

export const basePicker = () => {
  return <SketchPicker />
}

export const testPickerBug = () => {
  return <TestPickerBug />
}

export default { title: 'Picker' };