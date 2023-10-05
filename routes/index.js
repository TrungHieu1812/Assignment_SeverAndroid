var express = require('express');
var router = express.Router();
var Ctrl_SignIn_Up = require('../controllers/signIn_Up.controller');
var checklogin = require('../middleware/checkLogin');


router.get('/',checklogin.check_Login, function(req, res, next) {
  res.render('index',{Uname: req.session.userid});
});

router.get('/signIn', Ctrl_SignIn_Up.SignIn);

router.post('/signIn', Ctrl_SignIn_Up.SignIn);

router.get('/signUp', Ctrl_SignIn_Up.SignUp);

router.post('/signUp', Ctrl_SignIn_Up.SignUp);

router.get('/signout',checklogin.check_Login,Ctrl_SignIn_Up.Signout);


module.exports = router;
