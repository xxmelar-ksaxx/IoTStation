
export const updateDeviceState=async(json:any)=>{
    await fetch('/api/devices/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
      })
      .then(response => {
        // handle response
      })
      .catch(error => {
        // handle error
      });
    
}