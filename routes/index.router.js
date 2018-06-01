/**
 * @file(index.router.js) All routing is imported here
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 11-Jan-2018
 * @lastModifedBy Shakshi
 */
import express from "express";
const router = express.Router()



import user from './user.router.js';
// import usertype from './userType.router.js';

router.get('/', function(req, res, next) {
  res.render('admin/home', { title: 'Dashboard' });
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/test',function(req,res,next){
  res.render('admin/test/index',{title:'Network'});
});

export default router;
//export default {device, asset, region, zone, branch, user, usertype, assettype, router};
