// seed.js is for seeding the database with mock data to work with in the interface
// this function is invoked near the top of the server.js file and can be easily commented out to stop seeding

// import mongoose, config, and listing schema
const mongoose = require('mongoose');
const Listing = require('./db/models/listing');
const User = require('./db/models/users');

// seed data for listings to populate host listings
const listingsData = [
{"name":"Chris Pfaff","zipcode":94105,"dogSizePreference":"medium","dogBreedPreference":"Corgi","email":"chrispfaff10@gmail.com","dogActivityPreference":"rutrum","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/women/44.jpg","homePictures":"https://farm7.staticflickr.com/6076/6080657644_19cfe82456.jpg","cost":35,"yard":"huge","children":"none","pets":"cat","position":[37.78, -122.39]},
{"name":"Niels Larson","zipcode":94110,"dogSizePreference":"super extra large","dogBreedPreference":"Chihuahua","email":"nlarson94@gmail.com","dogActivityPreference":"dapibus","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/women/45.jpg","homePictures":"https://farm1.staticflickr.com/68/187943195_05de9fe99b.jpg","cost":55,"yard":"huge","children":"none","pets":"cat","position":[37.74, -122.41]},
{"name":"Thomasina Luscombe","zipcode":94123,"dogSizePreference":"small","dogBreedPreference":"Dachshund","email":"hi1@gmail.com","dogActivityPreference":"lacus","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/women/46.jpg","homePictures":"https://farm6.staticflickr.com/5510/14490433662_2745930345.jpg","cost":30,"yard":"huge","children":"none","pets":"cat","position":[37.8, -122.449]},
{"name":"Shelley Phlpot","zipcode":94105,"dogSizePreference":"teeny weeny","dogBreedPreference":"German Shepherd","email":"hi2@gmail.com","dogActivityPreference":"amet","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/women/47.jpg","homePictures":"https://farm4.staticflickr.com/3062/3046570389_f960000e36.jpg","cost":65,"yard":"huge","children":"none","pets":"cat","position":[37.78, -122.39]},
{"name":"Isidora Hemms","zipcode":94110,"dogSizePreference":"large","dogBreedPreference":"Pitbull","email":"hi3@gmail.com","dogActivityPreference":"ipsum","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/women/48.jpg","homePictures":"https://farm1.staticflickr.com/229/516113751_e2222a5a64.jpg","cost":30,"yard":"huge","children":"none","pets":"cat","position":[37.73, -122.43]},
{"name":"Say Swinglehurst","zipcode":94123,"dogSizePreference":"small","dogBreedPreference":"ROSIE","email":"hi4@gmail.com","dogActivityPreference":"fusce","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/men/55.jpg","homePictures":"https://farm1.staticflickr.com/48/111317752_7934d93e8a.jpg","cost":57,"yard":"huge","children":"none","pets":"cat","position":[37.804, -122.435]},
{"name":"Angus Bafford","zipcode":94105,"dogSizePreference":"medium","dogBreedPreference":"CHUNKY","email":"hi5@gmail.com","dogActivityPreference":"lorem","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/men/56.jpg","homePictures":"https://scontent.fsjc1-3.fna.fbcdn.net/v/t31.0-8/14500780_151623151960598_8947738040944491792_o.jpg?oh=c2362b13fe7e7e25c1b1c0cfc5319147&oe=5A7FDE71","cost":60,"yard":"huge","children":"none","pets":"cat","position":[37.78, -122.39]},
{"name":"Breanne Carnoghan","zipcode":94110,"dogSizePreference":"medium","dogBreedPreference":"Bloodhound","email":"hi@gmail.com","dogActivityPreference":"erat","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/men/57.jpg","homePictures":"https://farm4.staticflickr.com/3586/3468872496_d62d4580b9.jpg","cost":32,"yard":"huge","children":"none","pets":"cat","position":[37.73, -122.43]},
{"name":"Fabio Handaside","zipcode":94123,"dogSizePreference":"small","dogBreedPreference":"Mix","email":"hi6@gmail.com","dogActivityPreference":"proin","homeAttributes":"Great home with lots of space", "hostPictures":"https://randomuser.me/api/portraits/men/58.jpg","homePictures":"https://farm4.staticflickr.com/3193/2683030380_8ac4712010.jpg","cost":25,"yard":"huge","children":"none","pets":"cat","position":[37.796, -122.435]},
{"name":"Lily Feake","zipcode":94105,"dogSizePreference":"medium","dogBreedPreference":"All","email":"hi7@gmail.com","dogActivityPreference":"vel","homeAttributes":"Great home with lots of space","hostPictures":"https://randomuser.me/api/portraits/men/59.jpg","homePictures":"https://farm4.staticflickr.com/3163/2780745441_a39b974e55.jpg","cost":55,"yard":"huge","children":"none","pets":"cat","position":[37.78, -122.39]}
];

