exports.check_Login = (req,res,next) =>{
    if(req.session.userid){
        //có tồn tại se
        next();
    }else{
        return res.redirect('/signIn');
    }
}


exports.Ko_yeucauLogin = (req,res,next) =>{
    if(!req.session.userid){
        // không có tồn tại se
        next();
    }else{
        return res.redirect('/');
    }
}

// exports.check_Login = (req,res,next) =>{
//    next();
// }