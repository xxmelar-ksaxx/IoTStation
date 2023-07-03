import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
    
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

  // Send SSE messages to the client
  setInterval(() => {
    const data = `data: This is a server-sent event\n\n`;
    stream.push(data);
  }, 1000);

  // Pipe the stream to the response object
  stream.pipe(res);

  // Cleanup the stream when the client disconnects
  req.on('close', () => {
    stream.destroy();
  });
}