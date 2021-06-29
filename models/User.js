const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require: true,
    },
    name: { type: String, default: '' },
    lastname: { type: String, default: '' },
    password: { type: String, default: '' },
    email: {
        type: String,
        unique: true
    },
    age: { type: Number, default: null },
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.password
    }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User
