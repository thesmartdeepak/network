/**
 * @file(asset.router.js) All routing of asset
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 29-Jan-2018
 * @lastModifedBy Deepak
 */
import express from "express";
import userTypeService from "../service/userType.service";
import access from '../core/access';

const router = express.Router()

router.get("/user-type",function(req, res){
    res.render('admin/userType/view_type',{title:'View type'});
});


router.get('/userTypeCount', (req, res) => {
    // return res.send("asdf");
    userTypeService.countAll(req, res);
});

router.get('/allUserType', (req, res) => {
    userTypeService.getAll(req, res);
});

router.post('/addUserType',access.managerAdmin,userTypeService.addUserType);

router.post('/deleteUserType',access.managerAdmin,userTypeService.deleteUserType);

router.post('/editUserType',access.managerAdmin,userTypeService.editUserType);


export default router;
