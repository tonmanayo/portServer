var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    const ipInfo = req.ipInfo;
    const message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country} and your ip is: ${req.ip}`;

    res.json({message})
});

module.exports = router;
