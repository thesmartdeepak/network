/**
 * @file(operator.router.js) All routing of operator
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import operatorService from "../service/operator.service";
import access from '../core/access';

const router = express.Router()

router.get("/add-operator",function(req, res){
    res.render('admin/operator/add',{title:'Add Operator'})
});

router.post("/addoperator",access.managerAdmin,operatorService.addoperator);

router.get("/edit-operator",function(req, res){
    res.render('admin/operator/add',{title:'Edit Operator'})
});

router.post("/editoperator",access.managerAdmin,operatorService.editoperator);

router.get("/oneoperator",operatorService.oneoperator);

router.get("/view-operator",function(req, res){
    res.render('admin/operator/view',{title:'View Operator'})
});

router.get('/alloperator',operatorService.alloperator);

router.post('/deleteoperator',access.managerAdmin,operatorService.deleteoperator);


export default router;
