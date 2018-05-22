/**
 * @file(circle.router.js) All routing of Circle
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import circleService from "../service/circle.service";

const router = express.Router()

router.get("/add-circle",function(req, res){
    res.render('admin/circle/add',{title:'Add circle'})
});

router.post("/addCircle",circleService.addCircle);

router.get("/edit-circle",function(req, res){
    res.render('admin/circle/add',{title:'Edit circle'})
});

router.post("/editCircle",circleService.editCircle);

router.get("/oneCircle",circleService.oneCircle);

router.get("/view-circle",function(req, res){
    res.render('admin/circle/view',{title:'View circle'})
});

router.get('/allCircle',circleService.allCircle);

router.post('/deleteCircle',circleService.deleteCircle);

router.get('/addCircleRequiredData',circleService.addCircleRequiredData);

export default router;
