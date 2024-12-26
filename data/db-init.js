const pg = require('pg')
const { createClient } = require('redis');

const { Client } = pg

const pgClient = new Client("postgres://postgres:postgres@localhost:5432/users")

const connectToPostgresAndRedis = async () => {
    await pgClient.connect()

    const redisClient = await createClient({
        url: 'redis://:@localhost:6379'
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    try {
        await redisClient.bf.reserve("usernames", 0.01, 64)
    } catch (error) {
        console.log('Error in creating bloom filter', error)
    }

    return { pg: pgClient, redis: redisClient };
}

module.exports = connectToPostgresAndRedis;