import connection from '@/libs/redis'

// delete device
export default async function handler(req:any, res:any) {
    const redis=connection;
    const data={
        hw_id:req.body.hw_id,
        t:req.body.t,
        label:req.body.label,
    }
    console.log(`Delete device -> ${data.hw_id}`)
    // TODO: delete targeted device only..!
    redis.hdel("devices", data.hw_id);
    // update tracker hash
    redis.hset("devices:info", "last_update", JSON.stringify(Date.now()))
    res.status(200).json({"device":"delete"});
}