var express = require("express");
var app = express();
var mongoose = require("mongoose");
var cors = require("cors");
var Users = require("./models/User");
var Employees = require("./models/Employee");
var Messages = require("./models/Message");
var Orders = require("./models/Order");
app.use(express.json());
var cors = require("cors");
app.use(cors());
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const bodyparser = require("body-parser");
app.use(bodyparser.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const redis = require("redis");


const Razorpay = require("razorpay");
const shortid = require("shortid");
var razorpay = new Razorpay({
  key_id: "rzp_test_5CdUHW8gMUz0Gf",
  key_secret: "SyujWPOCUf6hKxSOtv8V27iU",
});



// const client = redis.createClient({
//     password: '2Zfrl7v1CXti8ZWljhO89TQ8N3VFeQrH',
//     socket: {
//         host: 'redis-13741.c321.us-east-1-2.ec2.cloud.redislabs.com',
//         port: 13741
//     }
// });


// client.connect()



// Morgan - Multer - Cloudinary
// const morgan = require("morgan");
// const { logs } = require("./morgan/morgan.js");
// app.use(morgan("combined", { stream: logs }));

require("dotenv").config();

const cloudinary = require("./cloudinary");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });



// import compare
const compare = require("bcryptjs").compare;

// swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AT YOUR SERVICE (AYS)",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: process.env.URL,
      },
    ],
  },
  apis: ["./app.js"],
};
const swaggerSpec = swaggerJsDoc(options);

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


mongoose.connect('mongodb+srv://prabhash:prabhash@cluster0.cucjq6t.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => {
    
  })
  .catch((err) => {
    console.log(err);
  })






app.get("/", async function (req, res) {
  //let kp = await client.get("admin")
  //console.log(kp);
  //await client.del("admin");
  res.send("hello world");
});




app.post("/razorpay",(req,res)=>{
  const options = {
    amount: req.body.amount*100,  
    currency: "INR",
    receipt: shortid.generate(),
    payment_capture: 1
  };
  razorpay.orders.create(options, function(err, order)
  {
   res.json({auth:true,id:order.id,amount:order.amount,currency:order.currency})
  });
})


