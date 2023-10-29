const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const { resourceUsage } = require('process')
const path = require("path");

const fileUpload = require('express-fileupload')
const validateMiddleWare = require('./middleware/validation')
const expressSession = require('express-session')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')

const app = new express()

const views = path.join(__dirname + '/views');
app.set("views", views);
app.set('view engine','ejs')

// app.use(express.static('public')) 
app.use(express.static(__dirname + "/public")) 
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(flash())

global.loggedIn = null;

app.use('/posts/store',validateMiddleWare)

app.use(expressSession({
    name: 'session',
    secret: 'my_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000, // 1hr
    }
}))

app.use("*",(req,res,next)=>{
    loggedIn = req.session.userId
    next()
})

const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

app.get('/', homeController)

app.get('/post/:id',getPostController)

app.get('/posts/new',authMiddleware, newPostController)

app.post('/posts/store',authMiddleware, storePostController)

app.get('/auth/register',redirectIfAuthenticatedMiddleware,newUserController)

app.post('/users/register',redirectIfAuthenticatedMiddleware,storeUserController)

app.get('/auth/login',redirectIfAuthenticatedMiddleware, loginController)

app.post('/users/login',redirectIfAuthenticatedMiddleware,loginUserController)

app.get('/auth/logout', logoutController)

app.use((req,res)=>{
    res.render('notfound')
})

require("dotenv").config();
const url = process.env.MONGODB_URI;

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true})
const con=mongoose.connection

con.on('error',(err)=>{
    console.log(err);
})

con.once('open',()=>{
    console.log("Database Connected");
})

let port = process.env.PORT;
if (port == null || port == "") {
port = 4000;
}
app.listen(port, ()=>{
console.log('App listening...')
})

