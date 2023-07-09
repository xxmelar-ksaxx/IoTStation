


export const device_has_updates=(redisClient:any)=>{
}


import Redis from 'ioredis';
import { connection } from './redis';

// const redisClient = new Redis();

async function monitorHashChanges(redisClient:Redis, hashKey: string, ) {
  const pubSubClient = connection(5);

  // Subscribe to the __keyspace@0__:<key> channel for the hash
  pubSubClient.subscribe(`__keyspace@0__:${hashKey}`, (err, count) => {
    if (err) {
      console.error(`Error subscribing to Redis channel: ${err}`);
    } else {
      console.log(`Subscribed to Redis channel with ${count} subscribers`);
    }
  });

  // Listen for messages published to the channel
  pubSubClient.on('message', async (channel, message) => {
    if (channel === `__keyspace@0__:${hashKey}`) {
      // Check if the message indicates a hash modification
      if (message === 'hset' || message === 'hdel' || message === 'hmset') {
        console.log(`Hash ${hashKey} was modified with command ${message}`);

      }
    }
  });

    // Check if a certain condition is met, and unsubscribe from the channel if it is
    pubSubClient.unsubscribe(`__keyspace@0__:${hashKey}`);

}

// Example usage
// monitorHashChanges('myhash');