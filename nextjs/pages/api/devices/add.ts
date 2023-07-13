import connection from '@/libs/redis'

// add device
export default async function handler(req:any, res:any) {
    const data={
        hw_id:req.body.hw_id,
        access_key:req.body.access_key,
        label:req.body.label,
        last_update:req.body.last_update,
        HW_updates:req.body.HW_updates
    }
    const redis=connection;
    try{
        redis.hset("devices", data.hw_id, JSON.stringify(data))
        // update tracker hash
        redis.hset("devices:info", "last_update", JSON.stringify(Date.now()))
        res.status(200).json({"devices":data});
    }catch{
        res.status(400).json({"devices":"add new device failed!"});
    }
}
