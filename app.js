const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');


const pageRoute = require('./routes/pageRoute');
const userRoute = require('./routes/userRoute');

const app = express();

require('dotenv').config(); // dotenv modülünü yüklüyoruz

// .env dosyasındaki MONGO_URL değerini alıyoruz
const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB Connected Successfully");
}).catch((error) => {
  console.log("DB Connection Error: ", error) ;
});

// Express uygulamanızın geri kalanını burada devam ettirin...


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
  store: MongoStore.create({ mongoUrl: mongoURL })//connect-mongo paketinin middleware'ı bu satır
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