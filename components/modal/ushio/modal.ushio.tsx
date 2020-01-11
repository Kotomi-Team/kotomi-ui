import React from 'react'

import { Modal } from '../Modal';
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
            onConfirm={async (self)=>{
              console.log(self)
              return true
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

