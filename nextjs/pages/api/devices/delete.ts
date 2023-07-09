import {connection, setKey, setHash, del} from '@/pages/redis/redis'

// delete device
export default async function handler(req:any, res:any) {
    const db=connection(0);
    del(db, "devices");
    // update tracker hash
    setHash(db, "last_update", JSON.stringify(Date.now()), "devices:info")
    res.status(200).json({"devices":"delete"});
}