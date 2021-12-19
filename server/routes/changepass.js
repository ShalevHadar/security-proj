const router = require('express').Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;
const crypto = require('crypto')
const changePasswordValidation = require('../validate_password.js');
const passwordConfig = require('../config');

router.post("/changePassword",changePasswordValidation, verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY, (error, authData) => {
        const { id, email, hashedPassword, oldPasswords, salt } = authData.user;
        if (error) { console.log(error); res.status(500).send("An authentication error occurred"); return; }
        const currenHashedPassword = crypto.createHash('sha1').update(salt + currentPassword).digest('hex');
        if (currenHashedPassword != hashedPassword) { res.status(500).send("Password is incorrect"); return; }
        const newHashedPassword = crypto.createHash('sha1').update(salt + newPassword).digest('hex');
        let oldPasswordsArr = oldPasswords === null ? [] : oldPasswords.split(',');
        oldPasswordsArr = [currenHashedPassword, ...oldPasswordsArr].slice(0, passwordConfig.history);
        for (var i = 0; i < oldPasswordsArr.length; i++) {
            if (newHashedPassword === oldPasswordsArr[i]) { res.status(400).send("You have already used this password"); return; }
        }
        const oldPasswordsStr = oldPasswordsArr.join(',')
        db.query(`UPDATE users SET password = '${newHashedPassword}' , oldPasswords = '${oldPasswordsStr}' WHERE email = '${email}'`);
        res.status(200).send("password changed");
    });
})

module.exports = router