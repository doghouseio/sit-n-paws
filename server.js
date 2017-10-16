const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./db/models/users');
const Listing = require('./db/models/listing');
const Booking = require('./db/models/booking');
const jwt = require('jsonwebtoken');
const seedListingDB = require('./seed');
const cloudinary = require('cloudinary');
const cloudConfig = require('./cloudinary/config.js');
const multer = require('multer');
const nodemailer = require('nodemailer');
const upload = multer({dest: './uploads/'});
const axios = require('axios');
const geoKey = process.env.GEOCODE_API || require('./geocode.js');
let port = process.env.PORT || 3000

// This is the shape of the object from the config file which is gitignored
// const cloudConfig = {
//   cloud_name: 'top-hat',
//   api_key: 'API_KEY',
//   api_secret: 'API_SECRET'
// };

cloudinary.config(cloudConfig);
const app = express();
app.use(express.static((__dirname + '/src/public')));
app.use(bodyParser.json({limit: '50mb'}));

seedListingDB();

//handles log in information in the db, creates jwt
app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username})
     .exec((err, found) => {
      if (err) {
        throw err;
        console.log('error');
      } else {
        if (found) {
          found.comparePassword(password).then(match => {
            if (match) {
              let payload = {
                username: found.username,
                name: found.name,
                email: found.email
              };
              let token = jwt.sign(payload, 'Shaken, not stirred', {
                expiresIn: '1h'
              });
              res.json({
                success: true,
                username: found.username,
                token: token
              });
            }
          })
        } else {
          res.send(JSON.stringify({
            success: false,
            error: 'Invalid Username/Password'
          }));
        }
      }
    })
});

//handles new user creations in db
app.post('/signup', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  User.findOne({ email: email })
    .exec((err, found) => {
      if (err) {
        throw err;
        console.log('error');
      }
      if (found) {
        res.send(JSON.stringify({
          success: false,
          error: 'User already exists!',
        }));
      } else {
        User.create({
          username: username,
          password: password,
          email: email,
          name: '',
          phone: '',
          address: ''
        })
        .then((newUser) => {
          let payload = {
            username: newUser.username,
            name: newUser.name,
            email: newUser.email
          };
          let token = jwt.sign(payload, 'Shaken, not stirred', {
            expiresIn: '1h'
          });
          res.json({
            success: true,
            username: newUser.username,
            token: token
          });
        })
        .catch((err) => {
          console.log(err);
        })
      }
    })
})

//handles updating profiles in db
app.post('/profile', (req, res) => {
  var email = req.body.email;

  var updateProfile = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address
  };
  var updateListing = {
    name: req.body.name,
  }
  User.findOneAndUpdate({email: email}, updateProfile, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Profile update success!');
    }
  })
  Listing.findOneAndUpdate({email: email}, updateListing, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Listing update success!')
    }
  })
});


let dogUpload = upload.fields([{
  name: 'dogsPictures',
  maxCount: 1
}]);

app.post('/dog', dogUpload, (req, res, next) => {
  var email = req.body.email
  var dog = {
    name: req.body.name,
    dogSize: req.body.dogSize,
    dogBreed: req.body.dogBreed,
    dogActivityReq: req.body.dogActivityReq,
    bio: req.body.bio,
    dogPictures: "Picture is being uploaded...",
    age: req.body.age
  }
  User.findOneAndUpdate(
    {email:email},
    { $push: {
        dogs: dog
      }
    }
    , function(err, dogs) {
      if(err) {
        res.status(404).send(err);
        next();
      } else {
        res.status(200).send();
        next();
      }
  })
}, (req, res) => {
  // Sends files to the Cloudinary servers and updates entries in the database
  if (req.files.dogsPictures) {
    console.log('Send to cloudinary!', req.files.dogsPictures[0].path);
    cloudinary.v2.uploader.upload(req.files.dogsPictures[0].path, (err, result) => {
      if(err) {
        console.log('Cloudinary error: ', err);
      }
      console.log('Dog Picture url: ', result.url)
      User.findOneAndUpdate(
        {email:req.body.email},
        { $push: {
            dogsPictures: result.url
          }
        }
        , function(err, dogs) {
          if(err) {
            res.status(404).send(err);
          } else {
            res.status(200).send();
          }
      })
    });
  }
});

//returns User's dogs
app.get('/dog', (req, res) => {
  var email = req.query.email;
  if (!email) {
    res.status(404).send('No email provided');
  }
  User.find({email: email}).select('dogs')
  .exec((err, dogs) => {
    if (err) {
      console.log(err);
    } else {
      if (dogs.length) {
        res.status(200).send(dogs[0].dogs);
      } else res.status(200).send()

      }
  })
})

//returns User's dog pictures
app.get('/dogpics', (req, res) => {
  var email = req.query.email;
  if (!email) {
    res.status(404).send('No email provided');
  }
  User.find({email: email})//.select('dogsPictures')
  .exec((err, pics) => {
    if (err) {
      console.log(err);
    } else {
      if (pics.length) {
        res.status(200).send(pics[0].dogsPictures);
      } else res.status(200).send()
      }
  })
})

//Gets user data
app.get('/user', (req, res) => {
  var email = req.query.email;
  if (!email) {
    res.status(404).send('No email provided');
  }
  User.find({email: email})
  .exec((err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user.length) {
        res.status(200).send(user);
      } else res.status(404).send()

      }
  })
})

//Check post listing for uploaded files and stores in req.files
let listingsUpload = upload.fields([{
  name: 'hostPictures',
  maxCount: 1
}, {
  name: 'homePictures',
  maxCount: 1
}]);


