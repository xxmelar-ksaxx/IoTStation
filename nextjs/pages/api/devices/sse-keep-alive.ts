import {connection, setKey, setHash, del} from '@/pages/redis/redis'

// delete device
export default async function handler(req:any, res:any) {
    const { user } = req.query;
    console.log(`keep-akive user: ${user}`);
    const db=connection(0);
    // update tracker hash
    if(await db.hget("devices:sse:pipe", user?.toString() || "")){
        setHash(db, user, JSON.stringify(Date.now()), "devices:sse:alive")
        res.status(200).json({"keep-alive":true});
    }
    else{
        res.status(400).json({"keep-alive":false});
    }
}