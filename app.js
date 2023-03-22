var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cors = require('cors');
var Users = require('./models/User');
var Employees = require('./models/Employee');
var Messages = require('./models/Message');
var Orders = require('./models/Order');
app.use(express.json());
var cors = require('cors');
app.use(cors());
var multer = require('multer');
const bodyparser = require('body-parser');
app.use(bodyparser.json());
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');



// import compare
const compare = require('bcryptjs').compare;

require("dotenv").config();

mongoose.connect('mongodb+srv://prabhash:prabhash@cluster0.cucjq6t.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function(req, res) {
    res.send("hello world");
})



// Middleware
const verifyJWT = (req,res,next)=>{
    const token = req.headers["x-access-token"];
    console.log("verifyJWT_FRontend:",token);

    if(!token){
        res.json({auth:false,message:"You failed to authenticate"});
    }else{
        jwt.verify(token,"jwtSecret",(err,decoded)=>{
            console.log(decoded);
            if(err){
                
                res.json({auth:false,message:"You failed to authenticate1"});
            }else{
                req.userId = decoded.id;
                next();
            }
        })
    }
}






// Login for user
app.get("/login",(req,res)=>{
    let email = req.query.email;
    let password = req.query.password;

    Users.find
    ({email:email},(err,users)=>{

        if(users.length > 0){
        // compare password
        bcrypt.compare(password, users[0].password, function(err, result) {
            if(result){
                // create token
                let token = jwt.sign({email:users[0].email},"jwtSecret",{
                    expiresIn:"1h"});

                console.log("User token:",token);
                res.json({auth:true,token:token,users:users});
            }else{
                res.json({auth:false,token:null,users:null});
            }
        });



        // if(err){
        //     res.json(null);
        // }else{
        //     console.log(users);
        //     res.json(users);
        // }
    }else{
        res.json({auth:false,token:null,users:null});
    }
    })
}
)


// check email exists or not
app.get("/checkemail",(req,res)=>{
    let email = req.query.email;
   
    Users.find
    ({email:email},(err,users)=>{
        if(err){
            res.json(null);
        }else{
            console.log(users);
            res.json(users);
        }
    })
})




//User Signup
app.post("/signup",(req,res)=>{
    var user = new Users(req.body);

    user.save((err,user)=>{
        if(err){
            res.json(null);
        }else{
            res.json(user);
        }
    })
})  




// Conatct Us messages
app.post("/messages",verifyJWT,(req,res)=>{
    var message = new Messages(req.body);
    message.save((err,message)=>{
        if(err){
            res.json({auth:false,message:"You failed to authenticate"});
        }else{
            res.json({auth:true,message:message});
        }
    })
})



// Employee login
app.get("/emplogin",(req,res)=>{
    let email = req.query.email;
    let password = req.query.password;

    Employees.find
    ({email:email},(err,employees)=>{
        if(err){
            res.json({auth:false,token:null,employees:null});
        }else{
            // compare password
            bcrypt.compare(password, employees[0].password, function(err, result) {
                if(result){
                    // create token
                    let token = jwt.sign({email:employees[0].email},"jwtSecret",{
                        expiresIn:"1h"});
    
                    console.log("Token employee: ",token);
                    res.json({auth:true,token:token,employees:employees});
                }else{
                    res.json({auth:false,token:null,employees:null});
                }
            });

            // console.log(employees);
            // res.json(employees);
        }
    })})


    


// Employee Signup
app.post("/empsignup",(req,res)=>{
    let employee1 = new Employees(req.body);
    console.log(employee1);

    // check email exists or not
    Employees.find
    ({email:employee1.email},(err,employees)=>{
        if(err){
            res.json(null);
        }else{
            // if email exists
            if(employees.length>0){
                res.json(null);
            }else{
                employee1.save((err,employee)=>{
                    if(err){
                        res.json(null);
                    }else{
                        res.json(employee);
                    }
                })
             }
        }
    }) 
})  




// get order details in employee (employeeee.js file)
app.get("/ordersbyemp",verifyJWT,(req,res)=>{
    let eemail = req.query.eemail;
    Orders.find
    ({email:eemail},(err,orders)=>{
        if(err){
            res.json({auth:false,orders:null});
        }else{
            console.log(orders);
            res.json({auth:true,orders:orders});
        }
    }
    )
})



