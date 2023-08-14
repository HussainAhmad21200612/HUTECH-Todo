const mongoose=require('mongoose');

const todoSchema=new mongoose.Schema({
    user:String,
    todo:[{
        text:String,
        image:String,
        completed:Boolean,
    }]
});

const Todo=mongoose.model('Todo',todoSchema);
module.exports=Todo;
