const { faker } = require('@faker-js/faker');

const createFakeData = async (pg, redis) => {
    let usernames = [];
    for (let j = 0; j < 10; j++) {
        usernames = [];
        for (const _ of Array(1000000).keys()) {
            usernames.push({ username: faker.internet.username() });
        }

        // Insert usernames into redis in chunks of 10,000
        for (let i = 0; i < usernames.length; i += 10000) {
            const usernamesChunk = usernames.slice(i, i + 10000);
            await redis.bf.mAdd('usernames', usernamesChunk.map(u => u.username));
        }

        await pg.query(
            `INSERT INTO users (username)
         SELECT username FROM jsonb_to_recordset($1::jsonb) AS t (username text)`,
            [
                JSON.stringify(usernames),
            ]
        )

    }
}

module.exports = { createFakeData };