// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');


// cloudinary.config({
//     cloud_name : process.env.CLOUD_NAME,
//     api_key : process.env.CLOUD_API_KEY,
//     api_secret : process.env.CLOUD_API_SECRET
// });


// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'wanderlust_DEV',
//     allowerdformats: ["png", "jpg", "jpeg"],
    
//   },
// });

// module.exports= {
//     storage,
//     cloudinary,
// };



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with .env values
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowed_formats: ['png', 'jpg', 'jpeg'],  // ✅ spelling fixed here
  },
});

module.exports = {
  storage,
  cloudinary,
};

