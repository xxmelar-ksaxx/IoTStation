import {connection, setHash} from '@/pages/redis/redis'

// add device
export default async function handler(req:any, res:any) {
    const data={
        hw_id:req.body.hw_id,
        access_key:req.body.access_key,
        label:req.body.label,
        last_update:req.body.last_update,
        HW_updates:req.body.HW_updates
    }
    const db=connection(0) // databse 5
    try{
        setHash(db, data.hw_id, JSON.stringify(data))
        // update tracker hash
        setHash(db, "last_update", JSON.stringify(Date.now()), "devices:info")
        res.status(200).json({"devices":data});
    }catch{
        res.status(400).json({"devices":"add new device failed!"});
    }
}
