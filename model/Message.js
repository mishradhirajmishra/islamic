const mongoose  = require('mongoose');
Schema = mongoose.Schema;
const msgSchema = mongoose.Schema({
    toId:{type:String,required:true}, 
    fromId:{type: Schema.Types.ObjectId, ref: 'user'}, 
    senderRole:{type:String,required:true},
    type:{type:String,required:true},
    content:{type:String,required:true},  
    status:{type:String, default:'unread'} , 
    topicId:{type:String,required:true}, 
},{
    timestamps: true
 })

module.exports = mongoose.model('message',msgSchema);