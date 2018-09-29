/**
 * @file(kit.router.js) All routing of Project
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */ 

import express from "express";
import claimAdvance from "../service/claimAdvance.service";


const router = express.Router()

router.get("/add-claim-Advance",function(req, res){
    res.render('admin/claimAdvance/add',{title:'Add Claim Advance'})
});

router.post("/addclaimAdvance",claimAdvance.addclaimAdvance);

router.get("/view-claim-Advance",function(req, res){
    res.render('admin/claimAdvance/view',{title:'View Daily Advance'});
});

router.post('/allclaimAdvance',claimAdvance.allclaimAdvance);

// //router.post('/allKit',kitService.allKit);
// router.get('/allKitCount',kitService.allKitCount);
// router.post('/changeStatusRemark',kitService.changeStatusRemark);
export default router;
