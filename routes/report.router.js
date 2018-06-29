/**
 * @file(project.router.js) All routing of Project
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import reportService from "../service/report.service";

const router = express.Router()

router.get("/basic-reporting",function(req, res){
    res.render('admin/report/basic',{title:'Basic reporting'})
});

router.get('/getBasicReport',reportService.getBasicReport);

router.get("/graphical-reporting",function(req, res){
    res.render('admin/report/graphical',{title:'Graphical reporting'})
});

router.get('/getGraphicalReport',reportService.getGraphicalReport);

router.get('/mis-client',function(req,res){
    res.render('admin/report/misClient',{title:'Client report'});
});
router.get('/mis-circle',function(req,res){
    res.render('admin/report/misCircle',{title:'Circle report'});
});
router.get('/mis-business',function(req,res){
    res.render('admin/report/misBusiness',{title:'Business report'})
});

router.post('/getMisClientCircle',reportService.getMisClientCircle);

router.get('/getAllCircleForReporting',reportService.getAllCircleForReporting);

router.get('/getAllClinetForReporting',reportService.getAllClinetForReporting);

router.post('/getMisBusiness',reportService.getMisBusiness);

export default router;
