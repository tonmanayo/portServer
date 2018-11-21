var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const ipInfo = req.ipInfo;
  const message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country}`;
  console.log(message);
  console.log(ipInfo);

  res.json(ipInfo)
});

module.exports = router;
