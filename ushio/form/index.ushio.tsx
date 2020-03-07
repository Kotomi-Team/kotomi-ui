import React from 'react'
import BaseForm from './BaseForm'
import StateForm from './StateForm'
import NoLabelForm from './NoLabelForm'

export const baseForm = () => {
  return <BaseForm />
}

export const stateForm = () => {
  return <StateForm />
}

export const noLabelForm = () => {
  return <NoLabelForm />
}

export default { title: 'Form' };