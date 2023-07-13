import connection from '@/libs/redis'

// delete device
export default async function handler(req:any, res:any) {
    const redis=connection;

    // TODO: delete targeted device only..!
    redis.del("devices");
    
    // update tracker hash
    redis.hset("devices:info", "last_update", JSON.stringify(Date.now()))
    res.status(200).json({"devices":"delete"});
}