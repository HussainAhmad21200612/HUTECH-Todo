const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const http = require("http");
const server=http.createServer(app);
const fs = require("fs");
const session = require("express-session");
const db=require('./models/db');
const User=require('./models/userModel');
const Todo=require('./models/todoModel');
const multer = require("multer"); 
const upload = multer({ dest: 'todo/todo/'});
// const todoimg=multer({dest:'todo/'});
// app.use(exprestic("views"));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(express.static("todo"));
var nm="";
// const e = require("express");
// const bodyParser = require("body-parser");
var data = [];


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'myhutech21200612',
  resave: false,
  saveUninitialized: true}));
// req.session.isLoggedin=false;
app.use(upload.single('photo'));
// app.use(todoimg.single('photo'));
// app.use(todoimg.single('fotu'));
app.get("/todo-data",(req,res)=>{
  if(!req.session.isLoggedin){
    res.redirect("/login");
    return;
  }
        Todo.findOne({user:req.session.user}).then((doc)=>{
            if(doc===null){
                res.status(200).json([]);
                return;
            }
            res.status(200).json(doc.todo);
        // res.status(200).json(data);
      }).catch((err)=>{
        console.log(err);
        res.status(500).send("error");
        return;
      });
    });
app.get("/",(req,res)=>{
    if (req.session.user===undefined){
      req.session.user="";}
    res.render("index.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:"/todo/"+req.session.image});
  });



app.get("/todo",(req,res)=>{
    if(!req.session.isLoggedin){
      res.redirect("/login");
      return;
    }
    Todo.findOne({user:req.session.user}).then((doc)=>{
    
        if(doc===null){
            res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:[]});
            return;
        }
        console.log(doc.todo)
        res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:doc.todo});
    
}).catch((err)=>{
    res.status(500).send("error");
    return;
});
  });
  app.get("/sc.js",(req,res)=>{
    
    res.sendFile(__dirname+"/views/sc.js");
  });
  app.get("/todo/sc.js",(req,res)=>{
    
    res.sendFile(__dirname+"/views/sc.js");
  });
 app.get("/style.css",(req,res)=>{
  
  res.sendFile(__dirname+"/views/style.css");
});
app.get("/todo/style.css",(req,res)=>{
  
  res.sendFile(__dirname+"/views/style.css");
});
app.get("/su.js",(req,res)=>{
  
  res.sendFile(__dirname+"/views/su.js");
});
app.get("/login",(req,res)=>{
  res.render("login.ejs",{message:req.session.error});
});
app.get("/signup",(req,res)=>{
  res.render("signup.ejs",{message:req.session.exist})
});

