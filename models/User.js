const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    surname:{
        type:String,
        required:true,
    },
    telephone:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password: {
      type: String,
      required:true,
    },
    role:{
        type:String,
        enum:["user","organization","admin"],
        default:"user",//otomatik user olarak giriş yapıyor
      },
});

UserSchema.pre('save', function (next){
    const user = this;
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash;
        next();
    })
  });

const User = mongoose.model('User',UserSchema);
module.exports=User;