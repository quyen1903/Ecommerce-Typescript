import cloudinary from "../configs/config.cloudinary";

const uploadImageFromURL = async ()=>{
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/c806032735234f850eff528f7a674327';
        const folderName = 'product/shopId';
        const newFileName = 'testdemo';

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName
        })
        console.log(result)
        return result
    } catch (error) {
        console.error('upload image error ', error)
    }
}

uploadImageFromURL().catch()

export {uploadImageFromURL}