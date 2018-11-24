const express = require('express');
let router = express.Router();
import RemoteUserModel from './../models/remoteUser'
/* GET home page. */
router.get('/', (req, res, next) => {
    const ipInfo = req.ipInfo;
    const message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country} and your ip is: ${req.ip}`;
    RemoteUserModel.find((err, users) => {
        if (err) {
            return res.status(500).json({
                title: 'error occurred, could not get all users',
                error: err
            })
        }
        let newArr = [];
        for (let user in users) {
            if (users.hasOwnProperty(user) && users[user].hasOwnProperty('pic'))
                newArr.push({ip: users[user].ip, pic: Buffer.from(users[user].pic, 'base64').toString()})
        }
        return res.status(201).json({
            title: 'ips & pics found',
            message,
            data: newArr
        });
    });
});
router.post('/', (req, res, next) => {
    console.log('params: ');
    console.log(req.body);
    const split = req.body.pic.split(',');
    const base64string = split[1];
    const buffer = Buffer.from(base64string, 'base64');
    let remoteUser = new RemoteUserModel({
        ip: req.body.ip,
        pic: buffer
    });
    remoteUser.save((err, result) => {
        if (err) {
            return res.status(500).json({
                title: 'Database Save error',
                error: err
            })
        }
        res.status(201).json({
            title: 'user created entry',
            obj: result
        })
    })
});

module.exports = router;
