/**
 * @file(kit.router.js) All routing of Project
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import vendorService from "../service/vendor.service";


const router = express.Router()

router.get("/add-vendor",function(req, res){
    res.render('admin/vendor/add',{title:'Add vendor'})
});

router.post("/addVendor",vendorService.addVendor);

router.get("/view-vendor",function(req, res){
    res.render('admin/vendor/view',{title:'View vendor'});
});

router.post('/allVendor',vendorService.allVendor);

export default router;