// Update order details and status (****Not Used****)
app.put("/updateorder/:id",verifyJWT,(req,res)=>{
    var orderid = req.params.id;
    Orders.update
    ({_id:orderid},{$set:{status:order.status}},(err,orders)=>{
        if(err){
            res.json({auth:false,orders:null});
        }else{
            console.log(orders);
            res.json({auth:true,orders:orders});
        }
    }
    ) 
}
)




//get Orders by user
app.get("/ordersbyuser",verifyJWT,(req,res)=>{
    var uemail = req.query.uemail;
    Orders.find
    ({uemail:uemail},(err,orders)=>{
        if(err){
            res.json({auth:false,orders:null});
        }else{
            console.log(orders);
            res.json({auth:true,orders:orders});
        }
    }
    )
}
)





// Update user detailss
app.post('/updateuser',verifyJWT,async (req,res)=>{
    let query = {'email': req.body.email};

Users.findOneAndUpdate(query, req.body, {upsert: true}, function(err, doc) {
    if (err){
        console.log("Error in updating user details");
        res.json({auth:false,doc:null});
    } 
    else{
        console.log("User details updated successfully");
        res.json({auth:true,doc:doc});
    }
    
});
}
)





// find employee
app.get("/findemployee",verifyJWT,(req,res)=>{

    let profession = req.query.profession;
    let free = req.query.free;
    Employees.find
    ({profession:profession,free:free},(err,employees)=>{
        if(err){
            res.json({auth:false,employees:null});
        }else{
            console.log(employees);
            res.json({auth:true,employees:employees});
        }
    }
    )
}
)



// update employee
app.post('/updateemployee',verifyJWT,async (req,res)=>{

    console.log("Update employee",req.body)

    let query = {'email': req.body.email};

Employees.findOneAndUpdate(query
, req.body, {upsert: false}, function(err, doc) {
    if (err){
        console.log("Error in updating employee details");
        res.json({auth:false,doc:null});
    }
    else{
        console.log("Employee details updated successfully");
        res.json({auth:true,doc:doc});
    }

});
}
)



// update employee by email
app.post('/updateemployeebyemail',verifyJWT,async (req,res)=>{

    let query = {'email': req.body.email};
    
Employees.findOneAndUpdate(query,{free:req.body.free}, {upsert: false}, function(err, doc) {
    if (err){
        console.log("Error in updating employee details");
        res.json({auth:false,doc:null});
    }
    else{
        console.log("Employee details updated successfully");
        res.json({auth:true,doc:doc});
    }

  });
}
)



// post orders
app.post("/orders",verifyJWT,(req,res)=>{
    var order = new Orders(req.body);
    order.save((err,order)=>{
        if(err){
            res.json({auth:false,order:null});
        }else{
            res.json({auth:true,order:order});
        }
    })
})


// get orders for employeee (work page)
app.get("/getorders",verifyJWT,(req,res)=>{
    let eemail = req.query.eemail;
    Orders.find({eemail:eemail},(err,orders)=>{
        if(err){
            res.json({auth:false,orders:null});
        }else{
            console.log(orders);
            res.json({auth:true,orders:orders});
        }
    }
    )
}
)


// update orders
app.post('/updateorder',verifyJWT,async (req,res)=>{
    let cost = req.body.cost;
    let orderid = req.body.orderid;
    let query = {'_id': orderid};
    let status = req.body.status;


    console.log("Update order",req.body)

Orders.findOneAndUpdate(query, {status:status}, {upsert: false}, function(err, doc) {
    if (err){
        console.log("Error in updating order details");
        res.json({auth:false,doc:null});
    }
    else{
        console.log("Order details updated successfully");
        res.json({auth:true,doc:doc});
    }

});

Orders.updateOne(
    {_id: orderid}, 
    {cost : cost },
    {multi:true}, 
      function(err, numberAffected){  
      });
})




// For Admin Page
app.get("/adminlogin",(req,res)=>{
    let email = req.query.adminemail;
    let password = req.query.adminpassword;

    console.log(req.body);

    if(email === "varma@gmail.com" && password === "varma"){
        console.log("Admin logged in");

        // create a token
        let token = jwt.sign({email:email},"jwtSecret",{expiresIn:"1h"});

        console.log("Admin token:",token);
        res.json({auth:true,token:token});

    }else{
        res.json({auth:false,token:null});
    }
    
})


