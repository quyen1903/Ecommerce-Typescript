import multer from "multer";

const uploadMemory = multer({ 
  storage: multer.memoryStorage() 
});


const uploadDisk = multer({ dest: './src/uploads' })


// const uploadDisk = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './src/uploads')
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })
  
export {
  uploadMemory,
  uploadDisk
}