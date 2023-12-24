const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const slugify = require('slugify');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const userRoute = require('./routes/userRoute');
const movieSeriesRoute =require('./routes/movieSeriesRoute');
const commentsRoute =require('./routes/commentsRoute');
const AdminUserRoute = require('./routes/AdminRoutes/AdminUserRoute');
const AdminMovieSeriesRoute =require('./routes/AdminRoutes/AdminMovieSeriesRoute');
const AdminCommentsRoute =require('./routes/AdminRoutes/AdminCommentsRoute');

const app = express();

require('dotenv').config();

// .env dosyasındaki MONGO_URL değerini alıyoruz
const mongoURL = process.env.MONGO_URL;

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected Successfully');

    //Middlewares
    app.use(cors());
    app.use(express.static('public'));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(
      session({
        secret: 'my_keyboard_cat',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: mongoURL }),
      })
    );
    app.use(cookieParser());

    //ROUTES
    app.use('*', (req, res, next) => {
      //Yıldız koymamızın nedeni hangi istek gelirse gelsin bozulmaması için * kullandık
      userIN = req.session.userID;
      next(); //next yazmamızın nedeni diğer middleware'a gitmesi için
    });
    app.use('/users', userRoute);
    app.use('/movieSeries', movieSeriesRoute);
    app.use('/comments', commentsRoute);
    app.use('/rating', commentsRoute);
    app.use('/AdminUser',AdminUserRoute);
    app.use('/AdminMovieseries',AdminMovieSeriesRoute);
    app.use('/AdminComments',AdminCommentsRoute);

    const port = 5000;
    app.listen(port, () => {
      console.log(`App startted on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('DB Connection Error: ', error);
  });

