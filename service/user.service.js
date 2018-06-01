/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import User from '../models/user.model'
import UserType from '../models/userType.model'
import logger from '../core/logger/app.logger'
import successMsg from '../core/message/success.msg'
import msg from '../core/message/error.msg.js'
import utility from '../core/utility.js' 
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import nm from 'nodemailer'
import rand from 'csprng'




/**
 * [service is a object ]
 * @type {Object}
 */

const service = {};

/**
 * @description [with all the calculation before getAll function of model and after getAll]
 * @param  {[object]}
 * @param  {[object]}
 * @return {[object]}
 */

service.getAll = async (req,res) =>{
    //console.log("hiiiiii");
    // if(!req.query._id){
    //    return res.send({"success":false,"code":"500","msg":msg.clientId});
    // }
    // let clientId = utility.removeQuotationMarks(req.query.clientId);
	try{
		let dataToFind = {
            // query:{_id:req.query._id}
            query: {'status' : { $not : {$eq:"deleted"}}},
            projection:{},
            limit:10,
            skip:(req.query.page-1)*10
		};
        const user = await User.getAll(dataToFind);
        
		res.send({success:true, code:200, msg:successMsg.allUser, data:user});
	}catch(err){
		logger.error('Error in getting user- ' + err);
		res.send({success:false, code:500, msg:msg.getUser, err:err});
	}
}

service.allUserMaxCount = async (req,res) => {
    let dataToFind = {
        // query:{_id:req.query._id}
        query: {'status' : { $not : {$eq:"deleted"}}},
        projection:{},
    };
    var count = await User.getCount(dataToFind);
    res.send({success:true, code:200, msg:'', data:count});
}

/**
 * @description  [Get one user details from db]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description] 
 * @return {[type]}     [description]
 */
service.getOne=async(req,res)=>{
    let userToFind={
        _id:req.query.userId}
 
 try{
    
     const getOneUser=await User.getOne(userToFind);
     
     res.send({"success":true,"code":"200","msg":successMsg.getOneUser,"data":getOneUser});
 }
 catch(err){
     
     res.send({"success":false, "code":"500", "msg":msg.getUser,"err":err});

 }

}

service.addUserRequiredData = async(req,res)=>{
    let dataFind = {};
    dataFind.query = {};
    dataFind.projection = {"_id":0};
    let data = await UserType.getAll(dataFind);
    // console.log('----------------');
    console.log(data);
    return res.send({success:true,code:200,msg:data});
}

/**
 * @description [calculation before add user to db and after adding users ]
 * @param  {[object]}
 * @param  {[object]}
 * @return {[object]}
 */
service.addUser = async (req, res) => {

    if(!req.body.email){
      
      return res.send({success:false, code:500, msg:"EmailId is missing"})
    }
    else{
        let checkEmail = await User.getOne({"email":req.body.email});
        
        if(checkEmail){
            return res.send({success:false, code:500, msg:"Email id is aleady exist."})
        }
    }
    if(!req.body.password){
      return res.send({success:false, code:500, msg:"Password is missing"})
    }
    if(!req.body.address){
      return res.send({success:false, code:500, msg:"Address is missing"})
    }
    if(!req.body.city){
      return res.send({success:false, code:500, msg:"City is missing"})
    }
    if(!req.body.state){
      return res.send({success:false, code:500, msg:"State is missing"})
    }
    if(!req.body.pincode){
      return res.send({success:false, code:500, msg:"Pincode is missing"})
    }
    if(!req.body.phone){
      return res.send({success:false, code:500, msg:"Phone is missing"})
    }
    if(!req.body.fullname){
      return res.send({success:false, code:500, msg:"Full name is missing"})
    }
    const userToFind = {employeeId:req.body.employeeId};
    
    let userByEmpId = await User.getOne(userToFind);
    if(userByEmpId){
        return res.send({success:false, code:500, msg:"This employee id is not available."});
    }
    
    var temp =rand(100,30);
    var newPassword=temp+req.body.password;
    var token= crypto.createHash('sha512').update(req.body.password+rand).digest("hex");
    var hashed_password=crypto.createHash('sha512').update(newPassword).digest("hex");

    let userToAdd = User({

      token:token,
      salt:temp,
      temp_str:"",
      fullname:req.body.fullname,
      employeeId:req.body.employeeId,
      email: req.body.email,
      password: hashed_password,
      phone:req.body.phone,
      address:req.body.address,
      city:req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      name:req.body.name,
      status:req.body.status || "active",
      userType: req.body.userType,
      projectCode: req.body.projectCode,
      createAt: new Date(),
      updatedAt: new Date()
    });
    try {
        
        const savedUser = await User.addUser(userToAdd);
        logger.info('Adding user...');
      //  console.log(savedUser);
        res.send({"success":true, "code":"200", "msg":successMsg.addUser,"data":savedUser});
    }
    catch(err) {
        logger.error('Error in getting User- ' + err);
        res.send({"success":false, "code":"500", "msg":msg.addUser,"err":err});
    }
}

