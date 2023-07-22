import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

import connection from '@/libs/redis'

// stream of updates over SSE
// API route for streaming SSE messages
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set the content type to text/event-stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  // Client tracking
  const { user } = req.query;

  // Create a readable stream to generate SSE messages
  const stream = new Readable({
    read() {},
  });

  const redis=connection;

  // const devicesHashKey="devices"
  let intervalId: NodeJS.Timeout | null = null;

  redis.hset("devices:sse:pipe", user?.toString() || "", 'true');

  // Send SSE messages to the client
  let old_record=""
  intervalId = setInterval(async () => {
    const last_update:any=await redis.hget("devices:info", "last_update")

    if(last_update!=old_record) {
      const hashData:any = await connection.hgetall("devices")
      // console.log(`SSE: new record, client-> ${user}`);
      old_record=last_update
      let json_list=[]
      for(let key in hashData){
        const to_dict=JSON.parse(hashData[key])
        json_list.push(to_dict)
      }
      const json = JSON.stringify(json_list)
      const data = `data: ${json}\n\n`;
      stream.push(data);
    }
  }, 100);

  const keep_alive_interval = setInterval(async() => {
    const timestamp= (await redis.hget("devices:sse:alive", user?.toString() || "")||"").toString();
    const client_alive_time:any = parseInt( timestamp || "",10)
    
    if(Date.now()-(client_alive_time)>21000){
      stream.destroy();
      if (intervalId) {
        clearInterval(intervalId);
        clearInterval(keep_alive_interval);
      }
      await redis.hdel("devices:sse:pipe", user?.toString() || "")
      await redis.hdel("devices:sse:alive", user?.toString() || "");
    }
  }, 5000);

  // Pipe the stream to the response object
  stream.pipe(res);

  // Cleanup the stream when the client disconnects
  req.on('close', () => {
    stream.destroy();
    if (intervalId) {
      clearInterval(intervalId);
    }
    console.log('SSE: client disconnected')
  });
}