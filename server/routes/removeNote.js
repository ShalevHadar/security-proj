const router = require("express").Router();
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");
const config = process.env;

router.post("/removeNote", verifyToken, async (req, res) => {
    try {
        authData = jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY);
        db.query("DELETE FROM notes WHERE email = ? and title = ?", [authData.user.email, req.body.title])
        res.status(200).send("Note removes");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
});


module.exports = router;
