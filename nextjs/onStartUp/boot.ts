const bootedServices = {
    example1: false,
    example2: false,
};

const loop=async()=>{
    let counter=0;
    setInterval(()=>{
        counter++;
        console.log(`Looping... ${counter}`);
    },2000)
    
}
// import { ScanNetwork } from "./localDevicesScan";


const bootHandler = async () => {
// Example1 service...
if (!bootedServices.example1) {
    console.log('[pages/api/_boot.ts] => EXAMPLE1');

    bootedServices.example1 = await new Promise<boolean>(resolve => {
    setTimeout(() => {
        resolve(true);
    }, 500);
    });

    // ScanNetwork();
    
}

// Example2 service...
if (!bootedServices.example2) {
    console.log('[pages/api/_boot.ts] => EXAMPLE2');

    bootedServices.example2 = await new Promise<boolean>(resolve => {
    setTimeout(() => {
        resolve(true);
    }, 1000);
    });
}

return bootedServices;
};

export default bootHandler;