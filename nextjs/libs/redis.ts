import Redis from 'ioredis';

const connection=new Redis({
      host: process.env.REDIS_HOST,
      port: 6379,
      db: 0, // specify database ex:4
    });

export default connection;

// export async function setKey(db:any, key:string, value:string) {
//   await db.set(key, value);
// }

// export async function getKey(db:any, key:string) {
//     return await db.get(key);
// }

// export async function del(db:any, key:string) {
//   await db.del(key);
// }

// export async function setHash(db:any, key:string, value:any, hash?:string) {

//   await db.hset(hash ? hash:"devices", key, value);
// }

// export async function hget(db:any, hash:string, key:string) {
//   return await db.hget(hash, key);
// }

// export async function hdel(db:any, hash:string, key:string) {
//   await db.hdel(hash, key);
// }