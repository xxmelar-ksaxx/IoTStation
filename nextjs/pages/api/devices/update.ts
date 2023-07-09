import {connection, setHash, hget} from '@/pages/redis/redis'


// update device
export default async function handler(req:any, res:any) {
    const data={
        hw_id:req.body.hw_id,
        t:req.body.t,
        u:req.body.u,
    }
    const db=connection(0) // args -> databse number
   
    // update should hit HW, not local DB
    let dict_value =JSON.parse(await hget(db,"devices", data.hw_id));
    if(dict_value){
        dict_value.HW_updates.m.c =req.body.u;
        setHash(db, data.hw_id, JSON.stringify(dict_value))
        // update tracker hash
        setHash(db, "last_update", JSON.stringify(Date.now()), "devices:info")
        res.status(200).json({"update":data});
    }else{
        res.status(400).json({"err":"device not found"});
    }
}