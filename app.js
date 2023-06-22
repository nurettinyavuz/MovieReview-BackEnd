const express = require('express');
const mongoose = require('mongoose');
const pageRoute = require('./routes/pageRoute');
const userRoute = require('./routes/userRoute');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/smartedu-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
console.log("DB Connected Succesfully")
});


app.get('/',pageRoute);
app.get('/users',userRoute);



const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi...`);
});