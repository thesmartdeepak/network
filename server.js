import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import loggerfrom from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from './core/logger/app.logger';
import config from './core/config/config.dev';
import connectToDb from './db/connect';
import index from './routes/index.router.js';
import userType from './routes/userType.router.js';
import user from './routes/user.router.js';
import region from './routes/region.router.js';
import circle from './routes/circle.router.js';
import activity from './routes/activity.router.js';
import client from './routes/client.router.js';
import project from './routes/project.router.js';
import projectType from './routes/projectType.router.js';
import statusRemark from './routes/statusRemark.router.js';
import department from './routes/department.router.js';
import operator from './routes/operator.router.js';
import report from './routes/report.router.js';
import kit from './routes/kit.router.js';
import cab from './routes/cab.router.js';
import vendor from './routes/vendor.router.js';
import claimAdvance from './routes/claimAdvance.router.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import engine from 'ejs-locals';
import fileUpload from 'express-fileupload';

const port = config.serverPort;
logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

async function connectToMongo(){
    var data = await connectToDb();
    // userservice.RegisterSuperAdmin(config.superAdminLoginDetails);
    // console.log(data)
}
connectToMongo();


var app = express();
app.use(fileUpload());

// view engine setup


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(loggerfrom('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static(path.join(__dirname, 'public')));



app.use(cors())

var loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ success:false, code:401, msg: 'Unauthorized user!' });
  }
};

var tokenExpired = function(req, res, next) {
    return res.status(200).json({ success:false, code:419, msg: 'Token expires, Please login!!' });
};

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');


    var arr_denied  = [];
    var arr_allowed = [
        '/','/login','/logout','/test',
        '/add-user','/view-users','/edit-user',
        '/user-type',
        '/add-region','/edit-region','/view-region',
        '/add-circle','/edit-circle','/view-circle',
        '/add-activity','/edit-activity','/view-activity',
        '/add-Client','/edit-client','/view-Client',
        '/add-project','/view-project',
        '/add-project-type','/edit-project-type','/project-type',
        '/add-department','/edit-department','/view-department',
        '/add-operator','/edit-operator','/view-operator',
        '/status-remark','/add-status-remark','/edit-status-remark',
        '/basic-reporting','/graphical-reporting',
        '/mis-client','/mis-circle','/mis-business',
        '/view-billing','/update-billing',
        '/add-kit','/view-kit','/add-cab','/view-cab','/add-vendor','/view-vendor',
        '/add-claim-Advance','/view-claim-Advance'
    ];

    if(arr_allowed.indexOf(req._parsedUrl.pathname)>=0){
        next()
    } else if(arr_denied.indexOf(req.url)>=0){
        if(req.headers && req.headers.authorization && req.headers.authorization == 'Key@123'){
            next()
        }else{
            req.user = undefined;
            loginRequired(req, res, next);
        }
        
    }else{
        
        if(req.headers && req.headers.authorization){

            jwt.verify(req.headers.authorization, "shhhhh", function(err,decode){
                
                if(err){
                    req.user = undefined;
                    if(err.name == "TokenExpiredError"){
                        tokenExpired(req, res, next)
                    }else{
                        loginRequired(req, res, next);
                    }

                }else{
                    req.user = decode;
                    loginRequired(req, res, next);
                }
          } )

        }else{
              req.user = undefined;
              loginRequired(req, res, next);
        }
        
    }
})



// default options - use for file uplaod
app.post('/upload', function(req, res) {
    console.log(1,req.body)
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('images/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

app.use(index);
app.use(user);
app.use(userType);
app.use(region);
app.use(circle);
app.use(activity);
app.use(client);
app.use(project);
app.use(projectType);
app.use(department);
app.use(operator);
app.use(statusRemark);
app.use(report);
app.use(kit);
app.use(cab);
app.use(vendor);
app.use(claimAdvance);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(port, () => {
    logger.info('server started - ', port);
});

module.exports = app;