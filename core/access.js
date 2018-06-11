import msg from './message/error.msg.js';

let access = {};

access.managerAdmin = function(req,res,next){
    if(req.user.userType == 'admin' || req.user.userType == 'manager'){
        next();
    }
    else{
        res.send({"success":false, "code":"500", "msg":msg.accessDenied});
    }
}

access.coOrdinator = function(req,res,next){
    if(req.user.userType == 'co-ordinator'){
        next();
    }
    else{
        res.send({"success":false, "code":"500", "msg":msg.accessDenied});
    }
}

export default access;