service.editUser = async(req,res)=>{
    if(!req.query.userId){
        res.send({"success":false,"code":500,"msg":msg.userId})
    }
    
    let userToFind = {"$and":[{employeeId:req.body.employeeId},{_id:{$ne:req.query.userId}}]};
    
    let userByEmpId = await User.getOne(userToFind);
    if(userByEmpId){
        return res.send({success:false, code:500, msg:"This employee id is not available."});
    }

    userToFind = {"$and":[{email:req.body.email},{_id:{$ne:req.query.userId}}]};
    
    let userByEmail = await User.getOne(userToFind);
    if(userByEmail){
        return res.send({success:false, code:500, msg:"This email is not available."});
    }

    let userEdit={
        fullname:req.body.fullname,
        employeeId:req.body.employeeId,
        email: req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        city:req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        name:req.body.name,
        status:req.body.status || "active",
        userType: req.body.userType,
        projectCode: req.body.projectCode,
        updatedAt: new Date()
    }
    
    let userToEdit={
        query:{"_id":req.query.userId},
        set:{"$set":userEdit}
    };
    try{
        const editUser= await User.updateUser(userToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.editUser,"data":editUser});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.editUser,"err":err});
    }
}

service.deleteUser = async (req, res) => {
    let userToDelete = req.body.userId;
    if(!req.body.userId){
        ({"success":false,"code":"500","msg":msg.userId });
    }
    try{
        let userToEdit={
            query:{"_id":userToDelete},
            set:{"$set":{"status":"deleted"}}
        };
        const removedUser = await User.updateUser(userToEdit);
        logger.info('Deleted user-' + removedUser);
        res.send({"success":true, "code":"200", "msg":successMsg.deleteUser,"data":removedUser});
    }
    catch(err) {
        logger.error('Failed to delete User- ' + err);
        res.send({"success":false, "code":"500", "msg":msg.deleteUser,"err":err});
    }
}

/**
 * @description [App login functionality]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */

service.login = async (req, res) =>{
    var query = {};
    if(req.body.socialType == 'google' && req.body.socialId !== undefined ){
      query = { googleId: req.body.socialId }
    } else if(req.body.socialType == 'facebook' && req.body.socialId !== undefined ) {
      query = { facebookId: req.body.socialId }
    } else if(req.body.email !== undefined  && req.body.password !== undefined ) {
      query = { email: req.body.email }
    } else {
      query = null
    }
    if(!query || !req.body.email){
        return res.send({success:false, code:500, msg:msg.emailId});
    }
    if(!query || !req.body.password){
        return res.send({success:false, code:500, msg:msg.password})
    }
    
    try{
       
        const loggedUser = await User.login(query);
     
        if(loggedUser )
        {   var temp=loggedUser.salt;
            var hash_db=loggedUser.password;
            var id=loggedUser.token;
            var userId=loggedUser.userId;
            var fullname=loggedUser.fullname;
            var email=loggedUser.email;
            var newpass=temp+req.body.password;
            var hashed_password1=crypto.createHash('sha512').update(newpass).digest("hex");
            if(hash_db==hashed_password1)
            {
                var token = jwt.sign({email:loggedUser.email,_id:loggedUser._id,userType:loggedUser.userType}, 'shhhhh');
                res.send({success:true, code:200, msg:successMsg.loginUser, data:token });
            }
            else
            {
               res.send({"success":false,"code":"500","msg":"password does not match"})
            }

        }
        else
        {
            res.send({success:false, code:500, msg:"EmailId or password does not match"})
        }
    }catch(error){
        res.send({success:false, code:500, msg:msg.login, err:error})
    }
}

service.logout = async (req, res) =>{
    res.redirect('/login');
}

var smtpTransport=nm.createTransport(
    {
        service:'Gmail',
        auth:{
            user:"guptaswati21696@gmail.com",
            pass:"vyashimishtu@121"
        }
    }
);