// Middleware
const verifyJWT = (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  // const token = req.headers["x-access-token"];
  //let token = req.headers["authorization"];
  // if(token!=null || token!=undefined){
  //   if(token.includes("Bearer") || token.includes("bearer")){
  //  token = req.headers["authorization"].split(" ")[1];
  //   }
  // }
  console.log("verifyJWT_FRontend:", token);

  if (!token) {
    res.json({ auth: false, message: "You failed to authenticate" });
  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      console.log(decoded);
      if (err) {
        res.json({ auth: false, message: "You failed to authenticate1" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

// Defining swagger schemas


/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  email:
 *                      type: string
 *                  phone:
 *                      type: string
 *                  address:
 *                      type: string
 *                  city:
 *                      type: string
 *                  state:
 *                      type: string
 *                  pincode:
 *                      type: string
 *                  password:
 *                      type: string
 *          Message:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                      email:
 *                          type: string
 *                      message:
 *                          type: string
 *          Employee:
 *                  type: object
 *                  properties:
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *                      gender:
 *                          type: string
 *                      profession:
 *                          type: string
 *                      email:
 *                          type: string
 *                      phone:
 *                          type: string
 *                      address:
 *                          type: string
 *                      city:
 *                          type: string
 *                      state:
 *                          type: string
 *                      pincode:
 *                          type: string
 *                      password:
 *                          type: string
 *                      free:
 *                         type:  integer
 *          Order:
 *               type: object
 *               properties:
 *                  status:
 *                     type: integer
 *                  iname:
 *                     type: string
 *                  iimg:
 *                     type: string
 *                  itype:
 *                     type: string
 *                  ufname:
 *                     type: string
 *                  ulname:
 *                     type: string
 *                  uemail:
 *                     type: string
 *                  uphone:
 *                     type: string
 *                  eid:
 *                     type: integer
 *                  efname:
 *                     type: string
 *                  elname:
 *                     type: string
 *                  eemail:
 *                     type: string
 *                  ephone:
 *                     type: string
 *                  ord_name:
 *                     type: string
 *                  ord_email:
 *                     type: string
 *                  ord_phone:
 *                     type: string
 *                  ord_address1:
 *                     type: string
 *                  ord_address2:
 *                     type: string
 *                  ord_state:
 *                     type: string
 *                  ord_pincode:
 *                     type: string
 *                  ord_date:
 *                     type: string
 *                  id:
 *                     type: integer
 *                  cost:
 *                     type: string
 */

// Login for user

/**
 * @swagger
 * /login:
 *  get:
 *      summary: gets the user details with the given login credentials
 *      description: finds a user with the given user email and password
 *      parameters:
 *          - in: query
 *            name: email
 *            required: true
 *            description: email of the user
 *            schema:
 *              type: string
 *              example: "siddu@gmail.com"
 *          - in: query
 *            name: password
 *            required: true
 *            description: password of the user
 *            schema:
 *              type: string
 *              example: "Siddu@12"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 *
 */

app.get("/login", async (req, res) => {
  let email = req.query.email;
  let password = req.query.password;

 //await client.del(email);

  Users.find({ email: email }, (err, users) => {
    if (users.length > 0) {
      // compare password
      bcrypt.compare(password, users[0].password, function (err, result) {
        if (result) {
          // create token
          let token = jwt.sign({ email: users[0].email }, process.env.JWT_KEY, {
            expiresIn: "1h",
          });

          console.log("User token:", token);
          res.json({ auth: true, token: token, users: users });
        } else {
          res.json({ auth: false, token: null, users: null });
        }
      });

      // if(err){
      //     res.json(null);
      // }else{
      //     console.log(users);
      //     res.json(users);
      // }
    } else {
      res.json({ auth: false, token: null, users: null });
    }
  });
});

// check email exists or not

/**
 * @swagger
 * /checkemail:
 *  get:
 *      summary: checks if an email exists or not
 *      description: checks whether a given email exists or not
 *      parameters:
 *          - in: query
 *            name: email
 *            required: true
 *            description: email of the user
 *            schema:
 *              type: string
 *              example: "siddu@gmail.com"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 *
 */

app.get("/checkemail", (req, res) => {
  let email = req.query.email;
  console.log(email);
  Users.find({ email: email }, (err, users) => {
    if (err) {
      res.json(null);
    } else {
      console.log(users);
      res.json(users);
    }
  });
});

//User Signup

/**
 * @swagger
 * /signup:
 *  post:
 *      summary: create a new user
 *      description: create new user with given user details and adds to the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 *
 */

app.post("/signup", (req, res) => {
  var user = new Users(req.body);

  user.save((err, user) => {
    if (err) {
      res.json(null);
    } else {
      res.json(user);
    }
  });
});

// Conatct Us messages

/**
 * @swagger
 * /messages:
 *  post:
 *      summary: posts a message
 *      security:
 *        - bearerAuth: []
 *      description: sends a message to the admin
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Message'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Message'
 *
 */

app.post("/messages", verifyJWT, (req, res) => {
  var message = new Messages(req.body);
  message.save((err, message) => {
    if (err) {
      res.json({ auth: false, message: "You failed to authenticate" });
    } else {
      res.json({ auth: true, message: message });
    }
  });
});

// Employee login

/**
 * @swagger
 * /emplogin:
 *  get:
 *      summary: gets the employee details with the given login credentials
 *      description: finds a employee with the given employee email and password
 *      parameters:
 *          - in: query
 *            name: email
 *            required: true
 *            description: email of the employee
 *            schema:
 *              type: string
 *              example: "siddu@gmail.com"
 *          - in: query
 *            name: password
 *            required: true
 *            description: password of the employee
 *            schema:
 *              type: string
 *              example: "Siddu@12"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */

app.get("/emplogin", (req, res) => {
  let email = req.query.email;
  let password = req.query.password;




  Employees.find({ email: email }, (err, employees) => {
    if (err) {
      res.json({ auth: false, token: null, employees: null });
    }
    else if (employees.length == 0) {
      res.json({ auth: false, token: null, employees: null });
    }
    else {
      // compare password
      bcrypt.compare(password, employees[0].password, function (err, result) {

        if (result) {
          // create token
          let token = jwt.sign({ email: employees[0].email }, "jwtSecret", {
            expiresIn: "1h",
          });

          console.log("Token employee: ", token);
          res.json({ auth: true, token: token, employees: employees });
        } else {
          res.json({ auth: false, token: null, employees: null });
        }
      });

      // console.log(employees);
      // res.json(employees);
    }
  });
});

// Employee Signup

/**
 * @swagger
 * /empsignup:
 *  post:
 *      summary: create a new Employee
 *      description: create new Employee with given employee details and adds to the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Employee'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */
app.post("/empsignup", (req, res) => {
  let employee1 = new Employees(req.body);
  console.log(employee1);

  // check email exists or not
  Employees.find({ email: employee1.email }, (err, employees) => {
    if (err) {
      res.json(null);
    } else {
      // if email exists
      if (employees.length > 0) {
        res.json(null);
      } else {
        employee1.save((err, employee) => {
          if (err) {
            res.json(null);
          } else {
            res.json(employee);
          }
        });
      }
    }
  });
});

// get order details in employee (employeeee.js file)
// app.get("/ordersbyemp",verifyJWT,(req,res)=>{
//     let eemail = req.query.eemail;
//     Orders.find
//     ({email:eemail},(err,orders)=>{
//         if(err){
//             res.json({auth:false,orders:null});
//         }else{
//             console.log(orders);
//             res.json({auth:true,orders:orders});
//         }
//     }
//     )
// })

// Update order details and status (****Not Used****)
app.put("/updateorder/:id", verifyJWT, (req, res) => {
  var orderid = req.params.id;
  Orders.update(
    { _id: orderid },
    { $set: { status: order.status } },
    (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    }
  );
});

//get Orders by user

/**
 * @swagger
 * /ordersbyuser:
 *  get:
 *      summary: gets the user order details
 *      security:
 *         - bearerAuth: []
 *      description: we get all the orders made by the user
 *      parameters:
 *          - in: query
 *            name: uemail
 *            required: true
 *            description: email of the user
 *            schema:
 *              type: string
 *              example: "siddu@gmail.com"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Order'
 *
 */

app.get("/ordersbyuser", verifyJWT, async (req, res) => {

  let uemail = req.query.uemail;

  let isCached = false;
  let results;

  try {
    //let cacheResults = await client.get(uemail);
    // if (cacheResults) {
    //   isCached = true;
    //   results = JSON.parse(cacheResults);
    //   console.log("from cache");
    //   res.json({ auth: true, orders: results, fromCache: isCached });
    // } else {
      Orders.find({ uemail: uemail },async (err, orders) => {
        if (err) {
          console.log("Error in fetching orders");
          res.json({ auth: false, orders: null,fromCache: isCached });
        } else {
          results = orders;
          //await client.set(uemail, JSON.stringify(results));
          res.json({ auth: true, orders: orders, fromCache: isCached });
        }

      });

        console.log("from db");
      
    // }

    
  } catch (error) {

    console.log("Big error",error);
    res.json({ auth: false, orders: null ,fromCache: isCached});
   
  }
  


  // Orders.find({ uemail: uemail }, (err, orders) => {
  //   if (err) {
  //     res.json({ auth: false, orders: null });
  //   } else {
  //     console.log(orders);
  //     res.json({ auth: true, orders: orders });
  //   }
  // });
 
  
});




// Update user detailss

/**
 * @swagger
 * /updateuser:
 *  post:
 *      summary: Updates user details
 *      security:
 *          - bearerAuth: []
 *      description: updates the user details with the given user details
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 *
 */
app.post("/updateuser",verifyJWT, async (req, res) => {
  let query = { email: req.body.email };

  Users.findOneAndUpdate(
    query,
    req.body,
    { upsert: true },
    function (err, doc) {
      if (err) {
        console.log("Error in updating user details");
        res.json({ auth: false, doc: null });
      } else {
        console.log("User details updated successfully");
        res.json({ auth: true, doc: doc });
      }
    }
  );
});

// find employee

/**
 * @swagger
 * /findemployee:
 *  get:
 *      summary: finds a employee
 *      security:
 *          - bearerAuth: []
 *      description: finds an employee with given profession who is free
 *      parameters:
 *          - in: query
 *            name: profession
 *            required: true
 *            description: email of the user
 *            schema:
 *              type: string
 *              example: "salon"
 *          - in: query
 *            name: free
 *            required: true
 *            description: whether employee is free or not
 *            schema:
 *              type: integer
 *              example: 0
 *          - in: query
 *            name: pincode
 *            required: true
 *            description: pincode of the city where employee is located
 *            schema:
 *              type: integer
 *              example: 0
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */

app.get("/findemployee", verifyJWT, (req, res) => {
  let profession = req.query.profession;
  let pincode = req.query.pincode;
  let free = req.query.free;
  Employees.find(
    { profession: profession, pincode: pincode, free: free },
    (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    }
  );
});

// update employee

/**
 * @swagger
 * /updateemployee:
 *  post:
 *      summary: Updates employee details
 *      security:
 *          - bearerAuth: []
 *      description: updates the employee details with the given employee details
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Employee'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */

app.post("/updateemployee", verifyJWT, async (req, res) => {
  console.log("Update employee", req.body);

  let query = { email: req.body.email };

  Employees.findOneAndUpdate(
    query,
    req.body,
    { upsert: false },
    function (err, doc) {
      if (err) {
        console.log("Error in updating employee details");
        res.json({ auth: false, doc: null });
      } else {
        console.log("Employee details updated successfully");
        res.json({ auth: true, doc: doc });
      }
    }
  );
});

// update employee by email

/**
 * @swagger
 * /updateemployeebyemail:
 *  post:
 *      summary: Updates a employees availability
 *      security:
 *          - bearerAuth: []
 *      description: updates the employee availability
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Employee'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */

app.post("/updateemployeebyemail", verifyJWT, async (req, res) => {
  let query = { email: req.body.email };

  Employees.findOneAndUpdate(
    query,
    { free: req.body.free },
    { upsert: false },
    function (err, doc) {
      if (err) {
        console.log("Error in updating employee details");
        res.json({ auth: false, doc: null });
      } else {
        console.log("Employee details updated successfully");
        res.json({ auth: true, doc: doc });
      }
    }
  );
});

// post orders

/**
 * @swagger
 * /orders:
 *  post:
 *      summary: creates a new order
 *      security:
 *        - bearerAuth: []
 *      description: creates a new order with the given detailsd
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Order'
 *      responses:
 *          200:
 *              description: Successfull
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Order'
 *
 */

app.post("/orders", verifyJWT, async (req, res) => {

  
   //await client.del(req.body.uemail);


  var order = new Orders(req.body);
  order.save((err, order) => {
    if (err) {
      res.json({ auth: false, order: null });
    } else {
      res.json({ auth: true, order: order });
    }
  });
});

// get orders for employeee (work page)

/**
 * @swagger
 * /getorders:
 *  get:
 *      summary: gets the order details
 *      security:
 *        - bearerAuth: []
 *      description: we get all the orders of the employee
 *      parameters:
 *          - in: query
 *            name: eemail
 *            required: true
 *            description: email of the employee
 *            schema:
 *              type: string
 *              example: "siddu@gmail.com"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Order'
 *
 */

app.get("/getorders", verifyJWT, (req, res) => {
  let eemail = req.query.eemail;
  Orders.find({ eemail: eemail }, (err, orders) => {
    if (err) {
      res.json({ auth: false, orders: null });
    } else {
      console.log(orders);
      res.json({ auth: true, orders: orders });
    }
  });
});









// update orders

/**
 * @swagger
 * /updateorder:
 *  post:
 *      summary: updates order details
 *      security:
 *        - bearerAuth: []
 *      description: updates the order details
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Order'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Order'
 *
 */

app.post("/updateorder", verifyJWT, async (req, res) => {

  // client.del(req.body.uemail);
  let cost = req.body.cost;
  let orderid = req.body.orderid;
  let query = { _id: orderid };
  let status = req.body.status;

  console.log("Update order", req.body);

  Orders.findOneAndUpdate(
    query,
    { status: status },
    { upsert: false },
    function (err, doc) {
      if (err) {
        console.log("Error in updating order details");
        res.json({ auth: false, doc: null });
      } else {
        console.log("Order details updated successfully");
        res.json({ auth: true, doc: doc });
      }
    }
  );

  Orders.updateOne(
    { _id: orderid },
    { cost: cost },
    { multi: true },
    function (err, numberAffected) { }
  );
});

// For Admin Page

app.get("/adminlogin",async (req, res) => {
  let email = req.query.adminemail;
  let password = req.query.adminpassword;
  //await client.del("admin");
  console.log(req.body);

  if (email == "varma@gmail.com" && password == "varma") {
    console.log("Admin logged in");

    // create a token
    let token = jwt.sign({ email: email }, "jwtSecret", { expiresIn: "1h" });

    console.log("Admin token:", token);
    res.json({ auth: true, token: token });
  } else {
    res.json({ auth: false, token: null });
  }
});

// get orders for admin
/**
 * @swagger
 * /getordersforadmin:
 *  get:
 *      summary: gets all order details
 *      security:
 *        - bearerAuth: []
 *      description: we get all order details
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Order'
 *
 */

app.get("/getordersforadmin", verifyJWT,async (req, res) => {


  Orders.find({}, (err, orders) => {
    if (err) {
      res.json({ auth: false, orders: null });
    } else {
      console.log(orders);
      res.json({ auth: true, orders: orders });
    }
  });
});

// get all employees

/**
 * @swagger
 * /getemployeesforadmin:
 *  get:
 *      summary: gets all employees details
 *      security:
 *        - bearerAuth: []
 *      description: we get all employees details
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */

app.get("/getemployeesforadmin", verifyJWT, (req, res) => {
  Employees.find({}, (err, employees) => {
    if (err) {
      res.json({ auth: false, employees: null });
    } else {
      console.log(employees);
      res.json({ auth: true, employees: employees });
    }
  });
});

// get all users
/**
 * @swagger
 * /getusersforadmin:
 *  get:
 *      summary: gets all users details
 *      security:
 *           - bearerAuth: []
 *      description: we get all users details
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 *
 */

app.get("/getusersforadmin", verifyJWT, async (req, res) => {

  let isCached = false;
  let results;

  try {
    //let cacheResults = await client.get("admin");
    // if (cacheResults) {
    //   isCached = true;
    //   results = JSON.parse(cacheResults);
    //   console.log("from cache");
    //   res.json({ auth: true,  users: results, fromCache: isCached });
    // } else {

      Users.find({},async (err, users) => {
        if (err) {
          console.log("Error in fetching orders");
          res.json({ auth: false, users: null,fromCache: isCached });
        } else {
          results = users;
          // await client.set("admin", JSON.stringify(results));
          res.json({ auth: true, users:users, fromCache: isCached });
        }
      });

        console.log("from db");
      
     // }
    
  } catch (error) {

    console.log("Big error",error);
    res.json({ auth: false, users: null ,fromCache: isCached});
   
  }

 


  // Users.find({}, (err, users) => {
  //   if (err) {
  //     res.json({ auth: false, users: null });
  //   } else {
  //     console.log(users);
  //     res.json({ auth: true, users: users });
  //   }
  // });
});

// get messages for admin

/**
 * @swagger
 * /getmessagesforadmin:
 *  get:
 *      summary: gets all the messages
 *      security:
 *        - bearerAuth: []
 *      description: we get all the messages
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Message'
 *
 */

app.get("/getmessagesforadmin",verifyJWT, (req, res) => {
  Messages.find({}, (err, messages) => {
    if (err) {
      res.json({ auth: false, messages: null });
    } else {
      console.log(messages);
      res.json({ auth: true, messages: messages });
    }
  });
});

// filter customers by first name , last name , email , phone, city, state, pincode

/**
 * @swagger
 * /filtercustomersforadmin:
 *  get:
 *      summary: gets the user details with the given filter
 *      security:
 *        - bearerAuth: []
 *      description: we get the user details with the given filter
 *      parameters:
 *          - in: query
 *            name: filter
 *            required: true
 *            description: select the filter
 *            schema:
 *              type: string
 *              enum: ["firstName", "lastName", "email", "phone", "city", "state", "pincode"]
 *          - in: query
 *            name: search
 *            required: true
 *            description: enter the value to be searched
 *            schema:
 *              type: string
 *              example: "siddu"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 *
 */

app.get("/filtercustomersforadmin", verifyJWT, (req, res) => {
  let filter = req.query.filter;
  let search = req.query.search;

  console.log("Filter", filter);
  console.log("Search", search);

  if (search == "") {
    Users.find({}, (err, users) => {
      if (err) {
        res.json({ auth: false, users: null });
      } else {
        console.log(users);
        res.json({ auth: true, users: users });
      }
    });
  } else if (filter == "firstName") {
    Users.find({ firstName: search }, (err, users) => {
      if (err) {
        res.json({ auth: false, users: null });
      } else {
        console.log(users);
        res.json({ auth: true, users: users });
      }
    });
  } else if (filter == "lastName") {
    Users.find({ lastName: search }, (err, users) => {
      if (err) {
        res.json({ auth: false, users: null });
      } else {
        console.log(users);
        res.json({ auth: true, users: users });
      }
    });
  } else if (filter == "email") {
    Users.find({ email: search }, (err, users) => {
      if (err) {
        res.json({ auth: false, users: null });
      } else {
        console.log(users);
        res.json({ auth: true, users: users });
      }
    });
  } else if (filter == "phone") {
    Users.find({ phone: search }, (err, users) => {
      if (err) {
        res.json({ auth: false, users: null });
      } else {
        console.log(users);
        res.json({ auth: true, users: users });
      }
    });
  } else if (filter == "city") {
    Users.find({ city: search }, (err, users) => {
      if (err) {
        res.json({ auth: false, users: null });
      } else {
        console.log(users);
        res.json({ auth: true, users: users });
      }
    });
  } else if (filter == "state") {
    Users.find({ state: search }, (err, users) => {
      if (err) {
        res.json({ auth: false, users: null });
      } else {
        console.log(users);
        res.json({ auth: true, users: users });
      }
    });
  } else if (filter == "pincode") {
    Users.find({ pincode: search }, (err, users) => {
      if (err) {
        res.json({ auth: false, users: null });
      } else {
        console.log(users);
        res.json({ auth: true, users: users });
      }
    });
  }
});

// filter employees by first name , last name , gender, profession, email , phone, city, state, pincode

/**
 * @swagger
 * /filteremployeesforadmin:
 *  get:
 *      summary: gets the employee details with the given filter
 *      security:
 *        - bearerAuth: []
 *      description: we get the employee details with the given filter
 *      parameters:
 *          - in: query
 *            name: filter
 *            required: true
 *            description: select the filter
 *            schema:
 *              type: string
 *              enum: ["firstName", "lastName","gender","profession","email", "phone", "city", "state", "pincode"]
 *          - in: query
 *            name: search
 *            required: true
 *            description: enter the value to be searched
 *            schema:
 *              type: string
 *              example: "siddu"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */

app.get("/filteremployeesforadmin", verifyJWT, (req, res) => {
  let filter = req.query.filter;
  let search = req.query.search;

  console.log("Filter", filter);
  console.log("Search", search);

  if (search == "") {
    Employees.find({}, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "firstName") {
    Employees.find({ firstName: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "lastName") {
    Employees.find({ lastName: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "gender") {
    Employees.find({ gender: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "profession") {
    Employees.find({ profession: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "email") {
    Employees.find({ email: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "phone") {
    Employees.find({ phone: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "city") {
    Employees.find({ city: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "state") {
    Employees.find({ state: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  } else if (filter == "pincode") {
    Employees.find({ pincode: search }, (err, employees) => {
      if (err) {
        res.json({ auth: false, employees: null });
      } else {
        console.log(employees);
        res.json({ auth: true, employees: employees });
      }
    });
  }
});

// filter orders by service type, customer name,customer email, customer phone  , employee name,employee email, employee phone, state,pincode

/**
 * @swagger
 * /filterordersforadmin:
 *  get:
 *      summary: gets the order details with the given filter
 *      security:
 *        - bearerAuth: []
 *      description: we get the order details with the given filter
 *      parameters:
 *          - in: query
 *            name: filter
 *            required: true
 *            description: select the filter
 *            schema:
 *              type: string
 *              enum: ["itype" , "ufname", "uemail", "uphone", "efname", "eemail", "ephone", "ord_state", "ord_pincode"]
 *          - in: query
 *            name: search
 *            required: true
 *            description: enter the value to be searched
 *            schema:
 *              type: string
 *              example: "siddu"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */
app.get("/filterordersforadmin", verifyJWT, (req, res) => {
  let filter = req.query.filter;
  let search = req.query.search;

  console.log("Filter", filter);
  console.log("Search", search);

  if (search == "") {
    Orders.find({}, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "itype") {
    Orders.find({ itype: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "ufname") {
    Orders.find({ ufname: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "uemail") {
    Orders.find({ uemail: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "uphone") {
    Orders.find({ uphone: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "efname") {
    Orders.find({ efname: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "eemail") {
    Orders.find({ eemail: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "ephone") {
    Orders.find({ ephone: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "ord_state") {
    Orders.find({ ord_state: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  } else if (filter == "ord_pincode") {
    Orders.find({ ord_pincode: search }, (err, orders) => {
      if (err) {
        res.json({ auth: false, orders: null });
      } else {
        console.log(orders);
        res.json({ auth: true, orders: orders });
      }
    });
  }
});

// filter messages by cname and cemail

/**
 * @swagger
 * /filtermessagesforadmin:
 *  get:
 *      summary: gets the order details with the given filter
 *      security:
 *        - bearerAuth: []
 *      description: we get the order details with the given filter
 *      parameters:
 *          - in: query
 *            name: filter
 *            required: true
 *            description: select the filter
 *            schema:
 *              type: string
 *              enum: ["name","email"]
 *          - in: query
 *            name: search
 *            required: true
 *            description: enter the value to be searched
 *            schema:
 *              type: string
 *              example: "siddu"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */

app.get("/filtermessagesforadmin", verifyJWT, (req, res) => {
  let filter = req.query.filter;
  let search = req.query.search;

  console.log("Filter", filter);
  console.log("Search", search);

  if (search == "") {
    Messages.find({}, (err, messages) => {
      if (err) {
        res.json({ auth: false, messages: null });
      } else {
        console.log(messages);
        res.json({ auth: true, messages: messages });
      }
    });
  } else if (filter == "name") {
    Messages.find({ name: search }, (err, messages) => {
      if (err) {
        res.json({ auth: false, messages: null });
      } else {
        console.log(messages);
        res.json({ auth: true, messages: messages });
      }
    });
  } else if (filter == "email") {
    Messages.find({ email: search }, (err, messages) => {
      if (err) {
        res.json({ auth: false, messages: null });
      } else {
        console.log(messages);
        res.json({ auth: true, messages: messages });
      }
    });
  }
});

// Delete User

/**
 * @swagger
 * /deleteuser/{id}:
 *  delete:
 *      summary: delete a user
 *      security:
 *        - bearerAuth: []
 *      description: delete a user
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: id
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 *
 */

app.delete("/deleteuser/:id", verifyJWT, (req, res) => {
  let id = req.params.id;
  console.log("id", id);
  Users.findByIdAndDelete(id, (err, user) => {
    if (err) {
      res.json({ auth: false, user: null });
    } else {
      console.log("user", user);
      res.json({ auth: true, user: user });
    }
  });
});

// Delete Employee

/**
 * @swagger
 * /deleteemployee/{id}:
 *  delete:
 *      summary: delete a employee
 *      security:
 *        - bearerAuth: []
 *      description: delete a employee
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: id
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Employee'
 *
 */

app.delete("/deleteemployee/:id", verifyJWT, (req, res) => {
  let id = req.params.id;
  console.log("id", id);
  Employees.findByIdAndDelete(id, (err, employee) => {
    if (err) {
      res.json({ auth: false, employee: null });
    } else {
      console.log("employee", employee);
      res.json({ auth: true, employee: employee });
    }
  });
});

// Delete Order

/**
 * @swagger
 * /deleteorder/{id}:
 *  delete:
 *      summary: delete a Order
 *      security:
 *        - bearerAuth: []
 *      description: delete a Order
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: id
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Order'
 *
 */

app.delete("/deleteorder/:id", verifyJWT, (req, res) => {
  let id = req.params.id;
  console.log("id", id);
  Orders.findByIdAndDelete(id, (err, order) => {
    if (err) {
      res.json({ auth: false, order: null });
    } else {
      console.log("order", order);
      res.json({ auth: true, order: order });
    }
  });
});

// Delete Message

/**
 * @swagger
 * /deletemessage/{id}:
 *  delete:
 *      summary: delete a message
 *      security:
 *        - bearerAuth: []
 *      description: delete a message
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: id
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Message'
 *
 */
app.delete("/deletemessage/:id", verifyJWT, (req, res) => {
  let id = req.params.id;
  console.log("id", id);
  Messages.findByIdAndDelete(id, (err, message) => {
    if (err) {
      res.json({ auth: false, message: null });
    } else {
      console.log("message", message);
      res.json({ auth: true, message: message });
    }
  });
});



app.get('/getcountforadmin', async (req, res) => {
  // count no of salon orders and other type of orders
  let q = req.query.type;
  let count;

  count = await Orders.countDocuments({ itype: q });

  res.json({ count: count });

})



app.post("/uploadimg", upload.single("file") ,verifyJWT, async (req, res) => {
  console.log("Upload image", req.body);
  console.log("Upload file", req.file);
  let url;


  cloudinary.uploader.upload(req.file.path, { public_id: req.file.filename }).then((data) => {
    console.log(data);
    url = data.secure_url;
    console.log("URL", data.secure_url);

  }).catch((err) => {
    console.log(err);
  }).then((respone) => {
    res.json({ auth: true, secure_url: url });
  });


  // Generate 
  // let url = cloudinary.url(req.file.filename, {
  //   width: 100,
  //   height: 150,
  //   Crop: 'fill'
  // });


});



app.get('/getuserbyid/:id',verifyJWT, (req, res) => {
  let id = req.params.id;
  console.log("id", id);
  Users.findById(id, (err, user) => {
    if (err) {
      res.json({ auth: false, user: null });
    } else {
      res.json({ auth: true, user: user });
    }
  });
});



const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
      console.log("App listening on port 3001");
});

module.exports = server;
