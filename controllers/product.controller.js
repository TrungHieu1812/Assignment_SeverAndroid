const myModel = require("../models/products_model")

var fs = require('fs');

exports.getListP = async (req, res, next) => {


    // sắp xếp giá tiền giảm dần
    // var list_price_down = await myModel.Prod_Model.find().sort( {price :1} );


    // let dieu_kien_loc = null;
    // //giả sử lọc theo giá tiền
    // if(typeof(req.query.price) != 'undefined'){
    //     dieu_kien_loc = {price : {$gte: req.query.price  }};
    // }//chay thu : ?price=5000

    // var listProduct = await myMD.spModel.find(dieu_kien_loc);       
    
    
    var pagination = req.query.pagination ? parseInt(req.query.pagination) : 5;

    var page = req.query.page ? parseInt(req.query.page) : 1;


    let listCat = await myModel.Cat_Model.find();

    var listProduct = await myModel.Prod_Model.find()
            .skip((page - 1) * pagination)
            .limit(pagination)
            .sortable(req)
            .populate('id_cat');



    res.render('product/listProduct', {
        Uname: req.session.userid,
        listProduct: listProduct,
        listCat: listCat,
    });



}



exports.addProduct = async (req, res, next) => {

    //xử lý post
    let msg = '';

    //load ds thể loại lên form
    let listCat = await myModel.Cat_Model.find();

    //xử lý post
    if (req.method == 'POST') {
        //kiểm tra hợp lệ dữ liệu ở đây
        if (req.body.type == 'add') {
            //tạo đối tượng model và gán dữ liệu
            let obj = new myModel.Prod_Model();
            obj.name = req.body.name;
            obj.qty = req.body.qty;
            obj.description = req.body.description;
            obj.price = req.body.price;
            obj.id_cat = req.body.category;

            try {
                fs.rename(req.file.path, './public/Uploads/' + req.file.originalname,
                    async (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //không có lỗi
                            obj.image = 'http://localhost:3000/Uploads/' + req.file.originalname;
                            try {
                                let new_prod = await obj.save();
                                console.log(new_prod);
                                msg = 'Đã thêm thành công';
                            } catch (error) {
                                msg = "Lỗi : " + error.message;
                                console.log(error);
                            }
                        }
                    });

            } catch (error) {
                try {
                    let new_prod = await obj.save();
                    console.log(new_prod);
                    msg = 'Đã thêm thành công';
                } catch (error) {
                    msg = "Lỗi : " + error.message;
                    console.log(error);
                }
            }

            res.redirect('/products')
        }

        /////////////////////////////////////////////////////////////////////////
        if (req.body.type == 'update') {
            // tạo đối tượng model và gán dữ liệu
            let objProd = new myModel.Prod_Model();
            objProd.name = req.body.name;
            objProd.qty = req.body.qty;
            objProd.description = req.body.description;
            objProd.price = req.body.price;
            objProd.id_cat = req.body.category;
            objProd._id = req.body.id;
            try {
                fs.rename(req.file.path, './public/Uploads/' + req.file.originalname,
                    async (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            objProd.image = 'http://localhost:3000/Uploads/' + req.file.originalname;
                            // thực hiện Ghi vào CSDL
                            try {
                                await myModel.Prod_Model.findByIdAndUpdate({ _id: req.body.id }, objProd);
                                msg = 'Đã sửa thành công';
                            } catch (error) {
                                msg = "Lỗi : " + error.message;
                                console.log(error);

                            }
                        }
                    });
            } catch (error) {
                try {
                    await myModel.Prod_Model.findByIdAndUpdate({ _id: req.body.id }, objProd);
                    msg = 'Đã sửa thành công';
                } catch (error) {
                    msg = "Lỗi : " + error.message;
                    console.log(error);
                }
            }


            res.redirect('/products')
        }

    }


    let listProduct = await myModel.Prod_Model.find();

    res.render('product/listProduct', {
        Uname: req.session.userid,
        listProduct: listProduct,
        listCat: listCat,
        msg: msg,
    });

}


exports.DetailProd = async (req, res, next) => {

    let listCat = await myModel.Cat_Model.find();

    let objProd = await myModel.Prod_Model.findById(req.params.id).populate('id_cat');

    res.render('product/detailProduct', {
        Uname: req.session.userid,
        objProd: objProd,
        listCat: listCat,
    });
}


exports.deleteProduct = async (req, res, next) => {
    await myModel.Prod_Model.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/products')
}


/////////////////////////////////////=========Category========////////////////////////   



exports.getlist_cat = async (req, res, next) => {
    let listCat = await myModel.Cat_Model.find();

    res.render('category/category', {
        Uname: req.session.userid,
        listCat: listCat,
    });
}


exports.addCategory = async (req, res, next) => {

    let listCat = await myModel.Cat_Model.find();

    if(req.method === 'POST'){
        //kiểm tra hợp lệ

        //lưu csdl
        try {
            let objC = new myModel.Cat_Model();
            objC.name = req.body.name;
            await objC.save();
            res.redirect('/products/category')

        } catch (error) {
            console.log("Lỗi "+error.message);
        }

    }


    res.render('category/category', {
        Uname: req.session.userid,
        listCat: listCat,
    });
}


exports.deleteCat = async (req, res, next) => {


    let id = req.params.id;
    let [objP] = await myModel.Prod_Model.find({ id_cat: id });

    if (objP == null) {
        await myModel.Cat_Model.findByIdAndDelete(id);
    } else {
    }
    

    res.redirect('/products/category',)
}
