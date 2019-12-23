const mongoose = require('mongoose')

var ContractSchema = mongoose.Schema({  //Schema 설정
    contactId: {type : Number, require:true},
    name : { type:String, require : true},
    email : { type : String, require : true},
    gender : String,
    phone : String,
    register_date : { type:Date, default : Date.now}
})
module.exports = mongoose.model('Contact', ContractSchema);