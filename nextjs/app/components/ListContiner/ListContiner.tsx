'use client'
import { useEffect, useState} from "react"
import ListItem from "./ListItem/ListItem"
const ListContiner=()=>{
    
    const [connected,setConnected]=useState(false);
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
    let SSEStarted=false;
    useEffect(() => {
        const startSSEUpdates=() => {
            const sse_user=generateSafeRandomId();
            const source = new EventSource(`/api/devices/sse-updates?user=${sse_user}`, { withCredentials: true });
            console.log("starting event sse")
            
            source.addEventListener('message', event => {
                const message = event.data;
                console.log(`SSE: got updates!`);
                update_devices_state(message);
            });
            source.addEventListener('open', event => {
                setConnected(true)
                console.log("SSE: connection opend !")
            });
            source.addEventListener('error', event => {
                setConnected(false)
                console.log("SSE: connection error !")
            });

            const keep_alive_checks=async()=>{
                try{
                    const keep_alive_res = await fetch(`/api/devices/sse-keep-alive?user=${sse_user}`)
                    if(keep_alive_res.status!=200) {
                        source.close();
                        console.log("closed sse: keep-alive=false")
                        setTimeout(startSSEUpdates,10000)
                    }else{
                        setTimeout(keep_alive_checks,10000)
                    }
                }catch{
                    source.close();
                    console.log("closed sse: keep-alive->faild to fetch")
                    setTimeout(startSSEUpdates,10000)
                }
            }
            setTimeout(keep_alive_checks,10000)
        }
        if(!SSEStarted){
            SSEStarted=true;
            startSSEUpdates()
        }
    }, []);

    const listItems=(items:any)=>{
        const listItems= items.map((item:any)=>{
            return (<ListItem json={item} key={item.hw_id}/>)
        })
        return listItems
    }

    return (
        <div className="flex flex-col justify-center">
            connected:{connected.toString()}
            {listItems(devices)}
        </div>
    )
}

export default ListContiner