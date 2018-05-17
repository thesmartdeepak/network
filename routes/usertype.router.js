/**
 * @file(asset.router.js) All routing of asset
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 29-Jan-2018
 * @lastModifedBy Deepak
 */
import express from "express";
import userTypeService from "../service/usertype.service";

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

router.post('/addUserType', (req, res) => {
    userTypeService.addUsertype(req, res);
});

router.post('/deleteUserType', (req, res) => {
    userTypeService.deleteUsertype(req, res);
});

router.post('/editUserType', (req, res) => {
    userTypeService.editUsertype(req, res);
});


export default router;
