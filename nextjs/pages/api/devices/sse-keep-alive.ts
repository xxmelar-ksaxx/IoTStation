import connection from '@/libs/redis'

// delete device
export default async function handler(req:any, res:any) {
    const { user } = req.query;
    const redis=connection;
    if(await redis.hget("devices:sse:pipe", user?.toString() || "")){
        redis.hset("devices:sse:alive", user, JSON.stringify(Date.now()))
        res.status(200).json({"keep-alive":true});
    }
    else{
        res.status(400).json({"keep-alive":false});
    }
}