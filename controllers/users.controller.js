const myModel = require("../models/user_model")

var fs = require('fs')


exports.getListU = async (req, res, next) => {

    var pagination = req.query.pagination ? parseInt(req.query.pagination) : 5;

    var page = req.query.page ? parseInt(req.query.page) : 1;

    let listUser = await myModel.User_Model.find()
            .skip((page - 1) * pagination)
            .limit(pagination)
            .sortable(req);

    res.render('user/listUser', { Uname: req.session.userid, listUser: listUser });

}


exports.addUser = async (req, res, next) => {

    //xử lý post
    let msg = '';

    var dk = null
    let role = req.body.role
    if(role){
        if(role !=2)
        dk = {role: role}
    }
    //xử lý post
    if (req.method == 'POST' && dk==null) {
        //kiểm tra hợp lệ dữ liệu ở đây
        if (req.body.type == 'add') {
            //tạo đối tượng model và gán dữ liệu
            let obj = new myModel.User_Model();
            obj.username = req.body.username;
            obj.email = req.body.email;
            obj.password = req.body.password;
            obj.role = req.body.role ? 1 : 0;


            try {
                fs.rename(req.file.path, './public/Uploads/' + req.file.originalname,
                    async (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //không có lỗi
                            obj.avatar = 'http://localhost:3000/Uploads/' + req.file.originalname;
                            try {
                                let new_user = await obj.save();
                                console.log(new_user);
                                msg = 'Đã thêm thành công';
                            } catch (error) {
                                msg = "Lỗi : " + error.message;
                                console.log(error);

                            }
                        }
                    });
            } catch (error) {
                try {
                    let new_user = await obj.save();
                    console.log(new_user);
                    msg = 'Đã thêm thành công';
                } catch (error) {
                    msg = "Lỗi : " + error.message;
                    console.log(error);
                }
                res.redirect('/users')
            }

        }
        /////////////////////////////////////////////////////////////////////////
        if (req.body.type == 'update') {
            //tạo đối tượng model và gán dữ liệu
            let obj = new myModel.User_Model();
            obj.username = req.body.username;
            obj.email = req.body.email;
            obj.password = req.body.password;
            obj.role = req.body.role;
            obj._id = req.body.id;


            try {
                fs.rename(req.file.path, './public/Uploads/' + req.file.originalname,
                    async (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //không có lỗi
                            obj.avatar = 'http://localhost:3000/Uploads/' + req.file.originalname;
                            try {
                                await myModel.User_Model.findByIdAndUpdate({ _id: req.body.id }, obj);
                                msg = 'Đã thêm thành công';
                            } catch (error) {
                                msg = "Lỗi : " + error.message;
                                console.log(error);

                            }
                        }
                    });
            } catch (error) {
                try {
                    await myModel.User_Model.findByIdAndUpdate({ _id: req.body.id }, obj);
                    msg = 'Đã thêm thành công';
                } catch (error) {
                    msg = "Lỗi : " + error.message;
                    console.log(error);

                }
                res.redirect('/users')
            }

        }




    }


    var listUser = await myModel.User_Model.find(dk);

    res.render('user/listUser', {
        Uname: req.session.userid,
        listUser: listUser,
        msg: msg,
    });

    // res.redirect('/users')
}






exports.deleteUser = async (req, res, next) => {
    await myModel.User_Model.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/users')
}