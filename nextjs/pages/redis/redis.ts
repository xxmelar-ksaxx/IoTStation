import Redis from 'ioredis';

export const connection=(db:number)=>{
    return  new Redis({
      host: 'localhost',
      port: 6379,
      db: db, // specify database ex:4
    });

}

export async function setKey(db:any, key:string, value:string) {
  await db.set(key, value);
}

export async function getKey(db:any, key:string) {
    return await db.get(key);
}

export async function del(db:any, key:string) {
  await db.del(key);
}

export async function setHash(db:any, key:string, value:any, hash?:string) {

  await db.hset(hash ? hash:"devices", key, value);
}

export async function hget(db:any, hash:string, key:string) {
  return await db.hget(hash, key);
}

export async function hdel(db:any, hash:string, key:string) {
  await db.hdel(hash, key);
}