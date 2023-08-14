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
    // readAllTodos("./files.txt",function (err, data) {
    //     if (err) {
    //       res.status(500).send("error");
    //       return;
    //     }
        // res.status(200).send(JSON.stringify(data));
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
    // readAllTodos("./files.txt",function (err, data) {
    //   if (err) {
    //     res.status(500).send("error");
    //     return;
    //   }
    //     // datat = JSON.stringify(data);
    //     // console.log(data, data[data.length - 1].HUBB);
    //     // for (let c = 0; c < data.length; c++) {
    //     //     var dd = String(req.session.user);
    //     //     console.log(data[c].HUBB,data[c][dd]);
    //     //     if (data[c][dd] !== undefined) {
    //     //         console.log(dd);
    //     //         console.log(data[c][dd][0].text);
    //     //     }
    //     // }
    Todo.findOne({user:req.session.user}).then((doc)=>{
    
        if(doc===null){
            res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:[]});
            return;
        }
        console.log(doc.todo)
        res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:doc.todo});
    // res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:data});
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
//   fs.readFile("./users.txt", 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     try {
//       const parsedData = JSON.parse(data);
//       var f=0;
//       parsedData.forEach(function(item){
//         if(item.username===username && item.password===password && f==0){
//           req.session.user=item.username;
//           req.session.password=item.password;
//           req.session.image=item.image;
//             req.session.isLoggedin = true;
//             nm=item.username.toUpperCase();
//           res.redirect("/");
//           f=1;
//           return;
        
//         }
        
//         });
//         if (f==0){
//           req.session.error="Invalid username or password";
//           res.redirect("/login");
//           return;
//         }
        
        
//       }catch (err) { 
//       console.error(err);
//     }
//   }); 
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
//   fs.readFile("./users.txt", 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
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
            // if(err){
            //     console.log(err);
            //     return;
            // }
            console.log(doc);
            res.redirect("/");
            return;
        }).catch((err)=>{
            console.log(err);
            return;
        });
        
    });
    }

    //     });
    // try {
    //   const parsedData = JSON.parse(data);
    //   var f=0;
    //   parsedData.forEach(function(item){
    //     if(item.email===users.email && f==0){
    //       req.session.exist="Username already exists!";
    //       res.redirect("/signup");
    //       f=1;
    //       return;
        
    //     }
        
    //     });
    //   if (f == 0) {
    //     parsedData.push(users);
    //     req.session.user = users.username;
    //     req.session.password = users.password;
    //     req.session.image = req.file.filename;
    //     req.session.isLoggedin = true;
    //     nm=users.username.toUpperCase();
          
    //       const curr = {};
    //         curr[users.username.toUpperCase()] = [];
    //     //   saveData("./files.txt", curr, function (err) {
    //     //       if (err) {
    //     //           res.status(500).send("error");
    //     //           return;
    //     //       }
              
    //     //           fs.writeFile("./users.txt", JSON.stringify(parsedData, null, 2), function (err) {
    //     //               if (err) {
    //     //                   console.error(err);
    //     //                   return;
    //     //               }
            
    //     //               // req.session.user=users.username;
    //     //               // req.session.password=users.password;
    //     //               // req.session.image=req.file.filename;
    //     //               // req.session.isLoggedin=true;
    //     //               res.redirect("/");
    //     //               return;
    //     //           });
        
    //     //           return;
            
    //     //   });
    //     const cur={
    //         user:users.username,
    //         todos:[]
    //     }
    //     User.create(users).then((user) => {
    //         Todo.create(cur).then((todo) => {
    //             user.todo = [];
    //             user.save();

    //         res.redirect("/");
    //     })
    // }).catch((err) => {
    //         console.log(err);
    //         res.render("signup.ejs", { message: "Error in creating user" });
    //     });
        
        
    // }
        
        
        
    //   }catch (err) { 
    //   console.error(err);
    // }
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
// app.post("/error",(req,res)=>{
//   const {username,password}=req.body;
//   var f=0;
//   fs.readFile("./users.txt", 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     try {
//       const parsedData = JSON.parse(data);
//       parsedData.forEach((item)=>{
//         if(item.username===username && item.password===password){
//           req.session.user=item.username;
//           req.session.password=item.password;
//           req.session.isLoggedin=true;
//           res.redirect("/");
          
//           return;
//         }

