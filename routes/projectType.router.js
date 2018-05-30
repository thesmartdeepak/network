/**
 * @file(projecttype.router.js) All routing of projecttype
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import projecttypeService from "../service/projectType.service";

const router = express.Router()

router.get("/add-projecttype",function(req, res){
    res.render('admin/projecttype/add',{title:'Add Project Type'})
});

router.post("/addprojecttype",projecttypeService.addprojecttype);

router.get("/edit-projecttype",function(req, res){
    res.render('admin/projecttype/add',{title:'Edit Project Type'})
});

router.post("/editprojecttype",projecttypeService.editprojecttype);

router.get("/oneprojecttype",projecttypeService.oneprojecttype);

router.get("/view-projecttype",function(req, res){
    res.render('admin/projecttype/view',{title:'View Project Type'})
});

router.get('/allprojecttype',projecttypeService.allprojecttype);

router.post('/deleteprojecttype',projecttypeService.deleteprojecttype);
router.get("/totalProjecttypeList",projecttypeService.totalProjecttypeList);


export default router;
