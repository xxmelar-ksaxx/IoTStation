import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import {connection, getKey} from '@/pages/redis/redis'
    
// stream of updates over SSE
// API route for streaming SSE messages
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set the content type to text/event-stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  // Create a readable stream to generate SSE messages
  const stream = new Readable({
    read() {},
  });

  // Create redis connection
  const db=connection(5) // databse 5

  // Send SSE messages to the client
  setInterval(async () => {
    const db_res = await getKey(db, "RVC8I9")
    const json = JSON.stringify(db_res)
    const data = `data: ${json}\n\n`;
    stream.push(data);
  }, 1000);

  // Pipe the stream to the response object
  stream.pipe(res);

  // Cleanup the stream when the client disconnects
  req.on('close', () => {
    stream.destroy();
  });
}