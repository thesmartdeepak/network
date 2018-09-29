/**
 * @file(kit.router.js) All routing of Project
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import claimMonthly from "../service/claimMonthly.service";

 
const router = express.Router()
 
router.get("/add-claim-Advance",function(req, res){
    res.render('admin/claimMonthly/add',{title:'Add Claim Monthly'})
});

router.post("/addclaimMonthly",claimMonthly.addclaimMonthly);

router.get("/view-claim-Monthly",function(req, res){
    res.render('admin/claimAdvance/monthly',{title:'View Claim Monthly'});
});

router.post('/allclaimMonthly',claimMonthly.allclaimMonthly);


// //router.post('/allKit',kitService.allKit);
// router.get('/allKitCount',kitService.allKitCount);
// router.post('/changeStatusRemark',kitService.changeStatusRemark);
export default router;
