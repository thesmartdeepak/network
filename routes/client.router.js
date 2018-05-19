/**
 * @file(client.router.js) All routing of client
 * @author Deepak Nagar <deepak.nagarmca@gmail.com>
 * @version 1.0.0
 * @lastModifed 05-May-2018
 * @lastModifedBy Deepak
 */

import express from "express";
import clientService from "../service/client.service";

const router = express.Router()

router.get("/add-client",function(req, res){
    res.render('admin/client/add',{title:'Add client'})
});

router.post("/addclient",clientService.addclient);

router.get("/edit-client",function(req, res){
    res.render('admin/client/add',{title:'Edit client'})
});

router.post("/editclient",clientService.editclient);

router.get("/oneclient",clientService.oneclient);

router.get("/view-client",function(req, res){
    res.render('admin/client/view',{title:'View client'})
});

router.get('/allclient',clientService.allclient);

router.get('/allclientCount',clientService.allclientCount);

router.post('/deleteclient',clientService.deleteclient);

export default router;
