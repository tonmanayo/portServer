var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    console.log(req.ip);
    res.json(req.ip)
});

module.exports = router;
