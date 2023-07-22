import { networkInterfaces } from 'os';
import ping from 'ping';
import connection from '@/libs/redis'

const toIgnoreFirstOctat=['127','172']; // ignore 127.x.x.x and 172.x.x.x
const toAllowThirdOctat=['0','8']; // allow x.x.0.x and x.x.8.x



const redis=connection;

const identify_system_interfaces=async (ignore1octats:string[], valid3octats:string[])=>{
  /**
   * Identify system network interfaces
   * 
   * @param valid3octats - [optional] only accept ip's that has these 3rd octats
   * @returns list of interfaces ip adresses (3 octats only, ex:192.168.0)
  **/
  // console.log("Identify System Network Interfaces...");
  
  const INTERFACES_IPs=[]
  // Get the network interfaces
  const interfaces = networkInterfaces();
  // Iterate over the interfaces
  for (const name of Object.keys(interfaces)) {
    // Get the interface details
    const iface:any = interfaces[name];
    for (const addr of iface||[]) {
      const ip=(addr.cidr).split('/')[0].split('.')
      if(ip.length==4 && 
        (ignore1octats ? !ignore1octats.includes(ip[0]):true) &&
        (valid3octats ? valid3octats.includes(ip[2]):true) ){
          INTERFACES_IPs.push(`${ip[0]}.${ip[1]}.${ip[2]}`)
        }
      }
    }
  // console.log(INTERFACES_IPs)
  return INTERFACES_IPs
}

const scan_local_network=async(systemInterfacesIPs:string[])=>{
  /**
   * Scan local network for avalibale ip addresses
   * 
   * @param systemInterfacesIPs - list of system network interfaces (3 octats only, ex:192.168.0)
   * @returns list of avalible ip addresses in the local network
  */
  // console.log("Scan Local Network...");
  // console.log(`scan with: ${systemInterfacesIPs.join(" @ ")}`);
  const ipAddresses:any = [];
  for(let interfaceIP in systemInterfacesIPs) {
      const promises = [];
    
      for (let i = 2; i <= 254; i++) {
        const ipAddress = `${systemInterfacesIPs[interfaceIP]}.${i}`;
        promises.push(ping.promise.probe(ipAddress, { timeout: 1 }));
      }
    
      const results = await Promise.all(promises);
    
      results.forEach((result, index) => {
        const ipAddress = `${systemInterfacesIPs[interfaceIP]}.${index + 2}`;
        if (result.alive) {
          ipAddresses.push(ipAddress);
        }
      });
    }
  return ipAddresses;
}

const identify_devices=async(ipAdresses:string[])=>{
  /**
   * Ping ip adresses to identify if they're IoT Devices
   * 
   * @param ipAdresses - list of IP addresses
   * @returns JSON of devices info, with ip addresses
   */
  const validDevicesIPs=[];
  for(let ip in ipAdresses){
    try{
      const res = await fetch(`http://${ipAdresses[ip]}:5000/ping`);
      if(res.ok){
        const json:any = await res.json();
        validDevicesIPs[json.info.id]=ipAdresses[ip]
      }
    }catch{
      // console.log(`No iotStation device found..! `)
    }
  }
  return validDevicesIPs
}


