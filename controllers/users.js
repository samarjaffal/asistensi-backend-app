const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');

usersRouter.get('/', isAuthenticated, async (request, response) => {
    const users = await User.find({});
    response.status(200).json(users);
});

usersRouter.get('/:id', isAuthenticated, async (request, response, next) => {

    const { id } = request.params

    if (id.length !== 24) return response.status(400).json({ status_code: 'error', status_msg: 'Not a valid id' });

    User.findById(id)
        .then(user => {
            if (user) return response.json(user)
            response.status(404).end()
        })
        .catch(err => next(err));
})

usersRouter.post('/', async (request, response, next) => {
    const { body } = request

    if (Object.keys(body).length === 0) response.status(400).end()

    const { username, email, password } = body

    const saltRounds = 10
    const passwordHassed = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        email,
        password: passwordHassed
    })

    user.save()
        .then((user) => {
            if (user) return response.status(201).json(user);
        })
        .catch(error => {
            next(error);
        })
})

usersRouter.put('/:id', isAuthenticated, (request, response, next) => {
    const { id } = request.params
    const user = request.body

    if (id.length !== 24) return response.status(400).json({ status_code: 'error', status_msg: 'Not a valid id' });
    if (typeof user === 'undefined' || Object.keys(user).length === 0) return response.status(400).json({ status_code: 'error', status_msg: 'Not a valid user' });

    const newUserInfo = {
        name: user.name,
        lastname: user.lastname,
        age: user.age
    }

    User.findByIdAndUpdate(id, newUserInfo, { new: true })
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

usersRouter.delete('/:id', isAuthenticated, async (request, response, next) => {
    const { id } = request.params;

    if (id.length !== 24) return response.status(400).json({ status_code: 'error', status_msg: 'Not a valid id' });

    const user = await User.findById(id);

    if (!user) return response.sendStatus(404);

    User.findByIdAndDelete(id)
        .then((result) => {
            if (result === null) return response.status(404);
            response.status(204).end()
        })
        .catch((error) => next(error));
})

module.exports = usersRouter