app.get("/getordersforadmin",verifyJWT,(req,res)=>{
    Orders.find({},(err,orders)=>{
        if(err){
            res.json({auth:false,orders:null});
        }else{
            console.log(orders);
            res.json({auth:true,orders:orders});
        }
    }
    )
}
)


// get all employees
app.get("/getemployeesforadmin",verifyJWT,(req,res)=>{
    Employees.find({},(err,employees)=>{
        if(err){
            res.json({auth:false,employees:null});
        }else{
            console.log(employees);
            res.json({auth:true,employees:employees});
        }
    }
    )
}
)


// get all users
app.get("/getusersforadmin",verifyJWT,(req,res)=>{
    Users.find({},(err,users)=>{
        if(err){
            res.json({auth:false,users:null});
        }else{
            console.log(users);
            res.json({auth:true,users:users});
        }
    }
    )
}
)

// get messages for admin
app.get("/getmessagesforadmin",verifyJWT,(req,res)=>{
    Messages.find({},(err,messages)=>{
        if(err){
            res.json({auth:false,messages:null});
        }else{
            console.log(messages);
            res.json({auth:true,messages:messages});
        }
    }
    )
}
)





// filter customers by first name , last name , email , phone, city, state, pincode
app.get("/filtercustomersforadmin",verifyJWT, (req,res)=>{

    let filter = req.query.filter;
    let search = req.query.search;

    console.log("Filter",filter);
    console.log("Search",search);

    if(search == ""){
        Users.find({},(err,users)=>{
            if(err){
                res.json({auth:false,users:null});
            }else{
                console.log(users);
                res.json({auth:true,users:users});
            }
        }
        )
    }
    else if(filter == "firstName"){
        Users.find({firstName:search},(err,users)=>{
            if(err){
                res.json({auth:false,users:null});
            }else{
                console.log(users);
                res.json({auth:true,users:users});
            }
        }
        )
    }else if(filter == "lastName"){
        Users.find({lastName:search},(err,users)=>{
            if(err){
                res.json({auth:false,users:null});
            }else{
                console.log(users);
                res.json({auth:true,users:users});
            }
        }
        )
    }else if(filter == "email"){
        Users.find({email:search},(err,users)=>{
            if(err){
                res.json({auth:false,users:null});
            }else{
                console.log(users);
                res.json({auth:true,users:users});
            }
        }
        )
    }else if(filter == "phone"){
        Users.find({phone:search},(err,users)=>{
            if(err){
                res.json({auth:false,users:null});
            }else{
                console.log(users);
                res.json({auth:true,users:users});
            }
        }
        )
    }else if(filter == "city"){
        Users.find({city:search},(err,users)=>{
            if(err){
                res.json({auth:false,users:null});
            }else{
                console.log(users);
                res.json({auth:true,users:users});
            }
        }
        )
    }else if(filter == "state"){
        Users.find({state:search},(err,users)=>{
            if(err){
                res.json({auth:false,users:null});
            }else{
                console.log(users);
                res.json({auth:true,users:users});
            }
        }
        )
    }else if(filter == "pincode"){
        Users.find({pincode:search},(err,users)=>{
            if(err){
                res.json({auth:false,users:null});
            }else{
                console.log(users);
                res.json({auth:true,users:users});
            }
        }
        )
    }
})









// filter employees by first name , last name , gender, profession, email , phone, city, state, pincode
app.get("/filteremployeesforadmin",verifyJWT, (req,res)=>{
    let filter = req.query.filter;
    let search = req.query.search;

    console.log("Filter",filter);
    console.log("Search",search);

    if(search==""){
        Employees.find({},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        }
        )
    }
    else if(filter=="firstName"){
        Employees.find({firstName:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        })
    }
    else if(filter=="lastName"){
        Employees.find({lastName:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        }
        )
    }
    else if(filter=="gender"){
        Employees.find({gender:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
    })
    }
    else if(filter=="profession"){
        Employees.find({profession:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        }
        )
    }
    else if(filter=="email"){
        Employees.find({ email:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        }
        )
    }
    else if(filter=="phone"){
        Employees.find({phone:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        }
        )
    }
    else if(filter=="city"){
        Employees.find({city:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        })
    }
    else if(filter=="state"){
        Employees.find({state:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        }
        )

    }
    else if(filter=="pincode"){
        Employees.find({pincode:search},(err,employees)=>{
            if(err){
                res.json({auth:false,employees:null});
            }else{
                console.log(employees);
                res.json({auth:true,employees:employees});
            }
        }
        )
    }
    })







