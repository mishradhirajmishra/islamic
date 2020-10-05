
const mongoose  = require('mongoose');
Schema = mongoose.Schema;
const toptcSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true}, 
    status:{type:Boolean, default:false} ,
    visible:{type:String, default:'private'} ,
    userId:{type: Schema.Types.ObjectId, ref: 'user'} , 
    scholarId:{type: Schema.Types.ObjectId, ref: 'user'} , 
    lastMsgId:{type: Schema.Types.ObjectId, ref: 'message'}, 
    views:{type:Number, default:0} , 
})

module.exports = mongoose.model('topic',toptcSchema);