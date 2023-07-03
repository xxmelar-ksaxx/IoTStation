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