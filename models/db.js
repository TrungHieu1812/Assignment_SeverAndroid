const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Asignment_ph21424')
    .catch((error)=>{
        console.log("Loi ket noi");
        console.log(error);
    });


module.exports = {mongoose}    