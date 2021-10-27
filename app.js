const express = require('express');
const Menu = require('./model/menu');
const Food = require('./model/food');
const User = require('./model/user')
const bcrypt = require('bcrypt')
const {check, validationResult } = require('express-validator')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session')
const app = express()
const port = 3000

// Passport Config
require('./middleware/passport')(passport);

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then((result)=>{

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

}).catch((err)=>{

  console.log("Cant connect to database")
})

app.use(session({
  secret:'something',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
next();
})


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/admin/login', (req, res)=>{

    res.render('admin/login')
})

// Login Process
app.post('/admin/login', async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
});

app.get('/admin/register', (req, res)=>{

    res.render('admin/register')
})

// Register Proccess
app.post('/admin/register', [

  check('username', 'Name is required').notEmpty(),
  check('email', 'Email is required').notEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password is required').notEmpty(),
  check('password2').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),

], (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(req.body)
    res.render('admin/register', {
      errors : errors.array()
    });
  } else{
    // console.log(req.body)
    const salt = bcrypt.hash(req.body.password, 10).then((hash) => {
    console.log(hash)
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash
    })
    user.save()                    
    .then((value)=>{
      console.log(value)
      res.redirect('/admin/login');
      req.flash('success_msg','You have now registered!')
  })
  .catch(value=> console.log(value));
  })

 
  }
});

// logout
app.get('/admin/logout', async (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/admin/login');
});

app.get('/admin/dashboard', (req, res) => {
  Promise.all([Menu.find(), Food.find()]).then(([menuResult, foodResult])=>{
    res.render('admin/dashboard', {
      menus: menuResult,
      foods: foodResult
    });
  }).catch((err)=>{
    console.log(err)
  })
})

app.post('/admin/create_menu', (req, res)=>{

  const menu = new Menu(req.body);
  menu.save()
    .then(result => {
      res.redirect('/admin/dashboard');
    })
    .catch(err => {
      console.log(err);
    });

})

app.delete('/admin/delete_menu/:id', (req, res) => {
  let id = req.params.id;
  // console.log(id)
  Menu.deleteOne({ _id: id })
  .then(() => {
      res.json({ success: true });
  })
  .catch(err => {
      res.status.json({ err: err });
  });
});

app.post('/admin/create_food', (req, res)=>{

  const food = new Food(req.body);
  food.save()
    .then(result => {
      res.redirect('/admin/dashboard');
    })
    .catch(err => {
      console.log(err);
    });

})

app.delete('/admin/delete_food/:id', (req, res) => {
  let id = req.params.id;
  // console.log(id)
  Food.deleteOne({ _id: id })
  .then(() => {
      res.json({ success: true });
  })
  .catch(err => {
      res.status.json({ err: err });
  });
});

app.get('/order', function (req, res) {
  Menu.find().then(result=>{
  res.render('order', {
    data: result
  }).catch(err => {
    console.log(err);
  });
});
})

app.post('/get-foods-by-menu', function (req, res) {
  Food.find({menu_id:req.body.menu_id})
  .then(result => {
    res.json({
      msg: 'success',
      foods: result
    }) 
   })
  .catch(err => {
    console.log(err);
  })
})

app.post('/get-foods-by-prices', function (req, res) {
  Food.findById(req.body.id).select({prices:1, _id:0})
  .then(result => {
    res.json({
      msg: 'success',
      prices: result
    }) 
   })
  .catch(err => {
    console.log(err);
  })
});

