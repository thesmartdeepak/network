/**
 * @file(user.router.js) All routing of User
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import userService from "../service/user.service";
import access from '../core/access';

const router = express.Router();

router.get("/view-users",function(req, res){
    res.render('admin/user/view_users',{title:'View users'})
});

router.get('/allUser', (req, res) => {
    userService.getAll(req, res);
});

router.get('/allUserMaxCount',userService.allUserMaxCount);

router.get("/add-user",function(req, res){
    res.render('admin/user/add',{title:'Add user'})
});

router.post("/addUserRequiredData",userService.addUserRequiredData);

router.post('/addUser',access.managerAdmin,userService.addUser);

router.get('/oneUser', userService.getOne);

router.post('/register', (req, res) => {
    userService.addUser(req, res);
});

router.get('/edit-user', (req, res) => {
    res.render('admin/user/add',{title:'Edit user'});
});

router.post('/editUser',access.managerAdmin,userService.editUser);

router.post('/deleteUser',access.managerAdmin,userService.deleteUser); 

router.post('/login', (req, res) => {
    userService.login(req, res);
});

router.get('/logout',userService.logout);

router.post('/forgetPassword',(req,res)=>{
    userService.forgetPassword(req,res);
});

router.post('/forgetPasswordReset',(req,res)=>{
    userService.forgetPasswordReset(req,res);
});

router.post('/changePassword',access.managerAdmin,userService.chnagePasswordByAdmin);

router.post('/updateUser',(req,res)=>{
    userService.update(req,res);
})

export default router;
