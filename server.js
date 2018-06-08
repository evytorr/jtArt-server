//Step 1. require/import dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
//gallerySchema is the name of the collection//
var gallerySchema = new Schema(

  {
    src: { type: 'string', required: true },
    thumb: { type: 'string', required: true},
    type: { type: 'string', required: true },
  },

)

var Gallery = mongoose.model('GalleryItem', gallerySchema);

//This connects to our MLAB database.  Grab the link from your account and paste after mongoose.connect, dont forget to enter your password and username.//
mongoose.connect('mongodb://admin:google13@ds247170.mlab.com:47170/jtart');

//Grab this code from the get started guide on mongoose js website.//
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('successfully connected to database');
});

// This is for the upload stuff
var multer = require('multer');
var upload = multer();
require('isomorphic-fetch');

var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({
  accessToken: '0r2s0ja-j9YAAAAAAAADICUwRDeFx7NPYMe1nyJMGs4meAQbiU24e_ehv2py7oxx'
});

//Step 2. create new instance (library) of express object
var app = new express();

//Step 3. Declare your middleware
app.use(bodyParser.json());
//This means we only want to use json. Json is a function, so we need empty paren.  Middleware goes inside the paren after "use" because that's what we're using. 
app.use(bodyParser.urlencoded({ extended: true }));
//This handles data that is nested in other functions, so it is an absolute must.
app.use(cors({ origin: true, credentials: true }));

//Step 4. Create simple API
//This is on a basic level what an API route looks like.  The '/' is the url.  
app.get('/getGallery', function (request, response) {
  Gallery.find(function (err, galleryItems){
    if(err) throw err;

    response.status(200).send(galleryItems);
  })


});

app.get('/getStore', function (request, response) {
  var storeArray = [
    {
      url: '../assets/cultural/atole.jpg',
      type: 'cultural',
      title: 'Atolito y Conchita',
      dimensions: '8.5 x 11"',
      price: '$10.00',
    },
    {
      url: '../assets/cultural/concha.jpg',
      type: 'cultural',
      title: 'Que Concha!',
      dimensions: '5 x 6"',
      price: '$7.00',
    },
    {
      url: '../assets/cultural/maizprieto.jpg',
      type: 'cultural',
      title: 'Que Chulada de Maiz Prieto',
      dimensions: '5 x 6"',
      price: '$7.00',
    },
    {
      url: '../assets/cultural/ojo.jpg',
      type: 'cultural',
      title: 'Hechandole el Ojo al Pan Dulce (Eyeing the Sweet Bread)',
      dimensions: '8.5 x 5.5"',
      price: '$10.00',
    },
    {
      url: '../assets/cultural/concha2.jpg',
      type: 'cultural',
      title: 'Tomando Chocolatito con Conchita (Drinking Chocolate and Eating a Shell)',
      dimensions: '8.5 x 5.5"',
      price: '$10.00',
    },
    {
      url: '../assets/cultural/corazon.jpg',
      type: 'cultural',
      title: 'Cactus Heart',
      dimensions: '8.5 x 5.5"',
      price: '$10.00',
    },
    {
      url: '../assets/cultural/evy.jpg',
      type: 'cultural',
      title: 'Con el Nopal en la Frente',
      dimensions: '8.5 x 5.5"',
      price: '$10.00',
    },
    {
      url: '../assets/cultural/muneca.jpg',
      type: 'cultural',
      title: 'Muñeca María (Mexicana Barbie)',
      dimensions: '8.5 x 5.5"',
      price: '$10.00',
    },
    {
      url: '../assets/cultural/nopales.jpg',
      type: 'cultural',
      title: 'Nopales! (Sigue Sigue)',
      dimensions: '5 x 6"',
      price: '$7.00',
    },
    {
      url: '../assets/inktober/goblin.jpg',
      type: 'inktober',
      title: 'Goblin (Original)',
      dimensions: '',
      price: '$35.00',
    },
    {
      url: '../assets/inktober/raven.jpg',
      type: 'inktober',
      title: 'The Raven on Bust of Athena (Original)',
      dimensions: '8.5 x 10"',
      price: '$40.00',
    },
    {
      url: '../assets/inktober/tree.jpg',
      type: 'inktober',
      title: 'Creepy Tree',
      dimensions: '8.5 x 10"',
      price: '$10.00',
    },
    {
      url: '../assets/misc/cactus.jpg',
      type: 'miscellaneous',
      title: 'Flor de Cactus',
      dimensions: '8.5 x 10"',
      price: '$10.00',
    },
    {
      url: '../assets/misc/flower.jpg',
      type: 'miscellaneous',
      title: 'Cempasuchil (Flor de Muerto)',
      dimensions: '8.5 x 10"',
      price: '$10.00',
    },
    {
      url: '../assets/misc/maiz.jpg',
      type: 'miscellaneous',
      title: 'Visión de Centeotl',
      dimensions: '8.5 x 5.5"',
      price: '$40.00',
    },
  ];

  response.status(200).send(storeArray);
});  


//After making changes in your server.js file, kill your command prompt by typing Ctrl+C, and then type node and the name of your file. So, "node server.js"

app.post('/sendEmail', function (request, response) {
  // console.log(request.body);
  //if you send name, email, whatever, it'll always be .body
  //it ends in .name bc that's the info you're requesting.  type this into Postman

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'arieletorres@gmail.com', // generated ethereal user
        pass: 'onpqrosttathmisg' // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: 'arieletorres@gmail.com', // sender address
      to: 'arieletorres@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      template: 'index',
      context: {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        comments: request.body.comments,
      }
    };

    let handlebarsOptions = {
      viewEngine: 'handlebars',
      viewPath: path.resolve('./templates'),
      extName: '.html',
    }

    transporter.use('compile', hbs(handlebarsOptions));

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      response.status(200).send({
        data: 'ok'
      });
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });


});

app.post('/uploadImage', upload.single('file'), function (req, res) {
  // This is where Angel left off//
  const imageName = req.file.originalname;
  const imageMeat = req.file.buffer;

  dbx.filesUpload(
    {
      path: '/pictures/' + imageName,
      contents: imageMeat,
      mode: 'overwrite'
    }
  ).then(function (response) {
    dbx.sharingCreateSharedLink({
      path: '/pictures/' + imageName,
    })
      .then(function (response) {
        res.status(200).send({
          data: response
        })
      })
      .catch(function (error) {
        res.status(500).send({
          data: error
        });
      })
  })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({
        data: err
      });
    })

});

app.get('/', function(req, res){
  var newItem = new Gallery({
    src: 'assets/me/to',
    thumb: 'assets/me/to',
    type: 'misc'
  });

  newItem.save( (err) => {
    res.status(200).send({
      data: 'my app is running'
    })
  })
});



var port = process.env.PORT || 8008;
app.listen(port, function () {
  console.log('my server is listening on port', port);
});