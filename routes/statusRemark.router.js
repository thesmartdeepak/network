/**
 * @file(asset.router.js) All routing of asset
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 29-Jan-2018
 * @lastModifedBy Deepak
 */
import express from "express";
import statusRemarkService from "../service/statusRemark.service";

const router = express.Router()

router.get("/status-remark",function(req, res){
    res.render('admin/statusRemark/view',{title:'Status/Remark'});
});


router.get('/statusRemarkCount', (req, res) => {
    // return res.send("asdf");
    statusRemarkService.countAll(req, res);
});

router.get('/allStatusRemark', (req, res) => {
    statusRemarkService.getAll(req, res);
});

router.get('/add-status-remark', (req, res) => {
    res.render('admin/statusRemark/add',{title:'Add Status/Remark'});
});

router.post('/addStatusRemark', (req, res) => {
    statusRemarkService.addStatusRemark(req, res);
});

router.post('/deleteStatusRemark', (req, res) => {
    statusRemarkService.deleteStatusRemark(req, res);
});

router.get('/edit-status-remark', (req, res) => {
    res.render('admin/statusRemark/add',{title:'Edit Status/Remark'});
});

router.post('/editStatusRemark', (req, res) => {
    statusRemarkService.editStatusRemark(req, res);
});

router.get('/oneStatusRemark', (req, res) => {
    statusRemarkService.oneStatusRemark(req, res);
});


export default router;
