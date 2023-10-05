const myModel = require('../models/user_model')
const bcrypt = require('bcrypt') //thư viện mã hóa


exports.SignIn = async (req, res, next) => {
  let msg = '';

  if (req.method === 'POST') {

    try {
      let objU = await myModel.User_Model.findOne({ username: req.body.username });

      if (objU != null) {
        //tồn tại username ==> kiểm tra passwd
        let checkpass = await bcrypt.compare(req.body.password, objU.password)
        if (checkpass) {
          // đúng thông tin tài khoản ==> lưu vào session
          req.session.userid = objU;
          // chuyển trang về trang quản trị
          return res.render('index', { Uname: req.session.userid })
        } else {
          msg = 'Sai password';
        }
      } else {
        msg = 'Tài khoản không tồn tại ' + req.body.username;
      }

    } catch (error) {
      msg = 'Lỗi' + error.message;
    }

  }
  res.render('sign_in_up/signIn', { msg: msg });

}


exports.SignUp = async (req, res, next) => {

  let msg = '';

  if (req.method === 'POST') {
    console.log(req.body);
    //kiểm tra hợp lệ
    if (req.body.password != req.body.password2) {
      msg = 'Mật khẩu không trùng khớp đúng';
      return res.render('sign_in_up/signUp', { msg: msg });
    }
    //nếu kiểm tra thì viết vào đây

    //lưu csdl
    try {
      let objU = new myModel.User_Model();
      objU.username = req.body.username;

      //xư lý mã hóa password
      //1.tạo chuỗi mã hóa bí mật
      const salt = await bcrypt.genSalt(15);
      objU.password = await bcrypt.hash(req.body.password,salt);
      
      objU.email = req.body.email;
      objU.avatar = '';
      objU.role = 0;
      await objU.save();

      msg = 'Đăng ký thành công';

    } catch (error) {
      msg = 'Lỗi' + error.message;
    }

  }


  res.render('sign_in_up/signUp', { msg: msg });
}




exports.Signout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/signIn');
};