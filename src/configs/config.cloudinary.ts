import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({ 
    cloud_name: 'df5dx9qbk', 
    api_key: '268441966689278', 
    api_secret: process.env.CLOUDINARY_SECRET
});

export default cloudinary