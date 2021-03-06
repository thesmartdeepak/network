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

//******Salary Reporting******/
router.get('/mis-salary', function(req,res){
    res.render('admin/report/misSalary',{title:'Salary Report'})
});

router.post('/getMisSalary',reportService.getMisSalary);

//******Salary Reporting******/

//******Vendor Reporting******/

//******Vendor Reporting******/

//******Claim/Advance Reporting******/
router.get('/mis-claim-advance', function(req,res){
    res.render('admin/report/misClaimAdvance',{title:'Claim Advance Report'})
});
 
router.post('/getMisClaimAdvance',reportService.getMisClaimAdvance);

//******Claim/Advance Reporting******/

//******Vendor Reporting******/
router.get('/mis-vendor', function(req,res){
    res.render('admin/report/misVendor',{title:'Vendor Report'})
});

router.post('/getMisVendor',reportService.getMisVendor);

//******Vendor Reporting******/
//******Cab Reporting******/
router.get('/mis-cab', function(req,res){
    res.render('admin/report/misCab',{title:'Cab Report'})
});

router.post('/getMisCab',reportService.getMisCab);

//******Cab Reporting******/
//******Kit Reporting******/
router.get('/mis-kit', function(req,res){
    res.render('admin/report/misKit',{title:'Kit Report'})
});

router.post('/getMisKit',reportService.getMisKit); 

//******Kit Reporting******/
//******PL Reporting******/
router.get('/mis-PL', function(req,res){
    res.render('admin/report/misPL',{title:'P&L Report'})
});
//******PL Reporting Monthly******/
router.get('/mis-monthly-PL', function(req,res){
    res.render('admin/report/monthlymisPL',{title:'Monthly P&L Report'})
});


router.post('/getMisPL',reportService.getMisPL);
router.post('/getMonthlyMisPL',reportService.getMonthlyMisPL);

//******PL Reporting******/

export default router;
