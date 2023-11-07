const express = require('express')
const router = express.Router()
const { logEvents } = require('../middleware/logger')
const usersController = require('../controllers/usersController')
const User = require('../models/userModel')

// New user form route
router.get('/new', (req, res) => {
    res.render('users/new-user')
})

// Create user route
router.post('/new', (req, res) => {
    let username = req.body.username
    let email = req.body.email
    let emailConfirm = req.body.email_confirm
    let password = req.body.password
    let passwordConfirm = req.body.password_confirm

    if(username && email && emailConfirm && password && passwordConfirm){
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            emailConfirm: req.body.email_confirm,
            password: req.body.password,
            passwordConfirm: req.body.password_confirm
        })

        newUser.save((err, newUser) => {
            if(err) {
                res.render('users/new-user', { username: username, email: email, feedback: 'Error creating user: ' + err })
            }
            else{
                res.redirect(`${newUser.id}`)
            }
        })
    }
    else{
        console.log('Error creating user')
        res.render('users/new-user', { username: username, email: email, feedback: 'Please fill out all fields' })
    }
        
})

router.route('/:id')
    .get((req, res) => {
        res.render('users/user', { id: req.params.id })
    })
    .put((req, res) => {
            res.send(`Update User with ID: ${req.params.id}`)
        })
    .delete((req, res) => {
        res.send(`Delete User with ID: ${req.params.id}`)
    })

router.param('id', (req, res, next, id) => {
    console.log(`Middleware intercept for user with ID: ${id}`)
    //logEvents('User access with ID:', 'user.log')
    next()
})

module.exports = router