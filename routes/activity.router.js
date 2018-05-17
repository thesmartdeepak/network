/**
 * @file(activity.router.js) All routing of Activity
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import activityService from "../service/activity.service";

const router = express.Router()

router.get("/add-activity",function(req, res){
    res.render('admin/activity/add',{title:'Add activity'})
});

router.post("/addActivity",activityService.addActivity);

router.get("/edit-activity",function(req, res){
    res.render('admin/activity/add',{title:'Edit activity'})
});

router.post("/editActivity",activityService.editActivity);

router.get("/oneActivity",activityService.oneActivity);

router.get("/view-activity",function(req, res){
    res.render('admin/activity/view',{title:'View activity'})
});

router.get('/allActivity',activityService.allActivity);

router.get('/allActivityCount',activityService.allActivityCount);

router.post('/deleteActivity',activityService.deleteActivity);

export default router;
