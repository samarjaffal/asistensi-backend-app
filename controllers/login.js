const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
    const { body } = request

    const { username, password } = body

    const user = await User.findOne({ username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)

    if (!(user && passwordCorrect)) {
        response.status(401).json({ status_code: 'error', status_msg: 'Invalid user or password' })
    }

    const data = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(
        data,
        process.env.SECRET,
        {
            expiresIn: "7d"
        }
    )

    response.cookie('authid', token);

    response.send({
        id: user._id,
        username: user.username,
        token
    })
})

module.exports = loginRouter
