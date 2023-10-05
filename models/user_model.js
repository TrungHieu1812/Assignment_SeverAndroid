var db = require('./db');

const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const chuoi_ky_tu_bi_mat = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt"); 


const User_Schema = new db.mongoose.Schema(
    {//đối tượng này định nghĩa cấu trúc của model
        username: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String, required: false },
        password: { type: String, required: true },
        role: { type: Number, required: false },
        token: {  
            type: String,
            required: false
        }
 
    },
    { collection: 'users' }
);



User_Schema.query.sortable = function(req){
    if(req.query.hasOwnProperty('_sort')){
        const isValidtype = ['1','-1'].includes(req.query.type) 
        return this.sort({
            [req.query.column] : isValidtype ? req.query.type : '-1',
        });
    }
    return this;
}




User_Schema.methods.generateAuthToken = async function () {

    const user = this
    // console.log(user)
    const token = jwt.sign({ _id: user._id, username: user.username }, chuoi_ky_tu_bi_mat)
    // user.tokens = user.tokens.concat({token}) // code này dành cho nhiều token, ở demo này dùng 1 token
    user.token = token;
    await user.save();
    return token;
}


//dùng cho login
User_Schema.statics.findByCredentials = async (username, password) => {

    const user = await User_Model.findOne({ username })
    if (!user) {
        throw new Error({ error: 'Không tồn tại user' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Sai password' })
    }
    return user
}





//Tạo model 
let User_Model = db.mongoose.model('User_Model', User_Schema);


module.exports = { User_Model };