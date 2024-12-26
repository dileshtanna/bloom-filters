const Router = require('express').Router
const { createFakeData } = require('./data/fake-data');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const username = req.query.username;
        const { pg } = req.app.locals;
        const { redis } = req.app.locals;

        const redisResult = await redis.bf.exists('usernames', username);
        console.log('redisResult: ', redisResult);

        if (redisResult) {
            const result = await pg.query('select * from users where username = $1', [username]);
            return res.status(200).send(result.rows.length > 0);
        }

        return res.status(200).send(false);
    } catch (error) {
        console.log('Error in /username GET', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const username = req.query.username;
        const { pg } = req.app.locals;
        const { redis } = req.app.locals;

        await redis.bf.add('usernames', username);
        const result = await pg.query('insert into users (username) values ($1) returning id', [username]);

        res.status(200).send(result);

    } catch (error) {
        console.log('Error in /username POST', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/fake-data', async (req, res) => {
    try {
        const { pg, redis } = req.app.locals;

        await createFakeData(pg, redis);
        res.status(200).send('Fake data created');
    } catch (error) {
        console.log('Error in /username POST', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;