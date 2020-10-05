const mongoose  = require('mongoose');
chat = mongoose.Schema;
const toptcSchema = mongoose.Schema({
    text:{type:String,required:true}, 
    status:{type:Boolean, default:false} ,
    toId:{type: Schema.Types.ObjectId, ref: 'user'} , 
    fromId:{type: Schema.Types.ObjectId, ref: 'user'} , 
    senderRole:{type:String,required:true}
},{
    timestamps: true
 })

module.exports = mongoose.model('chat',toptcSchema);