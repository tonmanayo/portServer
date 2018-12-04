import mongoose from 'mongoose';

const remoteUser = new mongoose.Schema({
    ip: {type: String},
    pic: {type: Buffer}
});

export default mongoose.model('remoteUser', remoteUser);