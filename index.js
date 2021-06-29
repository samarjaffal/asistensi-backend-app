require('dotenv').config();
require('./lib/mongo');

const express = require('express');
const app = express();

const cors = require("cors");

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const handleErrors = require('./middleware/handleErrors');

app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true,
}))
app.use(express.json());


app.get('/', (req, res) => {
    return res.send('Hola mundo');
})

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(handleErrors);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }