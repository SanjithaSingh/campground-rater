const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const https = require('https')

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const getImage = () => {
  const images = ["img_23_q7hweu",
  "img_17_vox1u5",
  "img_21_wz5nfk",
  "img_22_bbviyb",
  "img_19_qolmk1",
  "img_18_lhuvee",
  "img_20_esa7uq",
  "img_11_tr3ml6",
  "img_4_fmvuq1",
  "img_13_dyusve",
  "img_16_csgdki",
  "img_14_oe7ibn",
  "img_10_rvulaq",
  "img_15_gpydeh",
  "img_5_temdlz",
  "img_12_p6x076",
  "img_8_aa47fw",
  "img_2_yoc6kc",
  "img_9_fzabd1",
  "img_6_skubgl",
  "img_7_x5ouxs",
  "img_3_lj5vcr",
  "img_1_kmjaop"]
  const random = Math.floor(Math.random() * images.length);
  const url = ` https://res.cloudinary.com/samkiran/image/upload/v1641227861/${images[random]}.jpg`;
  console.log(url);
  return url;
}

const seedDB = async () => {
    for (let i = 0; i < 6; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '61d3d020c9c4d100165be752',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: getImage(),
                    filename: 'rate_campground'
                },
                {
                    url: getImage(),
                    filename: 'rate_campground'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})