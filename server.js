const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const signUpRoute = require('./routes/signup.route');
const loginRoute = require('./routes/login.route'); 
const profileRoute = require('./routes/profile.route');
const recordRoute = require('./routes/record.route');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const withAuth = require('./config/withAuth');

//Mongodb connection
mongoose.connect(config.mongoURI, {useNewUrlParser: true})
.then(db => {
    console.log(`DB connected!!`);
})
.catch(err => {
    console.log(err.message);
});

//cors middleware
app.use(cors());

//cookie middleware
app.use(cookieParser());

//body-parser middlewares
app.use(bodyParser.urlencoded({
      extended: false
    })
);
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
//passport config
require('./config/passport')(passport);

//jwt token-cookie verification midlleware 
app.get('/checkToken', withAuth, (req, res) => {
    res.sendStatus(200);
});

//api middlewares
app.use('/signup', signUpRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);
app.use('/record', recordRoute);
app.use('/', express.static('public'))

//Listening on port
app.listen(config.port, () => {
    console.log(`Listening on the port- ${config.port}`);
});