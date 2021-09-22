const express = require('express')
const app = express()
const port = 5000
const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://yeon:dkssudgg0119@cluster0.ncwyw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  ,{ useNewUrlParser: true }) 
  .then(() => console.log( "MongoDB Connected success !!" ))
  .catch(err => console.log( err ))
app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요')
})

app.listen(port, () => {
  console.log(`Example app listening on ${port}!`)
})