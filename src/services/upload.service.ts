import cloudinary from "../configs/config.cloudinary";

const uploadImageFromURL = async ()=>{
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/c806032735234f850eff528f7a674327';
        const folderName = 'product/8409';
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

const uploadImageFromLocal = async({path, folderName}:
    {path: string, folderName?:string}
)=>{
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName
        })
        console.log(result)
        return {
            image_url: result.secure_url,
            shopId: 8409
        }
    } catch (error) {
        
    }
}
export {
    uploadImageFromURL,
    uploadImageFromLocal
}