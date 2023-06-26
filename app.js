const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');


const pageRoute = require('./routes/pageRoute');
const userRoute = require('./routes/userRoute');

const app = express();

mongoose.connect('mongodb+srv://nurettin:lpE9qB4QoC62QrVS@cluster0.pzt3kqv.mongodb.net/?authSource=Cluster0&authMechanism=DEFAULT', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
console.log("DB Connected Succesfully")
});

//Global Variable
global.userIN = null;//Başlangıç değeri olarak null dedim yani 0 olarak tanımladım (İf koşulunda false olarak gözükür)

//Middlewares
app.use(express.static('public'));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'my_keyboard_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://nurettin:lpE9qB4QoC62QrVS@cluster0.pzt3kqv.mongodb.net/?authSource=Cluster0&authMechanism=DEFAULT' })//connect-mongo paketinin middleware'ı bu satır
  //Bu Middleware yazıldığında otomatik olarak session adında koleksiyon oluşturulur( ne işe yaradığını en alta yazdım)

}));


//ROUTES
app.use('*', (req, res, next) => {//Yıldız koymamızınn nedeni hangi istek gelirse gelsin bozulmaması için * kullandık
  userIN = req.session.userID;
  next();//next yazmamızın nedeni diğer middlleware'a gitmesi için
});
app.use('/',pageRoute);
app.use('/users',userRoute);



const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi...`);
});