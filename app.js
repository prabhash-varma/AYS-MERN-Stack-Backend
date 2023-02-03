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

require("dotenv").config();

mongoose.connect('mongodb+srv://prabhash:prabhash@cluster0.cucjq6t.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function(req, res) {
    res.send("hello world");
})


// Login
app.get("/login",(req,res)=>{
    var email = req.query.email;
    var password = req.query.password;
    Users.find
    ({email:email,password:password},(err,users)=>{
        if(err){
            res.json(null);
        }else{
            console.log(users);
            res.json(users);
        }
    })
}
)


// check email exists or not
app.get("/checkemail",(req,res)=>{
    var email = req.query.email;
   
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
app.post("/messages",(req,res)=>{
    var message = new Messages(req.body);
    message.save((err,message)=>{
        if(err){
            res.json(null);
        }else{
            res.json(message);
        }
    })
})



// Employee login
app.get("/emplogin",(req,res)=>{
    var email = req.query.email;
    var password = req.query.password;
    Employees.find
    ({email:email,password:password},(err,employees)=>{
        if(err){
            res.json(null);
        }else{
            console.log(employees);
            res.json(employees);
        }
    }
    )
}
)




// Employee Signup
app.post("/empsignup",(req,res)=>{
    var employee = new Employees(req.body);
    employee.save((err,employee)=>{
        if(err){
            res.json(null);
        }else{
            res.json(employee);
        }
    })
})  



// get order details in employee
app.get("/ordersbyemp",(req,res)=>{
    var eeamil = req.query.eemail;
    Orders.find
    ({email:eemail},(err,orders)=>{
        if(err){
            res.json(null);
        }else{
            console.log(orders);
            res.json(orders);
        }
    }
    )
})



// Update order details and status
app.put("/updateorder/:id",(req,res)=>{
    var orderid = req.params.id;
    Orders.update
    ({_id:orderid},{$set:{status:order.status}},(err,orders)=>{
        if(err){
            res.json(null);
        }else{
            console.log(orders);
            res.json(orders);
        }
    }
    ) 
}
)




//get Orders by user
app.get("/ordersbyuser",(req,res)=>{
    var uemail = req.query.uemail;
    Orders.find
    ({email:uemail},(err,orders)=>{
        if(err){
            res.json(null);
        }else{
            console.log(orders);
            res.json(orders);
        }
    }
    )
}
)





// Update user detailss
app.post('/updateuser',async (req,res)=>{
    let query = {'email': req.body.email};

Users.findOneAndUpdate(query, req.body, {upsert: true}, function(err, doc) {
    if (err) return res.send(500, {error: err});

    console.log(doc);
    return res.json(doc);
});
}
)




// find employee
app.get("/findemployee",(req,res)=>{

    let profession = req.query.profession;
    let free = req.query.free;
    Employees.find
    ({profession:profession,free:free},(err,employees)=>{
        if(err){
            res.json(null);
        }else{
            console.log(employees);
            res.json(employees);
        }
    }
    )
}
)



// update employee
app.post('/updateemployee',async (req,res)=>{

    console.log("Update employee",req.body)

    let query = {'email': req.body.email};



Employees.findOneAndUpdate(query
, req.body, {upsert: false}, function(err, doc) {
    if (err) return res.send(500, {error: err});

    console.log(doc);
    return res.json(doc);
});
}
)



// update employee by email
app.post('/updateemployeebyemail',async (req,res)=>{

    let query = {'email': req.body.email};
    
   
Employees.findOneAndUpdate(query,{free:req.body.free}, {upsert: false}, function(err, doc) {
    if (err) return res.send(500, {error: err});

    console.log(doc);
    return res.json(doc);
});
}
)



// post orders
app.post("/orders",(req,res)=>{
    var order = new Orders(req.body);
    order.save((err,order)=>{
        if(err){
            res.json(null);
        }else{
            res.json(order);
        }
    })
})


// get orders for employeee (work page)
app.get("/getorders",(req,res)=>{
    let eemail = req.query.eemail;
    Orders.find({email:eemail},(err,orders)=>{
        if(err){
            res.json(null);
        }else{
            console.log(orders);
            res.json(orders);
        }
    }
    )
}
)


// update orders
app.post('/updateorder',async (req,res)=>{
    let cost = req.body.cost;
    let orderid = req.body.orderid;
    let query = {'_id': orderid};
    let status = req.body.status;


    console.log("Update order",req.body)

Orders.findOneAndUpdate(query, {status:status}, {upsert: false}, function(err, doc) {
    if (err) return res.send(500, {error: err});

    console.log(doc);
    return res.json(doc);
});



Orders.updateOne(
    {_id: orderid}, 
    {cost : cost },
    {multi:true}, 
      function(err, numberAffected){  
      });


}
)



const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("App listening on port 3001");
});