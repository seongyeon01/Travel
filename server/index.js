const express = require('express')
const app = express()
const port = 5000
//const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const config = require("./config/key")
const { User } = require("./models/User")
const { auth } = require("./middleware/auth")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

const mongoose=require('mongoose')
const { mongoURI } = require('./config/dev')
mongoose.connect(mongoURI
  ,{ useNewUrlParser: true }) 
  .then(() => console.log( "MongoDB Connected success !!" ))
  .catch(err => console.log( err )) 
  
app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 하하호호')
})

app.get('/api/hello',(req,res)=>{
  res.send("안녕하세요~~")
})

app.post('/register', (req,res) => {
  const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
})
app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
      if (!user)
          return res.json({
              loginSuccess: false,
              message: "제공된 이메일에 해당하는 유저가 없습니다."
          });

      user.comparePassword(req.body.password, (err, isMatch) => {
          if (!isMatch)
              return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다" })

          user.generateToken((err, user) => {
              if (err) return res.status(400).send(err);
              //res.cookie("w_authExp", user.tokenExp);
              res.cookie("x_auth", user.token)
              .status(200)
              .json({loginSuccess: true, userId: user._id})
          });
      });
  });
});

app.get("/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과했다는 이야기는 Authentication이 True라는 말
  res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image,
  });
});

app.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: ""}, (err, doc) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).send({
          success: true
      });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on ${port}!`)
})