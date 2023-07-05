'use client'
import { useEffect, useState } from "react"
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
    

    const [LastUpdate, setLastUpdate]=useState<string>('no time set yet!');
    const [temp_device, setTemp_device]=useState<any>();

    // SSE-Updates
    useEffect(() => {
        const source = new EventSource('/api/devices/sse-updates');
        console.log("starting event sse")
        
        let stream_last_update=""

        source.addEventListener('message', event => {
            const message = event.data;
            const json=JSON.parse(JSON.parse(message))
            
            if(json.last_update!=stream_last_update){
                setLastUpdate(json.last_update.toString())
                stream_last_update=json.last_update
                
                setTemp_device(json);
                
                console.table(json)
                console.log("last update is updated")
          }
        });
    
        return () => {
            source.close();
            console.log("closed sse")

        };
    }, []);

    useEffect(() => {
        console.log("last update is updated  __   from useEffect")
    },[LastUpdate])



    const listItems=(items:any)=>{
        const listItems= items.map((item:any)=>{
            return (<ListItem json={item} key={item.hw_id}/>)
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