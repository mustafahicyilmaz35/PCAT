const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const Photo = require('./models/Photo');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override');

// Connect DB

mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  
});

// TEMPLATE ENGINES
app.set('view engine', 'ejs');


//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//ROUTE
app.get('/', async (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
});

app.get('/photos/:id', async (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  //res.render('about');
  //console.log(req.params.id);
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});

app.get('/about', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('about');
});

app.get('/add', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('add');
});

app.post('/photos', async (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  //console.log(req.files.image);
  // await Photo.create(req.body);
  // res.redirect('/');

  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
});


app.get('/photos/edit/:id', async (req, res) => {

  const photo = await Photo.findOne({_id: req.params.id});
  res.render('edit', {
    photo
  });
});

app.put('/photos/:id', async (req, res) => {

  const photo = await Photo.findOne({_id:req.params.id});
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);

});

app.delete('/photos/:id', async (req, res) => {
  //const photo = await Photo.findOne({_id:req.params.id});
  // console.log(req.params.id);
  const photo = await Photo.findOne({_id: req.params.id});
  let deletedPhoto = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedPhoto);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');

});

const port = 3000;

app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
