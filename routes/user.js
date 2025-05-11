const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/user.js")


router.route("/signup")
.get( userController.renderSignup)
.post(wrapAsync(userController.signUp));

// router.get("/signup", userController.renderSignup);


// router.post("/signup",wrapAsync(userController.signUp));
    


router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),
    userController.userLogin
);

// router.get("/login", userController.renderLogin);


// router.post("/login",saveRedirectUrl,
//     passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),
//     userController.userLogin
// );


router.get("/logout",userController.logOut);

module.exports = router;
