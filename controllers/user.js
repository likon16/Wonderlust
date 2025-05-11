const User = require('../models/user.js');


module.exports.renderSignup = (req, res) => {
res.render("users/signup.ejs");
}


module.exports.signUp = async (req, res) => {
    try{
        let { username, email, password } = req.body;
const newUser = new User({ username, email });

const registeredUser = await User.register(newUser, password)
console.log(registeredUser);
req.login(registeredUser, (err) => {
    if (err) {
       return next(err);
    }
    req.flash("success", "User Successfully registered!");
    res.redirect("/listings");
});
}
catch (err) {
    console.log(err);
    req.flash("error", "User already exist!.");
    res.redirect("/signup");
}
}


module.exports.renderLogin =(req, res) => {
    res.render("users/login.ejs");
}

module.exports.userLogin = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");

    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logOut =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
}