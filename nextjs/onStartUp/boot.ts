const bootedServices = {
    deviceDiscovaryService: false,
    example2: false,
};

const loop=async()=>{
    let counter=0;
    setInterval(()=>{
        counter++;
        console.log(`Looping... ${counter}`);
    },2000)
    
}
import Start_Device_Discovary_Service from "./localDevicesScan";


const bootHandler = async () => {
// Example1 service...
if (!bootedServices.deviceDiscovaryService) {
    console.log('[pages/api/_boot.ts] => device discovary service starting...');

    bootedServices.deviceDiscovaryService = await new Promise<boolean>(resolve => {
    setTimeout(() => {
        Start_Device_Discovary_Service()
        resolve(true);
    }, 10);
    });
}

// Example2 service...
// if (!bootedServices.example2) {
//     console.log('[pages/api/_boot.ts] => EXAMPLE2');

//     bootedServices.example2 = await new Promise<boolean>(resolve => {
//     setTimeout(() => {
//         resolve(true);
//     }, 1000);
//     });
// }

return bootedServices;
};

export default bootHandler;