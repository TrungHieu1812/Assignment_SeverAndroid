var express = require('express');
var router = express.Router();
// var apiU = require('../controllers/api/api-user')
var apiP = require('../controllers/api/api-product')


var api_logIn_Out = require('../controllers/api/api-logIn-Reg');
var mdw = require('../middleware/api-auth')



router.post('/login', api_logIn_Out.login); // đăng nhập
router.post('/reg', api_logIn_Out.reg); // đăng ký
router.get('/logout',mdw.api_auth, api_logIn_Out.logout); // đăng xuất



router.get('/products',mdw.api_auth, apiP.listProd); // ds u:  /api/users
// router.post('/products',mdw.api_auth, apiP.addProd); // thêm mới:  POST: /api/users
// router.put('/products/:id',mdw.api_auth, apiP.updatetProd); // sửa:   PUT: /api/user/123456789
// router.delete('/products/:id',mdw.api_auth, apiP.deleteProd); // xóa  DELETE:  /api/user/123456789 



module.exports = router;    
    