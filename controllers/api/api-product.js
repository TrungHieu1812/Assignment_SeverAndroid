var myModel = require('../../models/products_model')
var objReturn = {
    //mẫu đối tượng trả về của api
    status: 1,
    msg: 'Ok',
}

exports.listProd = async (req, res, next) => {
    //các thao tác xử lý ỏ đây

    let list =[];

    try {
        list = await myModel.Prod_Model.find().populate('id_cat');
        if (list.length > 0) {
            objReturn.data = list;
        }else{
            objReturn.status = 0;
            objReturn.msg = 'không có dữ liệu phù hợp';
        }
       
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn)

};


exports.addProd = async (req, res, next) => {
    //các thao tác xử lý ỏ đây

    let obj = new myModel.Prod_Model();
    obj.name = req.body.name;
    obj.qty = req.body.qty;
    obj.image = req.body.image;
    obj.description = req.body.description;
    obj.price = req.body.price;
    obj.id_cat = req.body.id_cat;
    

    try {
        objReturn.data = await obj.save();
        objReturn.status = 1;
        objReturn.msg = 'Thêm thành công';
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = 'Thêm thất bại '+error.message;
    }

    res.json(objReturn)
}

exports.updatetProd =async (req, res, next) => {
    //các thao tác xử lý ỏ đây
    let obj =  {};
    obj.name = req.body.name;
    obj.qty = req.body.qty;
    obj.image = req.body.image;
    obj.description = req.body.description;
    obj.price = req.body.price;
    obj.id_cat = req.body.id_cat;

    try {
        await myModel.Prod_Model.findByIdAndUpdate(req.params.id, obj);
        objReturn.status = 1;
        objReturn.msg = 'Update thành công';
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = 'Update thất bại ' + error.message;
    }



    res.json(objReturn)

};


exports.deleteProd = async (req, res, next) => {
    //các thao tác xử lý ỏ đây

    try {
        objReturn.data = await myModel.Prod_Model.findByIdAndDelete({ _id: req.params.id })
        objReturn.status = 1;
        objReturn.msg = 'Xóa thành công';
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = 'Xóa thất bại '+error.message;
    }


    res.json(objReturn)

};