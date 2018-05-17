import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const UserSchema = mongoose.Schema({
  
    token:{type:String},
    salt:{type:String},
    temp_str:{type:String},
    userId: {type: Number },
    userType: {type:String},
    email: {type: String , index:{unique:true} },
    password: {type: String },
    fullname:{type: String },
    address:{type: String },
    city:{type: String },
    state:{type: String },
    status:{type: String },
    pincode:{type:String},
    phone:{type:String},
    imgPath:{type:String},
    googleId: { type: String }, 
    facebookId: { type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'user'});

  UserSchema.plugin(AutoIncrement.plugin,{model:'user',field:'userId',startAt:1,incrementBy:1});

let UserModel = mongoose.model('user',UserSchema);

UserModel.getAll = (dataToFind) => {
    return UserModel.find(dataToFind.query,dataToFind.projection).sort({_id:-1}).limit(dataToFind.limit).skip(dataToFind.skip);
    // return UserModel.aggregate([
    //     { $match: dataToFind.query},
    //     {
    //     $lookup:{
    //         from:"usertype",
    //         localField:"userTypeId", 
    //         foreignField:"userTypeId",
    //         as:"userType_docs"
    //     }

    //     },
    //     { 
    //     $unwind:"$userType_docs"
    //     },
    //     {
    //         $project:{
    //             clientId:1,
    //             userId:1,
    //             emailId: 1,
    //             name:1,
    //             userTypeId:1 ,           
    //             userType:"$userType_docs.userType",          
    //             status:1

    //         }
    //     }
    // ]);
}

UserModel.getOne = (userToFind) => {
    console.log(userToFind," = userToFind")
    return UserModel.findOne(userToFind);
}
 
UserModel.addUser = (userToAdd) => {
    return userToAdd.save();
    // return UserModel.insert(userToAdd);
}

UserModel.editUser = (userToEdit) =>{
    console.log(userToEdit);
    return UserModel.update(userToEdit.query,{$set:{temp_str:"ttdd21"}});
}


UserModel.removeUser = (userId) => {
    return UserModel.remove({userId: userId});
}

UserModel.getCount = (userToCount)=>{
    
    return UserModel.find(userToCount.query).count();
}

/**
 * [Service is responsible for getting selected detail of user or client or admin]
 * @param  {[type]} user [user object contains username and password]
 * @return {[type]}      [object]
 */
UserModel.login = (user) =>{
    return UserModel.findOne({email:user.email},{clientId:1,password:1, userId:1, name:1,email:1, userType:1,salt:1, status:1 });
}

UserModel.forgetPassword = (user)=>{
    return UserModel.find({emailId:user.emailId});
}
UserModel.forgetPasswordReset=(user)=>{
    return UserModel.find({emailId:user.emailId});
}
UserModel.changePassword=(user)=>{
    return UserModel.find({emailId:user.emailId});
}
UserModel.updateUser=(userToEdit)=>{
    return UserModel.update(userToEdit.query,userToEdit.set);
}

export default UserModel;
