const express =      require('express')
const {auth} =         require('../controllers')
const verifyToken =  require('../auth').verifyToken
const verifyAccess = require('../auth').verifyAccess

const usersRouter = new express.Router()

//////////////test routes - for postman///////////
usersRouter.route('/generate').post(auth.generate)  // return a token
usersRouter.route('/show').post(auth.show) // show a joke - need a token

//////////////main routes for app///////////////

usersRouter.route('/').get(auth.list)

usersRouter.route('/register').post(auth.create)

usersRouter.post('/login', auth.authenticate)

usersRouter.post('/logout', auth.logout)

usersRouter.post('/verify', verifyAccess)

usersRouter.use(verifyToken)

usersRouter.route('/:id').get(auth.show)

usersRouter.route('/:id').patch(auth.update)

usersRouter.route('/:id').delete(auth.destroy)

module.exports = usersRouter