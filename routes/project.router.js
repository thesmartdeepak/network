/**
 * @file(project.router.js) All routing of Project
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import projectService from "../service/project.service";

const router = express.Router()

router.get("/add-project",function(req, res){
    res.render('admin/project/add',{title:'Add project'})
});

router.post("/addProject",projectService.addProject);

// router.get("/edit-project",function(req, res){
//     res.render('admin/project/add',{title:'Edit project'})
// });

// router.post("/editProject",projectService.editProject);

// router.get("/oneProject",projectService.oneProject);

router.get("/view-project",function(req, res){
    res.render('admin/project/view',{title:'View project'});
});

router.get('/allProject',projectService.allProject);

// router.post('/deleteProject',projectService.deleteProject);

router.get('/allProjectCount',projectService.allProjectCount);

router.post('/changeStatusRemark',projectService.changeStatusRemark);

export default router;
