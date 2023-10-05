var express = require('express');
var router = express.Router();
var multer = require('multer');
var UController = require('../controllers/users.controller');
var LoginMiddleware = require('../middleware/checkLogin');
var SortMiddleware = require('../middleware/sortMiddleware');


// middleware cho toàn bộ các route dưới
router.use(SortMiddleware.check_sort);


router.use(LoginMiddleware.check_Login);



//tạo các trang ở đây
router.get("/",UController.getListU);


router.get("/",UController.addUser);

var objUp = multer({dest:'./tmp'})
router.post('/',objUp.single("avatar"), UController.addUser );



router.get("/delete/:id",UController.deleteUser);


module.exports = router;
