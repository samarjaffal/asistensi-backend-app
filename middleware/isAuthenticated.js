const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
    const authorization = request.get('authorization')

    if (!authorization) {
        return response.status(401).json({ error: 'Not authorized' });
    }

    let token = ''

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.split(' ')[1];
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'Not authorized' })
    }

    const { id: userId } = decodedToken

    request.userId = userId
    next()
}