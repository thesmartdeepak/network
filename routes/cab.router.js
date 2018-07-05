/**
 * @file(kit.router.js) All routing of Project
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import cabService from "../service/cab.service";


const router = express.Router()

router.get("/add-cab",function(req, res){
    res.render('admin/cab/add',{title:'Add Cab'})
});

router.post("/addCab",cabService.addCab);

router.get("/view-cab",function(req, res){
    res.render('admin/cab/view',{title:'View Cab'});
});

router.post('/allCab',cabService.allCab);

export default router;
