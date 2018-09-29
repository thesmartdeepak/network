/**
 * @file(project.router.js) All routing of Project
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */ 

import express from "express";
import projectService from "../service/project.service";
import access from '../core/access';

const router = express.Router()

router.get("/add-project",function(req, res){
    res.render('admin/project/add',{title:'Add project'})
});

router.post("/addProject",projectService.addProject);

router.post('/addProjectGeneral',projectService.addProjectGeneral);

router.get("/view-project",function(req, res){
    res.render('admin/project/view',{title:'View project'});
});

router.get("/add-project-general",function(req, res){
    res.render('admin/project/addGenral',{title:'Add project'})
});

router.post('/allProject',projectService.allProject);

// router.post('/deleteProject',projectService.deleteProject);

router.get('/allProjectCount',projectService.allProjectCount);

router.post('/changeStatusRemark',projectService.changeStatusRemark);

router.get("/view-billing",function(req, res){
    res.render('admin/billing/view',{title:'Billing'});
});

router.get('/update-billing',function(req,res){
    res.render('admin/billing/update',{title:'Update billing'});
});

router.post('/updateBilling',projectService.updateBilling);

export default router;
