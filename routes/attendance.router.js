/**
 * @file(kit.router.js) All routing of Project
 * @author Yogendra Pal <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import attendanceService from "../service/attendance.service";
const router = express.Router();

router.get("/add-tracking-sheet",function(req, res){
    res.render('admin/attendance/add',{title:'Add tracking-sheet'})
});

router.post("/addAttendance",attendanceService.addAttendance);

router.get("/view-tracking-sheet",function(req, res){
    res.render('admin/attendance/view',{title:'View tracking-sheet'});
});

router.post('/allAttendance',attendanceService.allAttendance);

export default router;
