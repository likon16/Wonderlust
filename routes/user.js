const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get("/signup", (req, res) => {
res.render("users/signup.ejs");
});


router.post("/signup",wrapAsync(async (req, res) => {
    try{
        let { username, email, password } = req.body;
const newUser = new User({ username, email });

const registeredUser = await User.register(newUser, password)
console.log(registeredUser);
 req.flash("success", "User Successfully registered!");
    res.redirect("/listings");

}
catch (err) {
    console.log(err);
    req.flash("error", "User already exist!.");
    res.redirect("/signup");
}
}));
    
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


router.post("/login",passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),
 async(req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo; // Clear the returnTo session variable after using it
    res.redirect(redirectUrl);
})



router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
});

module.exports = router;
