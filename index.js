//import express
const express = require('express')

const dataService = require('./services/data.services')

const jwt = require('jsonwebtoken')
//Create app using express
const app = express()

//parse json
app.use(express.json())

//set port number
app.listen(3000, () => {
    console.log("Server started at 3000");
})


//resolving http rrquest

//get request - to fetch
app.get('/', (req, res) => {
    res.send("GET REQUEST!!")
})
//post request - to create
app.post('/', (req, res) => {
    res.send("POST REQUEST!!")
})
//put request - to create
app.put('/', (req, res) => {
    res.send("PUT REQUEST!!")
})
//delete request - to create
app.delete('/', (req, res) => {
    res.send("DELECT REQUEST!!")
})
//patch request - to create
app.patch('/', (req, res) => {
    res.send("PATCH REQUEST!!")
})

//middleware - application spedific
// app.use((req,res,next)=>{
//     console.log("Application specific middleware");
//     next()
// })

//middleware - application spedific - another way
const loginMiddleware = ((req, res, next) => {
    console.log("Application specific middleware");
    next()
})
app.use(loginMiddleware)
//jwtMiddleware - to valide token(Router specific Middleware)
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'supersecretkey123')
        req.currentAcc = data.currentAcc
        // console.log(req.currentAcc);
        next()
    } catch {
        res.json({
            statusCode: 401,
            status: false,
            message: "please login first"
        })
    }
}
//Register API
app.post('/register', (req, res) => {
    console.log(req.body.acno);
    dataService.register(req.body.acno, req.body.password, req.body.uname)
    .then(result=>{
        res.status(result.statusCode).json(result)  
    })
})

app.post('/login', (req, res) => {
    console.log(req.body.acno);
    dataService.login(req.body.acno, req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/deposite', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.deposite(req.body.acno, req.body.password, req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
app.post('/withDraw', jwtMiddleware, (req, res) => {
    console.log(req.body.acno);
    dataService.withDraw(req,req.body.acno, req.body.password, req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
app.post('/getTransaction', jwtMiddleware, (req, res) => {
    const result = dataService.getTransaction(req)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
//To set status code & set port number for server
app.get('/', (req, res) => {
    res.status(401).send("GET REQUEST!!")
})