app.get("/welcome",(req,res)=>{
  if(!req.session.isLoggedin){
    res.redirect("/login");
    return;
  }
  res.render("index.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:"/todo/"+req.session.image});
});
app.get("/about",(req,res)=>{
  if(!req.session.isLoggedin){
    res.redirect("/login");
    return;
  }
  res.render("about.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:"/todo/"+req.session.image});
});
app.get("/contact",(req,res)=>{
  if(!req.session.isLoggedin){
    res.redirect("/login");
    return;
  }
  res.render("contact.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:"/todo/"+req.session.image});
});  
app.post("/login",(req,res)=>{
  const {username,password}=req.body;
 User.findOne({username:username,password:password}).then((doc)=>{


    
    if(doc===null){
        req.session.error="Invalid username or password";
        res.redirect("/login");
        return;
    }
    if(doc.password===password){
        req.session.user=doc.username;
        req.session.password=doc.password;
        req.session.image=doc.image;
        req.session.isLoggedin = true;
        nm=doc.username;
        res.redirect("/");
        return;
    }
    req.session.error="Invalid username or password";
    res.redirect("/login");
    return;
     }).catch((err)=>{

    console.log(err);
    res.status(500).send("error");
    return;
     });

});
app.post("/signup", (req, res) => {
  const users = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    image:req.file.filename
  }
  console.log(users);
  const {username,password,email}=req.body;
  const photo=req.file;
  console.log(username,password,photo);
 User.findOne({username:username,email:email}).then((doc)=>{
    
    if(doc!==null){
        req.session.exist="Username already exists!";
        res.redirect("/signup");
        return;
    }
    else{
    User.create(users).then((doc)=>{
        
        req.session.user=doc.username;
        req.session.password=doc.password;
        req.session.image=doc.image;
        req.session.isLoggedin = true;
        nm=doc.username;
        Todo.create({user:doc.username,todo:[]}).then((doc)=>{
            console.log(doc);
            res.redirect("/");
            return;
        }).catch((err)=>{
            console.log(err);
            return;
        });
        
    });
    }

  }).catch((err)=>{
    console.log(err);
    res.status(500).send("error");
    return;
  });
});

app.get("/logout",(req,res)=>{

  
  req.session.destroy();
  res.redirect("/");
  
});

app.post("/todo",(req,res)=>{

    // const todo=req.body;
    if(!req.session.isLoggedin){
      res.redirect("/login");
      return;
    }
    // console.log(req.body,req.file);

    const todos={
        text:req.body.text,
        image:req.file.filename,
        completed:false
    }
    Todo.findOne({user:req.session.user}).then((user)=>{
        if(user){
            user.todo.push(todos);
            user.save().then(()=>{
                res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:user.todo})
            }).catch((err)=>{
                console.log(err);
            })
        }
        else{
            const newuser=new Todo({    
                username:req.session.user,
                todo:[todos]
            });
            newuser.save().then(()=>{
                res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:newuser.todo})
            }).catch((err)=>{
                console.log(err);
            })
        }
    }).catch((err)=>{
        console.log(err);
    })
});
app.post("/delete",(req,res)=>{
    removeTask(req.body, function (err) {
        if (err) {
            res.status(500).send("error");
            return;
            }
            
    res.status(200).send("ok");
});}
);
app.post("/update",(req,res)=>{ 
    updateCheckedTodo(req.body,function(err){
        if(err){
        res.status(500).send("error");
        return;
        }
        res.status(200).send("ok");
    });
    });
function saveData(file,todo,callback){
    readAllTodos(file,function (err, data) {
        if (err) {
          callback(err);
          return;
        }
    
        data.push(todo);
    
        fs.writeFile(file, JSON.stringify(data,null,2), function (err) {
          if (err) {
            callback(err);
            return;
        }
        callback(null);
      });
    });
}

function readAllTodos(file,callback){
  fs.readFile(file,function(err,data){
      if (err) {
          callback(err);
          return;
        }
    
        if (data.length === 0) {
          data = "[]";
        }
    
        try {
          data = JSON.parse(data);
          callback(null, data);
        } catch (err) {
          callback(err);
        }
      });
    }
db.init().then(function () {
    console.log("connected to db");
    app.listen(3000, function () {
        console.log("server started at 4600");
    });
}).catch(function (err) {
    console.error(err);
});


function removeTask(body){
    const {property,value}=body;
    console.log(nm);
    Todo.findOne({user:nm}).then((user)=>{
        if(user){
            const neededData=user.todo.filter(item => item[property] !== value);
            const notNeededData=user.todo.filter(item => item[property] === value);
            user.todo=neededData;
            user.save().then(()=>{
                fs.unlink(__dirname+"/todo/todo/"+notNeededData[0].image,(err)=>{
                    if(err){
                        console.log(err);
                    }
                    });

                console.log(value+" deleted");
               
            }).catch((err)=>{
                console.log(err);
            })
        }
    }).catch((err)=>{
        console.log(err);
    })
}

function updateCheckedTodo(body){

    //read from file and if content matches then change its ckecked status
    const {property,value} = body;
    console.log(nm);
    Todo.findOne({user:nm}).then((data)=>{
        if(data){
            data.todo.forEach((item)=>{
                if(item[property]===value){
                    item.completed=!item.completed;
                }
            });
            data.save().then(()=>{
                console.log(value+" status updated ");
            }).catch((err)=>{
                console.log(err);
            })
        }
    }).catch((err)=>{
        console.log(err);
    })  
}
