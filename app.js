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

require("dotenv").config();

mongoose.connect('mongodb+srv://prabhash:prabhash@cluster0.cucjq6t.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function(req, res) {
    res.send("hello world");
})


// Login for user
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
    ({uemail:uemail},(err,orders)=>{
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
    Orders.find({eemail:eemail},(err,orders)=>{
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




// For Admin Page
app.get("/getordersforadmin",(req,res)=>{
    Orders.find({},(err,orders)=>{
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


// get all employees
app.get("/getemployeesforadmin",(req,res)=>{
    Employees.find({},(err,employees)=>{
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


// get all users
app.get("/getusersforadmin",(req,res)=>{
    Users.find({},(err,users)=>{
        if(err){
            res.json(null);
        }else{
            console.log(users);
            res.json(users);
        }
    }
    )
}
)

// get messages for admin
app.get("/getmessagesforadmin",(req,res)=>{
    Messages.find({},(err,messages)=>{
        if(err){
            res.json(null);
        }else{
            console.log(messages);
            res.json(messages);
        }
    }
    )
}
)





// filter customers by first name , last name , email , phone, city, state, pincode
app.get("/filtercustomersforadmin", (req,res)=>{

    let filter = req.query.filter;
    let search = req.query.search;

    console.log("Filter",filter);
    console.log("Search",search);

    if(search == ""){
        Users.find({},(err,users)=>{
            if(err){
                res.json(null);
            }else{
                console.log(users);
                res.json(users);
            }
        }
        )
    }
    else if(filter == "firstName"){
        Users.find({firstName:search},(err,users)=>{
            if(err){
                res.json(null);
            }else{
                console.log(users);
                res.json(users);
            }
        }
        )
    }else if(filter == "lastName"){
        Users.find({lastName:search},(err,users)=>{
            if(err){
                res.json(null);
            }else{
                console.log(users);
                res.json(users);
            }
        }
        )
    }else if(filter == "email"){
        Users.find({email:search},(err,users)=>{
            if(err){
                res.json(null);
            }else{
                console.log(users);
                res.json(users);
            }
        }
        )
    }else if(filter == "phone"){
        Users.find({phone:search},(err,users)=>{
            if(err){
                res.json(null);
            }else{
                console.log(users);
                res.json(users);
            }
        }
        )
    }else if(filter == "city"){
        Users.find({city:search},(err,users)=>{
            if(err){
                res.json(null);
            }else{
                console.log(users);
                res.json(users);
            }
        }
        )
    }else if(filter == "state"){
        Users.find({state:search},(err,users)=>{
            if(err){
                res.json(null);
            }else{
                console.log(users);
                res.json(users);
            }
        }
        )
    }else if(filter == "pincode"){
        Users.find({pincode:search},(err,users)=>{
            if(err){
                res.json(null);
            }else{
                console.log(users);
                res.json(users);
            }
        }
        )
    }




   


})









// filter employees by first name , last name , gender, profession, email , phone, city, state, pincode
app.get("/filteremployeesforadmin", (req,res)=>{
    let filter = req.query.filter;
    let search = req.query.search;

    console.log("Filter",filter);
    console.log("Search",search);

    if(search==""){
        Employees.find({},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        }
        )
    }
    else if(filter=="firstName"){
        Employees.find({firstName:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        })
    }
    else if(filter=="lastName"){
        Employees.find({lastName:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        }
        )
    }
    else if(filter=="gender"){
        Employees.find({gender:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
    })
    }
    else if(filter=="profession"){
        Employees.find({profession:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        }
        )
    }
    else if(filter=="email"){
        Employees.find({ email:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        }
        )
    }
    else if(filter=="phone"){
        Employees.find({phone:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        }
        )
    }
    else if(filter=="city"){
        Employees.find({city:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        })
    }
    else if(filter=="state"){
        Employees.find({state:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        }
        )

    }
    else if(filter=="pincode"){
        Employees.find({pincode:search},(err,employees)=>{
            if(err){
                res.json(null);
            }else{
                console.log(employees);
                res.json(employees);
            }
        }
        )
    }



    })







// filter orders by service type, customer name,customer email, customer phone  , employee name,employee email, employee phone, state,pincode
app.get("/filterordersforadmin", (req,res)=>{
    let filter = req.query.filter;
    let search = req.query.search;

    console.log("Filter",filter);
    console.log("Search",search);

    if(search == ""){
        Orders.find({},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }
    else if(filter == "itype"){
        Orders.find({itype:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }
    else if(filter == "ufname"){
        Orders.find({ufname:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }
    else if(filter == "uemail"){
        Orders.find({uemail:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }
    else if(filter == "uphone"){
        Orders.find({uphone:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }
    else if(filter == "efname"){
        Orders.find({efname:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }
    else if(filter == "eemail"){
        Orders.find({eemail:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        })
    }
    else if(filter == "ephone"){
        Orders.find({ephone:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }
    else if(filter == "ord_state"){
        Orders.find({ord_state:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }
    else if(filter == "ord_pincode"){
        Orders.find({ord_pincode:search},(err,orders)=>{
            if(err){
                res.json(null);
            }else{
                console.log(orders);
                res.json(orders);
            }
        }
        )
    }



})



// filter messages by cname and cemail
app.get("/filtermessagesforadmin", (req,res)=>{

    let filter = req.query.filter;
    let search = req.query.search;

    console.log("Filter",filter);
    console.log("Search",search);

    if(search == ""){
        Messages.find({},(err,messages)=>{
            if(err){
                res.json(null);
            }else{
                console.log(messages);
                res.json(messages);
            }
        }
        )
    }
    else if(filter == "name"){
        Messages.find({name:search},(err,messages)=>{
            if(err){
                res.json(null);
            }else{
                console.log(messages);
                res.json(messages);
            }
        }
        )
    }
    else if(filter == "email"){
        Messages.find({ email:search},(err,messages)=>{
            if(err){
                res.json(null);
            }else{
                console.log(messages);
                res.json(messages);
            }
        }

        )
    }
})



// Delete User
app.delete("/deleteuser/:id", (req, res) => {
    let id = req.params.id;
    console.log("id", id);
    Users.findByIdAndDelete(id, (err, user) => {
        if (err) {
            res.json(null);
        } else{
            console.log("user", user);
            res.json(user);
        }
    });
});


// Delete Employee
app.delete("/deleteemployee/:id", (req, res) => {
    let id = req.params.id;
    console.log("id", id);
    Employees.findByIdAndDelete(id, (err, employee) => {
        if (err) {
            res.json(null);
        } else{
            console.log("employee", employee);
            res.json(employee);
        }
    });
});

// Delete Order
app.delete("/deleteorder/:id", (req, res) => {
    let id = req.params.id;
    console.log("id", id);
    Orders.findByIdAndDelete(id, (err, order) => {
        if (err) {
            res.json(null);
        } else{
            console.log("order", order);
            res.json(order);
        }
    });
});

// Delete Message
app.delete("/deletemessage/:id", (req, res) => {
    let id = req.params.id;
    console.log("id", id);
    Messages.findByIdAndDelete(id, (err, message) => {
        if (err) {
            res.json(null);
        } else{
            console.log("message", message);
            res.json(message);
        }
    });
});





const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("App listening on port 3001");
});