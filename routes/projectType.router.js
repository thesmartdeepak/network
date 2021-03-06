/**
 * @file(projectType.router.js) All routing of projectType
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import projectTypeService from "../service/projectType.service";
import access from '../core/access';

const router = express.Router();

router.get("/add-project-type",function(req, res){
    res.render('admin/projectType/add',{title:'Add Project Type'})
});

router.post("/addProjectType",access.managerAdmin,projectTypeService.addProjectType);

router.get("/edit-project-type",function(req, res){
    res.render('admin/projectType/add',{title:'Edit Project Type'})
});

router.post("/editProjectType",access.managerAdmin,projectTypeService.editProjectType);

router.get("/oneProjectType",projectTypeService.oneProjectType);

router.get("/project-type",function(req, res){
    res.render('admin/projectType/view',{title:'View Project Type'})
});

router.get('/allProjectType',projectTypeService.allProjectType);
router.get('/allProjectTypeCount',projectTypeService.allProjectTypeCount);

router.post('/deleteProjectType',access.managerAdmin,projectTypeService.deleteProjectType);
router.get("/totalProjectTypeList",projectTypeService.totalProjectTypeList);

router.post('/projectTypeByDepartment',projectTypeService.projectTypeByDepartment);

router.get('/getProjectType',projectTypeService.getProjectType);


export default router;
