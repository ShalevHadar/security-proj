const router = require('express').Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;

router.post("/Search", verifyToken, async (req, res) => {
    try {
        authData = jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY);        
        // db.query("SELECT title , content FROM notes WHERE email = (?) AND title LIKE (?)",
        //     [authData.user.email, `%${req.body.search}%`], (err, result) => {
        db.query(`SELECT title , content FROM notes WHERE email = (?) AND title LIKE '${req.body.search}%'`,
        [authData.user.email, `%`], (err, result) => {
                if (err) {
                    res.status(500).send("An error occurred");
                } else {
                    res.status(200).send(result);
                }
            });
    } catch {
        res.status(500).send("An error occurred");
    }
})

// router.post("/Search", verifyToken, async (req, res) => {
//     try {
//         authData = jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY)
//         result = db.query("SELECT title , content FROM notes WHERE email = (?) AND title LIKE (?)",
//             [authData.user.email, `%${req.body.search}%`])
//         console.log(result)
//         // res.status(200).send(result);
//         res.json({result})
//     } catch(error) {
//         console.log(error)
//         res.status(500).send("An error occurred");
//     }
// });

module.exports = router