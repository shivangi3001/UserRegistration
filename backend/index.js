import express from "express"
import cors from "cors"
import mongoose from "mongoose"

//configuration
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// creating database
mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected successfully")
})

// creating schema of user in mongo
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)


// defining routes
app.get("/login", (req, res) => {
    // res.send("My API login")
    const {email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user) {
            if(password === user.password) {
                res.send( {message: "Login Success", user})
            } else {
                res.send({message: "password did not match"})
            }
        }else{
            res.send({ message: "User not registered" })
        }
    })
})

app.post("/register", (req, res) => {
    // res.send("My API register")
    // console.log(req.body)
    const { name, email, password } = req.body
    User.findOne({email: email}, (err, user) => {
        if(user) {
            res.send( {message: "User already registered" })
        }else{
            const user = new User({
                name, 
                email, 
                password 
            })
            user.save( err => {
                if (err) {
                    res.send(err)
                 } else {
                    res.send( {message: "Success Registration"})
                 }
            })
        }
    })
})

// app.post("/login", (req, res)=> {
//     const { email, password} = req.body
//     User.findOne({ email: email}, (err, user) => {
//         if(user){
//             if(password === user.password ) {
//                 res.send({message: "Login Successfull", user: user})
//             } else {
//                 res.send({ message: "Password didn't match"})
//             }
//         } else {
//             res.send({message: "User not registered"})
//         }
//     })
// })


// app.post("/register", (req, res)=> {
//     const { name, email, password} = req.body
//     User.findOne({email: email}, (err, user) => {
//         if(user){
//             res.send({message: "User already registerd"})
//         } else {
//             const user = new User({
//                 name,
//                 email,
//                 password
//             })
//             user.save(err => {
//                 if(err) {
//                     res.send(err)
//                 } else {
//                     res.send( { message: "Successfully Registered, Please login now." })
//                 }
//             })
//         }
//     })
    
// }) 

app.listen(9002,() => {
    console.log("BackEnd started at port 9002")
})