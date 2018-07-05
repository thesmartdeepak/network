/**
 * @file(kit.router.js) All routing of Project
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import kitService from "../service/kit.service";


const router = express.Router()

router.get("/add-kit",function(req, res){
    res.render('admin/kit/add',{title:'Add kit'})
});

router.post("/addKit",kitService.addKit);
router.get("/view-kit",function(req, res){
    res.render('admin/kit/view',{title:'View kit'});
});

router.post('/allKit',kitService.allKit);
// //router.post('/allKit',kitService.allKit);
// router.get('/allKitCount',kitService.allKitCount);
// router.post('/changeStatusRemark',kitService.changeStatusRemark);
export default router;
