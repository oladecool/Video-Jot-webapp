const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//Map global warining get rid of promise
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidJot-dev', {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//static folder
app.use(express.static(path.join(__dirname, 'public')));
//Method override middleware
app.use(methodOverride('_method'));

//Express middleware session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash middleware
app.use(flash());

//Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//How middleware works
app.use(function (req, res, next) {
    // console.log(Date.now());
    req.name = 'Brad Travis';
    next();
});

//Index route
app.get('/', (req, res) => {
    //console.log(req.name);
    const title = 'Welcome to VidJot';
    res.render('index', {
        title: title
    });
});

//About route
app.get('/about', (req, res) => {
    res.render('about');
});


const port = process.env.PORT || 5000;

//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
    console.log(`server stated on port ${port}`);
});