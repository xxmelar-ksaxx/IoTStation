
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

export const updateDeviceLabel=async(json:any)=>{
  await fetch('/api/devices/update-info', {
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

export const deleteDeviceLabel=async(json:any)=>{
  await fetch('/api/devices/delete', {
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
