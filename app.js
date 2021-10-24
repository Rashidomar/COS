const express = require('express');
const Menu = require('./model/menu');
const Food = require('./model/food');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express()
const port = 3000

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then((result)=>{

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

}).catch((err)=>{

  console.log("Cant connect to database")
})

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

app.get('/admin/register', (req, res)=>{

    res.render('admin/register')
})

app.get('/admin/dashboard', (req, res) => {
  Menu.find().then(result=>{
    res.render('admin/dashboard', {
      data: result
    })
    .catch(err => {
      console.log(err);
    });
  });

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