//handles posts for listings in db
app.post('/listings', listingsUpload, (req, res, next) => {
  //construct address out of request body
  var street = req.body.street.split(' ').join('+');
  var city = req.body.city.split(' ').join('+');
  var state = req.body.state;
  var mapUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${street},${city},${state}&key=${geoKey}`
  var location = [];
  axios.get(mapUrl)
  .then(function(response) {
    location = [response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng]
  })
  .catch(function(error) {
    console.log(error);
  })
  .then(() => Listing.findOne({name: req.body.name}))
  .then((found) => {
    if (found) {
      // update Listing
      Listing.update(Object.assign({}, req.body, {position: location}));
      res.json({success: true, message: 'Thank you, your listing has been successfully updated!', listing: found});
      next();
    } else {
      // Create new Listing and save in database
      var newListing = new Listing({
        name: req.body.name,
        email: req.body.email,
        zipcode: req.body.zipcode,
        dogSizePreference: req.body.dogSizePreference,
        dogBreedPreference: req.body.dogBreedPreference,
        // dogTemperamentPreference: req.body.dogTemperamentPreference,
        dogActivityPreference: req.body.dogActivityPreference,
        homeAttributes: req.body.homeAttributes,
        yard: req.body.yard,
        children: req.body.children,
        pets: req.body.pets,
        hostPictures: 'Image is being uploaded...',
        homePictures: 'Image is being uploaded...',
        cost: req.body.cost,
        position: location
      });
      newListing.save((err, host) => {
        if (err) {
          res.json({success: false, message: err});
        } else {
          res.json({success: true, message: 'Thank you, your listing has been successfully saved!', listing: host});
        }
        next();
      });
    }
  }).catch((err) => {
    res.json({success: false, message: err});
    next();
  });
}, (req, res) => {
  // Sends files to the Cloudinary servers and updates entries in the database
  if (req.files.hostPictures) {
    console.log('Send to cloudinary!', req.files.hostPictures[0].path);
    cloudinary.v2.uploader.upload(req.files.hostPictures[0].path, (err, result) => {
      if(err) {
        console.log('Cloudinary error: ', err);
      }
      // console.log('Host Picture url: ', result.url) you may wish to use this if you alter file uploading
      Listing.findOneAndUpdate({name: req.body.name}, {hostPictures: result.url}, (err, found) => {
        if (err) {
          console.log(err);
        }
        // console.log('Updated Host Pictures: ', found); you may wish to use this if you alter file uploading
      });
    });
  }
  if (req.files.homePictures) {
    console.log('Send to cloudinary!', req.files.homePictures[0].path);
    cloudinary.v2.uploader.upload(req.files.homePictures[0].path, (err, result) => {
      if (err) {
        console.log('Cloudinary error: ', err);
      }
      // console.log('Home Picture url: ', result.url); you may wish to use this if you alter file uploading
      Listing.findOneAndUpdate({name: req.body.name}, {homePictures: result.url}, (err, found) => {
        if (err) {
          console.log(err);
        }
        // console.log('Updated Home Pictures: ', found) you may wish to use this if you alter file uploading
      });
    });
  }
});

//handles getting all listings that exist
app.get('/listings', (req, res) => {
  Listing.find({})
    .exec((err, listings) => {
      if (err) {
        console.log('error');
      } else {
        res.send(listings);
      }
    })
})

//handles getting listings by zipcode from search
app.get('/listings/:zipcode', (req, res) => {
  var zipcode = req.params.zipcode;
  Listing.find({ "$where": `function() { return this.zipcode.toString().match(/${zipcode}/) !== null; }`})
    .exec((err, listings) => {
      if (err) {
        console.log(err);
      } else {
        res.send(listings);
        }
      })
})


//Get all bookings that the user is hosting
app.get('/bookings/host', (req, res) => {
  let email = req.query.email
  Booking.find({hostEmail: email})
    .exec((err, hostings) => {
      if (err) {
        console.log('error');
      } else {
        res.send(hostings);
      }
    })
})

// Get all bookings that the user is patronizing
app.get('/bookings/guest', (req, res) => {
  let email = req.query.email
  Booking.find({guestEmail: email})
    .exec((err, booking) => {
      if (err) {
        console.log('error');
      } else {
        res.send(booking);
      }
    })
})

// Update a booking
app.post('/bookings', (req, res) => {
  let confirmed = {confirmed:req.body.confirmed}
  Booking.findOneAndUpdate({_id: req.body.id}, confirmed, function(err, booking) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send()
    }
  })
})



//handles requests for contacting host, sends email to host
app.post('/contacthost', (req, res) => {
  var ownerEmail = req.body.ownerEmail;
  var hostEmail = req.body.hostEmail;
  var date = req.body.date;

  var newBooking = new Booking({
    guestEmail: ownerEmail,
    hostEmail: hostEmail,
    date: date,
    confirmed: false
  });


  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sitnpawstophat@gmail.com', // Your email id
      pass: 'SitNPawsHR1' // Your password
    }
  });
  var mailOptions = {
    to: hostEmail,
    subject: 'Hi from Sit-n-Paws! A friend wants to stay at your house on ' + date,
    text: 'Email the pet owner @ ' + ownerEmail + ' Please respond within 24 hours!'
  };
  transporter.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.json({hi: 'error here'})
    } else {
      // console.log('Email sent: ' + response.response);
      res.json({hi: response.response});

      newBooking.save((err, booking) => {
        if (err) {
          console.log('errr',err)
        } else {
          console.log('success', booking)
        }
      });
    }
  });

})

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/src/public/index.html');
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on server:3000');
});

module.exports = app;
