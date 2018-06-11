/**
 * @file(region.router.js) All routing of Region
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import regionService from "../service/region.service";
import access from '../core/access';

const router = express.Router()

router.get("/add-region",function(req, res){
    res.render('admin/region/add',{title:'Add region'})
});

router.post("/addRegion",access.managerAdmin,regionService.addRegion);

router.get("/edit-region",function(req, res){
    res.render('admin/region/add',{title:'Edit region'})
});

router.post("/editRegion",access.managerAdmin,regionService.editRegion);

router.get("/oneRegion",regionService.oneRegion);

router.get("/view-region",function(req, res){
    res.render('admin/region/view',{title:'View region'})
});

router.get('/allRegion',regionService.allRegion);

router.post('/deleteRegion',access.managerAdmin,regionService.deleteRegion);

export default router;
