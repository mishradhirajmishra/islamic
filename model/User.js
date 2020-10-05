const mongoose  = require('mongoose');
Schema = mongoose.Schema;
const userSchema = mongoose.Schema({
    username:{type:String,required:true}, 
    email:{type:String,required:true, unique: true} ,
    mobile:{type:Number} ,
    description:{type:String},
    password:{type:String,required:true} , 
    role:{type:String,default:'user'},   
    status:{type:String,default:'active'},   
    onlinestatus:{type:String,default:'Online'},   
    image:{type:String,default:'profile.jpg'},
    country:{type:String} 
},{
    timestamps: true
 })

module.exports = mongoose.model('user',userSchema);