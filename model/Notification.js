const mongoose  = require('mongoose');
Schema = mongoose.Schema;
const notificationSchema = mongoose.Schema({
    title:{type:String,required:true}, 
    description:{type:String,required:true},
    to:{type:String,default:'all'}
},{
    timestamps: true
 })

module.exports = mongoose.model('notification',notificationSchema);