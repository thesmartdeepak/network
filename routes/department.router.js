/**
 * @file(department.router.js) All routing of department
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import departmentService from "../service/department.service";

const router = express.Router()

router.get("/add-department",function(req, res){
    res.render('admin/department/add',{title:'Add department'})
});

router.post("/adddepartment",departmentService.adddepartment);

router.get("/edit-department",function(req, res){
    res.render('admin/department/add',{title:'Edit department'})
});

router.post("/editdepartment",departmentService.editdepartment);

router.get("/onedepartment",departmentService.onedepartment);

router.get("/view-department",function(req, res){
    res.render('admin/department/view',{title:'View department'})
});

router.get('/alldepartment',departmentService.alldepartment);

router.post('/deletedepartment',departmentService.deletedepartment);
router.get("/totaldepartmentList",departmentService.totaldepartmentList);


export default router;
