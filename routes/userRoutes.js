const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.route('/new')
    .post(usersController.createUser)
    .get((req, res) => {
        res.render('users/new-user')
    })

router.route('/login')
    .post(usersController.login)
    .get((req, res) => {
        res.render('users/login')
    })

router.get('/dashboard', (req, res) => {
    let loggedIn = false;

    if(!req.session.username){
        return res.redirect('/pictured')
    }
    else{
        res.render('users/dashboard')
    }
})

module.exports = router