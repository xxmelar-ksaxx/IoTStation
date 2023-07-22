import connection from '@/libs/redis'

// update device
export default async function handler(req:any, res:any) {
    const data={
        hw_id:req.body.hw_id,
        t:req.body.t,
        u:req.body.u,
    }
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const redis=connection 
    
    // Sends updated data to HW directlly..
    try{
        const ipAddress = await redis.hget("devices:hw:alive", data.hw_id);
        const res = await fetch(`http://${ipAddress}:5000/update`, options);
        if(res.ok){
            console.log(`UI: user updated device -> ${data.hw_id}`)
        }
    }catch{
        console.log(`UI: user updated device Failed!! -> ${data.hw_id}`)
        return res.status(400).json({"err":"device not found"});
    }
    res.status(200).json({"update":data});

}