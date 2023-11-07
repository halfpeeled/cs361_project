if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const userRouter =  require('./routes/userRoutes.js')
const { logger } = require('./middleware/logger')
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/indexRoutes')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))

app.use((req, res, next) => {
    res.locals.username = req.session.username;
    next();
  });

mongoose.connect(process.env.DATABASE_URI)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to database.'))

app.use('/pictured', indexRouter)

app.listen(process.env.PORT || 3000)

app.use('/pictured/users', userRouter)

