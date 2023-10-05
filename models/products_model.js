var db = require('./db');

const Prod_Schema = new db.mongoose.Schema(
    {//đối tượng này định nghĩa cấu trúc của model
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: false },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        id_cat: { type: db.mongoose.Schema.Types.ObjectId, ref: 'Cat_Model' },
    },
    { collection: 'products' }
);

//nếu muốn làm thêm về thể loại thì có thể định nghĩa ở đây

const Cat_Schema = new db.mongoose.Schema(
    {
        name: { type: String, required: true }
    },
    { collection: 'category' }
);



Prod_Schema.query.sortable = function(req){
    if(req.query.hasOwnProperty('_sort')){
        const isValidtype = ['1','-1'].includes(req.query.type) 
        return this.sort({
            [req.query.column] : isValidtype ? req.query.type : '-1',
        });
    }
    return this;
}


//Tạo model 
let Prod_Model = db.mongoose.model('Prod_Model', Prod_Schema);

let Cat_Model = db.mongoose.model('Cat_Model', Cat_Schema);

// console.log(spModel.find());
module.exports = { Prod_Model, Cat_Model };