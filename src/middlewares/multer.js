import multer from "multer";
// multer ka use krke file ko hum user se leke apne loacl storage pe save krenge
// and then from their we will export it to the cloudinary
// multer can be applied at many places like during the registration process to take fiels from user etc


const storage = multer.diskStorage({
  destination: function (req, file, cb) { //cb stands for callback
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    // the upper way is to store the fielname uniqely because 
    // if there are mulitple files with same name then the file may be overriden
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage })
