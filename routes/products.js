var express = require('express');
var router = express.Router();
var multer = require('multer');
var PController = require('../controllers/product.controller');
var LoginMiddleware = require('../middleware/checkLogin');
var SortMiddleware = require('../middleware/sortMiddleware');


// middleware cho toàn bộ các route dưới
router.use(SortMiddleware.check_sort);


router.use(LoginMiddleware.check_Login);


//tạo các trang ở đây
router.get("/",PController.getListP);


router.get("/",PController.addProduct);

var objUp = multer({dest:'./tmp'})
router.post('/',objUp.single("image"), PController.addProduct );


router.get("/delete/:id",PController.deleteProduct);

router.get("/details/:id",PController.DetailProd);


router.get("/category",PController.addCategory);    
router.post("/category",PController.addCategory);

router.get('/category',PController.getlist_cat);

router.get("/category/delete/:id",PController.deleteCat);


module.exports = router;