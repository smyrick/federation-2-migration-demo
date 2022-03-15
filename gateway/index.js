import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";
import { ApolloGateway as ApolloGateway1 } from "@apollo/gateway-1";
import Redis from "ioredis";

const app = express();
const gateway = new ApolloGateway();
const server = new ApolloServer({ gateway });

const gateway1 = new ApolloGateway1();
const server1 = new ApolloServer({ gateway1 });

await Promise.all([server.start(), server1.start()]);

const middleware = server.getMiddleware({ path: "/" });
const middleware1 = server1.getMiddleware({ path: "/" });

app.all('/', async (req, res, next) => {
    console.log('handle request');
    if (await gateway2rollout()) {
        console.log('gateway 2');
        middleware(req, res, next);
    } else {
        console.log('gateway 1');
        middleware1(req, res, next);
    }
});

app.listen(4000, () => console.log(`Gateway running`));

const redis = new Redis("redis:6379");

async function gateway2rollout() {
    const value = await redis.get('gateway2rollout');
    const float = parseFloat(value ?? "0");
    return float > Math.random();
}