service.forgetPassword= async(req,res)=>
{
    var temp=rand(24,24);
    try{
         const logUser=await User.forgetPassword(req.body);
        //  console.log(logUser);
         if(logUser.length!=0)
         {
            logUser[0].temp_str=temp
            console.log(logUser[0].temp_str);
        User.findOneAndUpdate({"emailId":req.body.emailId}, {$set:{temp_str:logUser[0].temp_str}}, {new: true}, function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
          }

         console.log(doc);
        });
            var  mailOption = 
              {
                  from:"geniusguptaswati@gmail.com",
                  to:req.body.emailId,
                  subject:"reset password",
                  text:"Hello" + req.body.emailId +".Code to reset your Password is" +temp+".\n\nRegards,\nAdmin,\Thank You.",
               }
            smtpTransport.sendMail(mailOption,function(err,result)
           {
                if(err)
                {  console.log(err);
                   return res.send({"success":false,"code":"500","msg":"resetting password fail"});
                  
                }
                else
                return res.send({"success":true,"code":"200","msg":"Check your email and enter varification code"});
            })
        }
    }
    catch(err)
    {
         res.send({"success":false,"code":"500","msg":"Email does not exit!!",data:err})
    }
}

service.forgetPasswordReset=async (req,res)=>{
try{
       const logUser=await User.forgetPasswordReset(req.body);
       console.log(logUser);
       if(logUser.length!=0);
       {
          var temp = logUser[0].temp_str;
          console.log(temp);
          var temp2=rand(24,24);
          var new_pass= temp2 + req.body.npass;
          console.log(new_pass);
          var new_hashed_pass= crypto.createHash('sha512').update(new_pass).digest("hex");
          console.log(new_hashed_pass);
          console.log(req.body.code);
          if(temp==req.body.code){
              console.log("me aa gyi");
              User.findOneAndUpdate({"emailId":req.body.emailId},{$set:{password:new_hashed_pass,salt:temp2 ,temp_str:""}},{new:true}, function(err,result){
                  if(err)
                  {
                   return res.send({"success":false,"msg":"password not changed"});
                  }
                  else
                    return res.send({"success":true,"msg":"password changed succesfully"});
              })

          }
          else{
          res.send({"msg":"code not match"});
          }
       }
    }
    catch(err){
        res.send({"msg":"not valid emailid"});
    }
}
service.chnagePasswordByAdmin = async(req,res) =>
{
    var temp =rand(100,30);
    var newPassword=temp+req.body.password;
    var token= crypto.createHash('sha512').update(req.body.password+rand).digest("hex");
    var hashed_password=crypto.createHash('sha512').update(newPassword).digest("hex");

    const passwordToUpdate = {
        query:{_id:req.body.id},
        set:{"$set":{password:hashed_password,token:token,salt:temp,temp_str:""}}
    };

    await User.updateUser(passwordToUpdate);
    return res.send({"success":true,"msg":"Password changed succesfully"});

}
service.changePassword = async(req,res)=>{
    try{
        
        var temp1 = rand(160,36);
        // console.log(temp1);
        var newPass1= temp1 + req.body.newpass;
        // console.log(newPass1);
        var hashed_pass2 = crypto.createHash('sha512').update(newPass1).digest("hex");
        console.log(hashed_pass2);
         const changepass=await User.changePassword(req.body);
        //  console.log(changepass);
         if(changepass.length!=0)
         {
               var temp= changepass[0].salt;
               var hash_db=changepass[0].password;
               var newPass2=temp+ req.body.oldpass;
               var new_hashed_pass1=crypto.createHash('sha512').update(newPass2).digest("hex");
                if(hash_db==new_hashed_pass1)
                {
                    User.findOneAndUpdate({"emailId":req.body.emailId}, {$set:{password:hashed_pass2,salt:temp1}}, {new: true}, function(err, doc){
                        if(err)
                        {
                            return res.send({"success":false,"code":"500","msg":"old password not match"});
                        }
                        else
                        {
                            return res.send({"success":true,"code":"200","msg":" password changed successfully"});
                        }
                    })
                }
         }
         else
         {
           return  res.send({"success":false,"code":"500","msg":"emailId not exit!!"});
         }
    }
    catch(err)
    {
      res.send({"success":false,"code":"500","msg":"password changing fail"});

    }
}
export default service;
