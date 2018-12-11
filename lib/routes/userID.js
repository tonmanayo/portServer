import express from 'express';
let router = express.Router();
import RemoteUserModel from '../models/remoteUser'

/* GET home page. */

router.get('/allUsers', (req, res, next) => {
    const ipInfo = req.ipInfo;
    const message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country} and your ip is: ${req.ip}`;
    RemoteUserModel.find((err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'error occurred, could not get all users',
                error: err
            })
        }
        let newArr = [];
        for (let user in users) {
            if (users.hasOwnProperty(user)) {
                console.log(users);
                const base64data = Buffer.from(users[user].pic, 'binary').toString('base64');
                newArr.push({id: users[user]._id, ip: users[user].ip, pic: `data:image/jpeg;base64,${base64data}`})
            }
        }
        return res.status(201).json({
            message: message,
            payload: newArr,
            ip: req.ip
        });
    });
});

router.get('/delete/:id', (req, res, next) => {
  //console.log(req._remoteAddress);
  RemoteUserModel.findById({_id: req.params.id}, (err, user) => {
    if(err) {
      return res.status(500).json({
        message: "error, could not delete",
        error: err
      })
    }
    if (user.ip !== req._remoteAddress) {
      return res.status(401).json({
        message: "error, not Authorized",
        error: err
      })
    }
    RemoteUserModel.findByIdAndRemove({_id: req.params.id }, (err, user) => {
      if(err) {
        return res.status(500).json({
          message: "error, could not delete",
          error: err
        })
      }
      return res.status(201).json({
        message: 'Successfully Deleted user',
        payload: user
      });
    });
  });
});

router.post('/add', (req, res, next) => {
    const buffer = Buffer.from(req.body.pic, 'base64');
    let remoteUser = new RemoteUserModel({
        ip: req.body.ip,
        pic: buffer
    });
    remoteUser.save((err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Database Save error',
                error: err
            })
        }
        res.status(201).json({
            message: 'user created entry',
            payload: [{pic: `data:image/jpeg;base64,${req.body.pic}`, ip: req.body.ip, id: result._id}]
        })
    })
});

export default router;
