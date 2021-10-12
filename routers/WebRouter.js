const express = require('express')
const router = express.Router()

const session = require('express-session')

// Requiring mongo db from mongo.js using fs module 
const userModel = require('../models/Usermodels')


// urls 
router.use("/user", (request, response) => {
    console.log(request.body)
    // performing save data operation using saveuserfunction in Models file
    userModel.saveUser(request.body, (result) => {
        console.log(result)
        // Sending saveuser function response with url to show action status in frontend 
        response.redirect('/web/register?actn=' + result)
    })
})


router.all("/login",(request,response)=>
{
    // if Invalid user id password 
    if(request.method=='GET')
    {
        var msg = '';
        var err = request.query.err
        if(err!=undefined)
            msg = "Invalid ID or Password !"
        response.render('login',{
            msg:msg
        })
    }else
    // if user id is correct fetching information from database 
    {
        userModel.loginUser(request.body,(result)=>
        {
            if(result){
            // if data comes under result callback then sending data to session.loginuser 
                console.log(result)
                request.session.loginuser = result
                response.redirect("/user/home")
            }else
                response.redirect("/web/login?err=1")
        })
    }
})


router.use("/register", (request, response) => {
    // sending msg to frontend if data is saved in database 
    var msg = ''
    var actn = request.query.actn

    // if action is undefined no msg will be send 
    if (actn != undefined) {
        if (actn == 'true') {
            msg = "Registion Done succesfully.....!"
        }
        else {
            msg = "Registation Failed user may already exist"
        }
    }
    response.render('register', { msg: msg })
})
router.use("/home", (request, response) => {
    response.render('index')
})

router.use("/contact", (request, response) => {
    response.render('contact')

})

module.exports = router