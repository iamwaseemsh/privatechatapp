const {
    getToken,
    userAuth
} = require("../util")
const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash")
const bcrypt = require("bcrypt")
const salts = 5;
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const app2 = express();
app2.use(cookieParser());

router.get("/", userAuth, async (req, res) => {



    res.redirect("/search");
});



router.post("/signin", async (req, res) => {
    if (req.body.username.toLowerCase() == "") {
        return res.render("users/signin", {
            errorMessage: "Username should not be empty"
        });
    }
    if (req.body.password == "") {
        return res.render("users/signin", {
            errorMessage: "Password field should not be empty"
        });
    }

    try {
        const user = await User.findOne({
            username: req.body.username.toLowerCase()
        });
        if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result == true) {
                    res.cookie("token", getToken(user));
                    res.cookie("username", req.body.username.toLowerCase());
                    res.redirect("/search");
                } else {
                    res.render("users/signin", {
                        errorMessage: "Username or password invalid"
                    })

                }
            });


        } else {
            res.render("users/signin", {
                errorMessage: "Username or password invalid"
            })
        }
    } catch {
        res.render("users/signin", {
            errorMessage: "Username or password invalid"
        })
    }

});

router.get("/register", async (req, res) => {
    res.render("users/register");
});


router.post("/register", async (req, res) => {
    if (req.body.username == "") {
        return res.render("users/register", {
            errorMessage: "Username should not be empty"
        });
    }
    if (req.body.password == "") {
        return res.render("users/register", {
            errorMessage: "Password should not be empty"
        });
    }
    if (req.body.password2 == "") {
        return res.render("users/register", {
            errorMessage: "Confirm password should not be empty"
        });
    }
    if (req.body.password != req.body.password2) {
        return res.render("users/register", {
            errorMessage: "Password does not match"
        });
    }

    const newUserName = req.body.username.toLowerCase();
    bcrypt.hash(req.body.password, salts, async function (err, hash) {
        if (err) {
            console.log(err);
        } else {

            try {
                const user = new User({
                    username: newUserName.toLowerCase(),
                    password: hash
                });
                const newUser = await user.save();
                res.cookie("token", getToken(newUser));
                res.cookie("username", newUser.username);
                res.render("users/search")
            } catch {
                res.render("users/register", {
                    errorMessage: "Username already found",
                    user: {
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    }
                })
            }

        }
    })

})

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("username");
    res.redirect("/")
})


module.exports = router;