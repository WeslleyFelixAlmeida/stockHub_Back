import { createClient } from "redis";
import { env } from "node:process";

export const redis = createClient({
  url: env.REDIS_URL,
});

redis.on("error", (err) => {
  console.log("Redis Error:", err);
});

export async function connectRedis() {
  await redis.connect();
  console.log("Redis conectado!");
}
