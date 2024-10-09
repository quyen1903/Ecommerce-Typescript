import multer from "multer";

export const uploadMemory = multer({ 
  storage: multer.memoryStorage() 
});

export const uploadDisk = multer({ dest: './src/uploads' })