'use client'
import { useEffect, useState } from "react"
import ListItem from "./ListItem/ListItem"
const ListContiner=()=>{
 
    const [devices, setDevices]=useState<any>([]);

    const update_devices_state=(json_row:any) => {
        try{
            const json=JSON.parse(json_row)
            if(json[0]){
                setDevices(json);
            }
        }catch{
            console.log("update devices went wrong!")
        }
    }

    function generateSafeRandomId(): string {
        const length = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const crypto = window.crypto || (window as any).msCrypto;
        let result = '';
      
        if (!crypto) {
          throw new Error('Cryptographically secure random number generator unavailable');
        }
      
        const values = new Uint32Array(length);
        crypto.getRandomValues(values);
      
        for (let i = 0; i < length; i++) {
          result += characters.charAt(values[i] % characters.length);
        }
      
        return result;
    }

    // SSE-Updates
    useEffect(() => {
        const sse_user=generateSafeRandomId();
        const source = new EventSource(`/api/devices/sse-updates?user=${sse_user}`, { withCredentials: true });
        console.log("starting event sse")
        
        source.addEventListener('message', event => {
            const message = event.data;
            console.log(`SSE: got updates!`);
            update_devices_state(message);
        });
        const keepAliveInterval=setInterval(async ()=>{
            try{
                const keep_alive_res = await fetch(`/api/devices/sse-keep-alive?user=${sse_user}`)
                if(keep_alive_res.status!=200) {
                    source.close();
                    clearInterval(keepAliveInterval)
                    console.log("closed sse: keep-alive=false")
                }
            }catch{
                source.close();
                clearInterval(keepAliveInterval)
                console.log("closed sse: keep-alive->faild to fetch")
            }
        }, 10000)

        return () => {
            source.close();
            clearInterval(keepAliveInterval)
            console.log("closed sse")
        };
    }, []);

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