import React from 'react'

import { Modal } from '../components/modal/Modal';
import { Button } from 'antd';


export default { title: 'Modal' };


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