const handle_HW_update_data=async(event:any) => {
  // console.log("recived updates from HW")
  const data = JSON.parse(event.data.replace(/'/g, '"'));
  let dict_value;
  try{
    dict_value =JSON.parse(await redis.hget("devices", data.auth.id)||"");
  }catch{
    dict_value=false;
  }
  if(dict_value){
      dict_value.HW_updates.m.i = data.data.m.i;
      dict_value.HW_updates.m.c =data.data.m.c;
      dict_value.HW_updates.s.i = data.data.s.i;
      dict_value.HW_updates.s.c =data.data.s.c;
      
      dict_value.last_update=Date.now();
      dict_value.HW_updates.i=data.data.i; // device info

      await redis.hset("devices", dict_value.hw_id, JSON.stringify(dict_value));
      // update tracker hash
      await redis.hset("devices:info", "last_update", JSON.stringify(Date.now()));
  }else{
    const newDeviceData={
      hw_id:data.auth.id,
      access_key:data.auth.key,
      label:"new device..",
      last_update:Date.now().toString(),
      HW_updates:data.data
    }
    await redis.hset("devices", newDeviceData.hw_id, JSON.stringify(newDeviceData));
      // update tracker hash
    await redis.hset("devices:info", "last_update", JSON.stringify(Date.now()));
  }
}

const set_connection_state=async(hw_id:any, state:string) => {
  let dict_value;
  try{
    dict_value =JSON.parse(await redis.hget("devices", hw_id)||"");
    // connection state
    dict_value.HW_updates.i.connected=state;
    await redis.hset("devices", dict_value.hw_id, JSON.stringify(dict_value));
    await redis.hset("devices:info", "last_update", JSON.stringify(Date.now()));
  }catch{}
}

const Alive_HW_Devices:any={};
var EventSource = require('eventsource')
const monitor_HW_updates = async(url: string, hw_id:any) => {

  const eventSource = new EventSource(url);
  
  eventSource.addEventListener('updates', handle_HW_update_data);
  
  let keepAliveTime=Date.now()
  const handle_HW_keep_alive=(event:any) => {
    keepAliveTime=Date.now()
    // console.log(`sse-hw: keep-alive.. ${keepAliveTime}`)
  }
  eventSource.addEventListener('keepalive', handle_HW_keep_alive);
  
  // TODO: change it to timeout
  const keepAliveInterval=async()=>{
    if(Date.now()-keepAliveTime<21000){
      setTimeout(keepAliveInterval, 5000);
      return;
    }
    // console.log("sse-closed: hw server not responding..!")
    eventSource.close();
    eventSource.removeEventListener('updates', handle_HW_update_data);
    eventSource.removeEventListener('keepalive', handle_HW_keep_alive);
    delete Alive_HW_Devices[hw_id];
    set_connection_state(hw_id, "false");
    // await redis.del("devices:hw:alive",hw_id)
    console.log(`deleted Alive_HW_Device -> ${hw_id} || at: ${Date.now()}`)
    
  }
  setTimeout(keepAliveInterval, 5000);
};


// TODO: not scaning after deletion!!!
export const Scan_For_Devices=async()=>{
  let scan_switch=true;
  while (scan_switch){
    const interfacesIPs=await identify_system_interfaces(toIgnoreFirstOctat, toAllowThirdOctat)
    const localIPs=await scan_local_network(interfacesIPs)
    const validDevicesIPs:any=await identify_devices(localIPs)
    // console.log('validDevicesIPs: %O',validDevicesIPs)
    for(let hw_id in validDevicesIPs){
      if(!(hw_id in Alive_HW_Devices)){
        Alive_HW_Devices[hw_id]=hw_id
        await redis.hset("devices:hw:alive", hw_id, validDevicesIPs[hw_id]);
        const url=`http://${validDevicesIPs[hw_id]}:5000/sse-updates`
        monitor_HW_updates(url, hw_id)
        console.log(`set Alive_HW_Device -> ${hw_id}`)
      }else{
        // console.log(`device alrady there!! -> id: ${hw_id}`)
      }
    }

    // update the connection state of the devices.
    const allDevices = await redis.hgetall("devices")
    for(let key in allDevices){
      if(key in validDevicesIPs){
        // console.log(`device detected at: ${validDevicesIPs[key]}  for id: ${key}`)
      }else{
        await set_connection_state(key, "false")
        // console.log(`no device detected for id:${key}`)
      }
    }
    await new Promise(resolve => setTimeout(resolve, 15000));
  }
  // setTimeout(Scan_For_Devices, 15000);
}

export const Start_Device_Discovary_Service=() => {
  try{
    console.log("Device discovary...")
    Scan_For_Devices()
  }catch{
    console.log("ERROR: Device Discovary Failed..!")
  }
}
export default Start_Device_Discovary_Service