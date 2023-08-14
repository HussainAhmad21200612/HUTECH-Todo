const mongoose=require('mongoose');

module.exports.init=async function(){
    await mongoose.connect('mongodb+srv://hussain109164:21200612@cluster0.1orgllm.mongodb.net/todos');
    console.log('Connected to MongoDB...');
}


