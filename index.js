const app = require("express")();
const bodyParser = require("body-parser");
const connectToPostgresAndRedis = require("./data/db-init");
const morgan = require("morgan");


app.use(bodyParser.json({ urlExtended: true }));
app.use(morgan("common"));

app.set('etag', false)

app.use("/username", require("./routes"));

connectToPostgresAndRedis().then(({ pg, redis }) => {
    app.locals.pg = pg;
    app.locals.redis = redis;

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });

}).catch(err => {
    console.log("Error connecting to Postgres and Redis", err);
}); 