//         })
//         if(req.session.isLoggedin==false)
//         {req.session.error="Invalid username or password";
//           res.redirect("/login");}
        
//       }catch (err) { 
//       console.error(err);
//     }
//   }); 
// });
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
    // console.log(todo);
    // readAllTodos("./files.txt", function (err, data) {
    //     if (err) {
    //         res.status(500).send("error");
    //         return;
    //     }
    //     data.forEach((item) => {
    //         if (item[nm] !== undefined) {
    //             item[nm].push(todo);
    //         }
    //     });
    //     console.log(data);
    //     fs.writeFile("./files.txt", JSON.stringify(data, null, 2), function (err) {
    //         if (err) {
    //             res.status(500).send("error");
    //             return;
    //         }
    //         // res.redirect("/todo");
    //         res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:data})

    //         return;
    //     });
    // });
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

    
    // saveData("./files.txt",todo,function(err){
    //     if(err){
    //         res.status(500).send("error");
    //         return;
    //     }
    //     readAllTodos("./files.txt",function (err, data) {
    //       if (err) {
    //         res.status(500).send("error");
    //         return;
    //       }
    //       datat=JSON.stringify(data);
    //     res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:datat})
    //     return;
    //     });
        // res.status(200).send("ok");
      
    // });
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
        console.log("server started at 3000");
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
                // res.render("newtodo.ejs",{user:req.session.user.toUpperCase(),flag:req.session.isLoggedin,image:req.session.image,todos:user.todo})
            }).catch((err)=>{
                console.log(err);
            })
        }
    }).catch((err)=>{
        console.log(err);
    })
}
















//     fs.readFile("./files.txt", 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
  
//         try {
//             const parsedData = JSON.parse(data);
//             // const parsedDta = parsedData.filter(item => item[nm]);
//             // const neededData = parsedDta.filter(item => item[property] !== value);
//             // parsedData.push(neededData);
//             console.log(nm + " is here");
//             for (let c = 0; c < parsedData.length; c++) {
//                 if (parsedData[c][nm] !== undefined) {
//                     const neededData=parsedData[c][nm].filter(item => item[property] !== value);
//                     parsedData[c][nm] = neededData;
//                 }
//             }
//             const updatedData = JSON.stringify(parsedData, null, 2);

//             fs.writeFile("./files.txt", updatedData, 'utf8', (err) => {
//                 if (err) {
//                     console.error('Error writing to the file:', err);
//                 } else {
//                     console.log(`Task : '${value}' removed.`);
//                 }
//             });
            





//         //   const parsedData = JSON.parse(data);
//         //   const parsedDta = parsedData.filter(item => item[req.session.user]);
//         // const neededData = parsedDta.filter(item => item[property] !== value);
//         // const updatedData = JSON.stringify(neededData, null, 2);
  
//         // fs.writeFile("./files.txt", updatedData, 'utf8', (err) => {
//         //   if (err) {
//         //     console.error('Error writing to the file:', err);
//         //   } else {
//         //     console.log(`Task : '${value}' removed.`);
//         //   }
//         // });
//       } catch (err) {
//         console.error(err);
//       }
//     });
// }
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







//     fs.readFile("./files.txt", 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
  
//       try {
//           const parsedData = JSON.parse(data);
//         //   const parsedDta = parsedData.filter(item => item[nm]);
//         // const neededData = parsedDta.filter(item => item[property] === value);
// //   console.log(parsedData)
//           for (let c = 0; c < parsedData.length; c++) {
//               if (parsedData[c][nm] !== undefined) {
//                   parsedData[c][nm].forEach((item) => {
//                       if (item[property] === value) {
//                           item.completed = !item.completed;
//                       }
//                   });
//               }
//           }
          
          
          
//         // parsedDta.forEach((item)=>{  
//         //   if(item[property]===value){
//         //     item.completed=!item.completed;
//         //   }
//         // });
//         console.log(parsedData);
//         const updatedData = JSON.stringify(parsedData, null, 2);
  
//         fs.writeFile("./files.txt", updatedData, 'utf8', (err) => {
//           if (err) {
//             console.error('Error writing to the file:', err);
//           } else {
//             console.log(`Task : '${value}' status updated!`);
//           }
//         });
              
//       } catch (err) {
//         console.error(err);
//       }
//     }
// });
  
}
