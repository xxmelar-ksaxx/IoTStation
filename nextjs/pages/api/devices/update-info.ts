import connection from '@/libs/redis'

// update device info (label)
export default async function handler(req:any, res:any) {
    const data={
        hw_id:req.body.hw_id,
        t:req.body.t,
        label:req.body.label,
    }
    const redis=connection 
    
    // Sends updated data to HW directlly..
    try{
        const dict_value =JSON.parse(await redis.hget("devices", data.hw_id)||"");
        dict_value.label = data.label
        const json=JSON.stringify(dict_value)
        await redis.hset("devices", data.hw_id, json)
        redis.hset("devices:info", "last_update", JSON.stringify(Date.now()))
    }catch{
        console.log(`UI: user updated device Label Failed!! -> ${data.hw_id}`)
        return res.status(400).json({"err":"device not found"});
    }
    res.status(200).json({"update":data});

}