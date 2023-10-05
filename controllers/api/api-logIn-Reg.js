var mymodel = require('../../models/user_model');
const bcrypt = require("bcrypt");


exports.login = async (req, res, next) => {
    
    try {

        const user = await mymodel.User_Model
                    .findByCredentials(req.body.username, req.body.password)
        if (!user) {
            return res.status(401)
                    .json({error: 'Sai thông tin đăng nhập'})
        }
        // đăng nhập thành công, tạo token làm việc mới
         await user.generateAuthToken()
 
        return res.status(200).send({ user })
 
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: error.message})   
 
    }

}


exports.reg = async (req, res, next) => {

    try {
        const salt = await bcrypt.genSalt(10);

        const user = new mymodel.User_Model(req.body);

        user.password = await bcrypt.hash(req.body.password, salt);
        const token = await user.generateAuthToken();

        let new_u = await user.save()


        return res.status(201).json({ user: new_u, token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: error.message})
    }


}




exports.logout = async (req, res, next) => {
    try {
        console.log( req.user);
        // req.user.generateAuthToken();
        req.user.token = null; //xóa token
        await req.user.save()
        return res.status(200).json({msg: 'Đăng xuất thành công'});
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
 
}