// filter orders by service type, customer name,customer email, customer phone  , employee name,employee email, employee phone, state,pincode
app.get("/filterordersforadmin",verifyJWT, (req,res)=>{
    let filter = req.query.filter;
    let search = req.query.search;

    console.log("Filter",filter);
    console.log("Search",search);

    if(search == ""){
        Orders.find({},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
    else if(filter == "itype"){
        Orders.find({itype:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
    else if(filter == "ufname"){
        Orders.find({ufname:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
    else if(filter == "uemail"){
        Orders.find({uemail:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
    else if(filter == "uphone"){
        Orders.find({uphone:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
    else if(filter == "efname"){
        Orders.find({efname:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
    else if(filter == "eemail"){
        Orders.find({eemail:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        })
    }
    else if(filter == "ephone"){
        Orders.find({ephone:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
    else if(filter == "ord_state"){
        Orders.find({ord_state:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
    else if(filter == "ord_pincode"){
        Orders.find({ord_pincode:search},(err,orders)=>{
            if(err){
                res.json({auth:false,orders:null});
            }else{
                console.log(orders);
                res.json({auth:true,orders:orders});
            }
        }
        )
    }
})






// filter messages by cname and cemail
app.get("/filtermessagesforadmin",verifyJWT, (req,res)=>{

    let filter = req.query.filter;
    let search = req.query.search;

    console.log("Filter",filter);
    console.log("Search",search);

    if(search == ""){
        Messages.find({},(err,messages)=>{
            if(err){
                res.json({auth:false,messages:null});
            }else{
                console.log(messages);
                res.json({auth:true,messages:messages});
            }
        }
        )
    }
    else if(filter == "name"){
        Messages.find({name:search},(err,messages)=>{
            if(err){
                res.json({auth:false,messages:null});
            }else{
                console.log(messages);
                res.json({auth:true,messages:messages});
            }
        }
        )
    }
    else if(filter == "email"){
        Messages.find({ email:search},(err,messages)=>{
            if(err){
                res.json({auth:false,messages:null});
            }else{
                console.log(messages);
                res.json({auth:true,messages:messages});
            }
        }
        )
    }
})





// Delete User
app.delete("/deleteuser/:id",verifyJWT, (req, res) => {
    let id = req.params.id;
    console.log("id", id);
    Users.findByIdAndDelete(id, (err, user) => {
        if (err) {
            res.json({auth:false,user:null});
        } else{
            console.log("user", user);
            res.json({auth:true,user:user});
        }
    });
});


// Delete Employee
app.delete("/deleteemployee/:id",verifyJWT, (req, res) => {
    let id = req.params.id;
    console.log("id", id);
    Employees.findByIdAndDelete(id, (err, employee) => {
        if (err) {
            res.json({auth:false,employee:null});
        } else{
            console.log("employee", employee);
            res.json({auth:true,employee:employee});
        }
    });
});




// Delete Order
app.delete("/deleteorder/:id",verifyJWT, (req, res) => {
    let id = req.params.id;
    console.log("id", id);
    Orders.findByIdAndDelete(id, (err, order) => {
        if (err) {
            res.json({auth:false,order:null});
        } else{
            console.log("order", order);
            res.json({auth:true,order:order});
        }
    });
});



// Delete Message
app.delete("/deletemessage/:id", verifyJWT,(req, res) => {
    let id = req.params.id;
    console.log("id", id);
    Messages.findByIdAndDelete(id, (err, message) => {
        if (err) {
            res.json({auth:false,message:null});
        } else{
            console.log("message", message);
            res.json({auth:true,message:message});
        }
    });
});



const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("App listening on port 3001");
});