// seed data for user to provide instant login capability
const mockCompleteUser = [
  {
    username: 'mary444',
    password: '1234',
    email: 'hi1@gmail.com',
    name: 'Mary Tester',
    phone: '561-123-5155',
    address: '14 Main Street',
    dogsPictures: ['https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/Natural-Dog-Law-2-To-dogs%2C-energy-is-everything.jpg'],
    dogs:  [{
        name: 'Borko',
        dogSize: 'Large',
        dogBreed: 'Mutt',
        dogActivityReq: 40,
        bio: 'Very energetic and well behaved',
        age: 2,
      }]
  },
  {
    username: 'chrispfaff10',
    password: '1234',
    email: 'chrispfaff10@gmail.com',
    name: 'Chris Tester',
    phone: '561-123-5155',
    address: '13 Main Street',
    dogsPictures: ['https://i.pinimg.com/736x/63/0f/0e/630f0ef3f6f3126ca11f19f4a9b85243--dachshund-puppies-weenie-dogs.jpg'],
    dogs:  [{
        name: 'Duke',
        dogSize: 'Smol',
        dogBreed: 'Weiner dog',
        dogActivityReq: '5',
        bio: 'Small pup, needs to be potty trained',
        age: 1,
      }]
  },
  {
    username: 'YoungNeil',
    password: '1234',
    email: 'nlarson94@gmail.com',
    name: 'Neil Tester',
    phone: '561-123-5155',
    address: '23 Main Street',
    dogsPictures:['https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/How%20to%20calm%20a%20hyper%20dog.jpg','https://d2wq73xazpk036.cloudfront.net/media/27FB7F0C-9885-42A6-9E0C19C35242B5AC/2F80877A-747B-4CEA-B1AE3DA490BA85C5/thul-42f6252d-3299-512f-990d-351d481f122b.jpg'] ,
    dogs: [{
        name: 'Tucker',
        dogSize: 'Large',
        dogBreed: 'Australian shep',
        dogActivityReq: '50',
        bio: 'Very fun well-behaved, loves to play :)',
        age: 5,
      },
      {
        name: 'Dale',
        dogSize: 'Medium',
        dogBreed: 'Grey Hound',
        dogActivityReq: '55',
        bio: 'Very fast, good with kids. Do not let her run away D:',
        age: 1,
      }]
  }

];

// function to clean listings from database and seed with above listings and user
const seedListingDB = () => {
  // remove listings from database to start - NOTE THIS REMOVES ALL LISTINGS, SO BE CAREFUL IN PRODUCTION
  Listing.remove({}, (err) => {
    if(err) {
      console.log(err);
    } else {
      // remove mary444 user prior to adding
      User.remove({'username': 'mary444'}, (err) => {
        if(err) {
          console.log(err);
        }
        mockCompleteUser.forEach((user) => {
          let reformatUser = JSON.stringify(user);
          let newUser = new User(JSON.parse(reformatUser));
          // add user mary444 to database
          newUser.save((err) => {
            if(err) {
              console.log(err);
            }
          })
        });
        // iterate over mock listings, format, and save each listing into the database
        listingsData.forEach((listing) => {
          // reformat data to strings for parsing before saving
          let reformatListing = JSON.stringify(listing);
          let newListing = new Listing(JSON.parse(reformatListing));
          newListing.save((err) => {
            if(err) {
              console.log(err);
            }
          })
        })
      })
      console.log('DATABASE SEEDED');
    }
  })
}

module.exports = seedListingDB;
