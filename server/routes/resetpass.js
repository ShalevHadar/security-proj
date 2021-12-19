const router = require('express').Router();
const jwt = require("jsonwebtoken");
const config = process.env;
const bcrypt = require('bcrypt');
const changePasswordValidation = require('../validate_password.js');
const passwordConfig = require('../config');
const crypto = require('crypto');


router.post("/resetpass",changePasswordValidation, async (req, res) => {
    try {
        const { id, token, newPassword } = req.body;
        db.query("SELECT * FROM users where id=(?)", [id], async (error, results, fields) => {
            // if SQL Error
            if (error) { res.status(500).send("An error occurred"); return; }
            // if ID not in DB
            if (results.length === 0) { res.status(400).send("Invalid id"); return; }
            const { password, oldPasswords } = results[0];
            // Chake token
            const userKey = crypto.createHash('sha1').update(password).digest('hex');
            if (token != userKey) { res.status(400).send("Invalid token"); return; }
            let oldPasswordsArr = oldPasswords === null ? [] : oldPasswords.split(',');
            oldPasswordsArr = [currenHashedPassword, ...oldPasswordsArr].slice(0, passwordConfig.history);
            const newHashedPassword = crypto.createHash('sha1').update(newPassword).digest('hex');
            for (var i = 0; i < oldPasswordsArr.length; i++) {
                if (newHashedPassword === oldPasswordsArr[i]) { res.status(400).send("You have already used this password"); return; }
            }
            const oldPasswordsStr = oldPasswordsArr.join(',')
            db.query(`UPDATE users SET password = '${newHashedPassword}' , oldPasswords = '${oldPasswordsStr}' WHERE id = '${id}'`);
            res.status(200).send("password changed");
        });
    } catch (error) {
        console.log(error);
        res.status(400).send("An error occurred");
    }
})

async function checkIfPassExists(password, previousPasswords) {
    passNotMatched = true
    for (var i = 0; i < previousPasswords.length; i++) {
        const resultOfCompa = await bcrypt.compare(
            password,
            previousPasswords[i]
        );
        if (resultOfCompa) {
            passNotMatched = false;
        }
    }
    return passNotMatched;
}

module.exports = router