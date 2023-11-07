const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // Find user by Id
    const user = await User.findOne({ username: username, password: password }).exec()
    
    // If user not found
    if (!user) {
        return res.render('users/login', { errorMessage: 'Wrong username or password' })
    }

    req.session.username = username
    return res.redirect('/pictured/users/dashboard')
})

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean() // Don't return passwords

    // If no users found
    if (!users?.length) { // USe optional chaining to check for existence of users and then length
        return res.status(400).json({ message: 'No Users found.' })
    }
    // Otherwise return the users
    res.json(users)
})

/**
 * @desc Create new user
 * @route POST /users
 * @access Private
 */
const getUser = asyncHandler(async (req, res) => {
    const { username, email, email_confirm, password, password_confirm, img } = req.body

    return res.render('users/user', { username: username })
})

/**
 * @desc Create new user
 * @route POST /users
 * @access Private
 */
const createUser = asyncHandler(async (req, res) => {
    const { username, email, email_confirm, password, password_confirm, img } = req.body
        console.log('Creating a user: ' + username)
        // Null checks TODO: Replace with better validation
        if (!username || !email || !email_confirm || !password || !password_confirm) {
            console.log('Not all fields filled out')
            return res.render('users/new-user', { username: username, email: email, errorMessage: 'Please fill out all required fields.' })
        }

        // Duplicate check
        const duplicate = await  User.findOne( { username }).lean().exec()

        // If a duplicate was found
        if (duplicate) {
            return res.status(409).json({ message: 'Username exists.' })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10) // 10 salt rounds

        // Create and store user
        const userObject = { username, "password": hashedPassword, email, password, img }
        const user = await User.create(userObject)

        // If successfully created
        if (user) {
            req.session.username = username
            return res.render('users/dashboard', { username: username })
        }
        else {
            return res.render('users/new-user', { username: username, email: email, errorMessage: 'Error creating user: ' + err })
        }
})



/**
 * @desc Update a user
 * @route PATCH /users
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
    const { id, active, username, roles, first, middle, last, email, password, img } = req.body

    // Null checks TODO: Replace with better validation
    if (!username || !Array.isArray(roles) || !roles.length || !first || !last || !email || !password) {
        return res.status(400).json({ message: 'Please filll out all required fields.' })
    }

    // Find user by Id
    const user = await User.findById(id).exec()
    
    // If user not found
    if (!user) {
        return res.status(400).json({ message: `User ${id} not found!` })
    }

    // Duplicate check
    const duplicate = await  User.findOne( { username }).lean().exec()

    // If a duplicate username was found
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username.' })
    }

    user.username = username
    user.active = active
    user.roles = roles
    user.first = first
    user.middle = middle
    user.last = last
    user.email = email

    // If password is being updated
    if (password) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10) // 10 salt rounds
        user.password = hashedPassword
    }
    
    user.img = img

    // Save the changes
    const updatedUser = await user.save()

    res.json({ message: `User ${username} updated successfully!` })
})

/**
 * @desc Delete a user
 * @route DELETE /users
 * @access Private
 */
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // If null Id
    if (!id) {
        return res.status(400).json({ message: 'User Id required.' })
    }

    // Try to find the user by Id
    const user = await User.findById(id).exec()

    // If the user was not found
    if (!user) {
        return res.status(400).json({ message: `Cannot delete user ${id}. ID not found.` })
    }

    // Delete the user
    const result = await user.deleteOne()

    const reply = `User ${user.username} with ID ${result._id} deleted successfully.`

    res.json(reply)
})

module.exports= {
    login,
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}