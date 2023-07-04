import {connection, setKey} from '@/pages/redis/redis'

// add device
export default async function handler(req:any, res:any) {
    const data={
        hw_id:req.body.hw_id,
        access_key:req.body.access_key,
        label:req.body.label,
        last_update:req.body.last_update
    }
    const db=connection(5) // databse 5
    setKey(db, data.hw_id, JSON.stringify(data))
    res.status(200).json({"devices":data});
}

// delete device

// update device

// SSE

// has_update -> spesific device