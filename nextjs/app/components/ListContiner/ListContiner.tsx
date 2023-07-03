'use client'
import ListItem from "./ListItem/ListItem"
const ListContiner=()=>{
    
    
    
    // Demo database record
    const device={
        hw_id:"ABC123",
        label:"Room light 1",
        HW_updates:{
          m: {
              i: {
                  // door: true,
                  // door_look: false
              },
              c: {
                switch:true
              }
          },
          s: {
              i: null,
              c: null
          }
        },
        last_update:"2023-03-05T14:39:17.746690Z"
    }
    const device2={
        hw_id:"ABC124",
        label:"Room light 2",
        HW_updates:{
          m: {
              i: {
                  // door: true,
                  // door_look: false
              },
              c: {
                switch_light_1:false,
                switch:true
              }
          },
          s: {
              i: null,
              c: null
          }
        },
        last_update:"2023-03-05T14:39:17.746690Z"
    }
    const device3={
        hw_id:"ABC125",
        label:"Room light 3",
        HW_updates:{
          m: {
              i: {
                  // door: true,
                  // door_look: false
              },
              c: {
                switch_light_1:false,
                switch:true
              }
          },
          s: {
              i: null,
              c: null
          }
        },
        last_update:"2023-03-05T14:39:17.746690Z"
    }
    const devices=[
        device,device2,device3
    ]

    const listItems=(items:any)=>{
        const listItems= items.map((item:any)=>{
            return (<ListItem json={item}/>)
        })


        return listItems
    }

    return (
        <div className="flex flex-col justify-center">
            {listItems(devices)}
        </div>
    )
}

export default ListContiner