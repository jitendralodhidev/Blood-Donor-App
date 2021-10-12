// Requiring necessary models 
const express = require('express')
const app = express()
const path = require('path')
const fileUpload = require('express-fileupload')

// Requiring local modules 
const webrouter = require('./routers/WebRouter')
const userroute = require('./routers/UserRoute')

// Requiring express  cookies and session 
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')


// Setting view engine , path , and using  middleware and router
app.set('view engine','ejs')
app.use(express.urlencoded())
app.use(express.static(path.resolve('public')))
app.use(fileUpload())

// using cookies and express session in order to login and logout features in app 
app.use(cookieParser())
app.use(expressSession({secret:"universal indore"}))

// router url 
app.use("/web",webrouter)
app.use("/user",userroute)

// Default url 
app.use("/",(request,response)=>
{
    response.redirect("/web/home")    
})


// Listening server at port 8000 
app.listen(8000,()=>
{
    console.log('http://localhost:8000')
})