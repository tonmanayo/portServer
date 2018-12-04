import express from 'express';
let router = express.Router();

/* GET home page. */
router.post('/', (req, res, next) => {
  const ipInfo = req.ipInfo;
  const message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country}`;
  console.log(req.ip);
  res.json(ipInfo)
});

export default router;
