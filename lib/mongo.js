const mongoose = require('mongoose');

const { MONGO_DB_URI } = process.env

const connectionString = MONGO_DB_URI || '';

if (!connectionString) {
    throw new Error('No connection string provided.')
}


//connect to mongodb

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.error(err)
    })

process.on('uncaughtException', error => {
    console.error(error)
    mongoose.disconnect()
})
