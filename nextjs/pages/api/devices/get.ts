import {connection, getKey} from '@/pages/redis/redis'

// add device
export default async function handler(req:any, res:any) {
    const db = connection(5) // databse 5
    let data = await getKey(db, "RVC8I9")
    data=JSON.parse(data)
    res.status(200).json({"device":data});
}

// delete device

// update device

// SSE

// has_update -> spesific device