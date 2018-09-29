/**
 * @file(kit.router.js) All routing of Project
 * @author Yogendra Pal <deepak.nagarmca@gmail.com>
 * @version 1.0.0  
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak 
 */  
 
import express from "express";
import attendanceService from "../service/attendanceMonthly.service";
const router = express.Router();

router.get("/add-tracking-sheet",function(req, res){
    res.render('admin/attendance/add',{title:'Add attendance sheet'})
});

router.post("/addAttendanceMonthly",attendanceService.addAttendanceMonthly);

router.get("/view-tracking-monthly",function(req, res){
    res.render('admin/attendance/monthlyview',{title:'View attendance sheet'});
});


router.post('/allAttendanceMonthly',attendanceService.allAttendanceMonthly);

router.get('/getAllAttendenceUser', attendanceService.getAllUser);

export default router;
