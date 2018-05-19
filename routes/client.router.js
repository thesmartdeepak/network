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

router.post("/addclient",clientService.addClient);

router.get("/edit-client",function(req, res){
    res.render('admin/client/add',{title:'Edit client'})
});

router.post("/editclient",clientService.editClient);

router.get("/oneclient",clientService.oneClient);

router.get("/view-client",function(req, res){
    res.render('admin/client/view',{title:'View client'})
});

router.get('/allclient',clientService.allClient);

router.get('/allclientCount',clientService.allClientCount);

router.post('/deleteclient',clientService.deleteClient);

export default router;
