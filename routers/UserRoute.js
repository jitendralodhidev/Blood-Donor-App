const express = require('express')
const path = require('path')

const router = express.Router()

const userModel = require('../models/Usermodels')
const requestModel = require('../models/RequestModels')

// ----------------------------- 
// router for handling profile pic 
router.post("/uploadpic",(request, response) => {
    // getting pic 
    var mypic = request.files.mypic

    // image extension name getting 
    var ext = path.extname(mypic.name)
    //generating random file name for the image using millisecond inbulid function 
    var filename = new Date().getUTCMilliseconds()+ext
    console.log(filename)
    // storing image in public/user folder 
    var filepath = path.join(__dirname, "../public/user/", filename)
    mypic.mv(filepath)
    // passing parameter to save image in database and sending back response to the frontend 
    userModel.uploadUserPic( request.session.loginuser._id,filename,(res)=>
    {
         response.redirect('/user/profile')
    })
})
// ----------------------------------------- 


// router for profile option in navbar 
router.get("/profile", (request, response) => {
    response.render('user/profile')
})
// ----------------------
// router for saving request of the user  in the database
router.post("/saverequest", (request, response) => {
    // reading data 
    var data = request.body
    // getting username and id from the Express-session 
    data.sendername = request.session.loginuser.name
    data.sender = request.session.loginuser._id

    // passing data to the models to save the records  and sending response
    requestModel.saveRequest(data, (result) => {
        response.redirect('/user/request')
    })
})
// ------------------------------

// router for user request and other user requests 
router.get("/request", (request, response) => {
    // getting id from session 
    var id = request.session.loginuser._id
    // passing id to myrequest model in request model to filter data 
    requestModel.myRequest(id, (req1) => 
    {
    // passing id to otherrequest model in request model to filter data 
        requestModel.otherRequest(id, (req2) => {

            // passing callback response to the template in form of object 
            response.render('user/request', {
                'myreq': req1,
                'otherreq': req2
            })
        })
    })
})



// Home routing 
router.get("/home", (request, response) => {
    var name = request.session.loginuser.name
    var id = request.session.loginuser._id
    console.log(name, id)

    var pic = request.session.loginuser.pic
    userModel.listOtherUser(id, (users) => {
        //console.log(users)
        response.render('user/home', {
            name: name, users: users, pic:pic
        })
    })
})

router.get("/logout", (request, response) => {
    request.session.destroy()
    response.redirect("/web/login")
})

module.exports = router

/*

Temp Data : Cookie(Browser) , Session(Server)

*/