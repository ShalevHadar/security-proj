const router = require('express').Router();
const jwt = require("jsonwebtoken");
const config = process.env;
const sendResetPass = require("../sendMail");
const crypto = require('crypto');


const FrontIP = config.FRONT_IP
const FrontProt = config.FRONT_PROT


router.post("/forgotpass", async (req, res) => {
    try {
        const { email } = req.body;
        db.query("SELECT * FROM users where email=(?)", [email], async (error, results, fields) => {
            if (error) { res.status(500).send("An error occurred"); return; }
            if (results.length === 0) { res.status(400).send("The account not exists"); return; }
            const { id, email, firstName, lastName, password } = results[0]
            const token = crypto.createHash('sha1').update(password).digest('hex');
            const link = `http://${FrontIP}:${FrontProt}/resetpass/${id}/${token}`
            // console.log("link: ",link)
            sendResetPass(email, firstName, lastName, link)
            res.status(200).send("Password link has been send to you're email");
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
})


module.exports = router