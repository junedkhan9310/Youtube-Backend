import { v2 as cloudinary} from "cloudinary";
import { response } from "express";
import fs from "fs" //file system in node.js by default

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async(locaalFilePath)=>{
    try {
        if (!locaalFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(locaalFilePath,{
            resource_type:"auto"
        })
        //now file has been uploaded now we'll console log a message
        // console.log(`file is uplaoded on cloudinary ${response.url}`);
        await fs.unlinkSync(locaalFilePath)
        return response;
        
    } catch (error) {
        fs.unlinkSync(locaalFilePath)//remove the locally saved temporary file as the upload operation got failed
        return null
    }
}
const deleteOnCloudinary = async (url) => {
    try {
      const urlParts = url.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
      // Delete the file using the public_id
      const response = await cloudinary.uploader.destroy(publicId);
      

      return response
    } 
    catch (error) {
        return null;
    }
  };

const VideodeleteOnCloudinary = async (url) => {
    try {
      const urlParts = url.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
      // Delete the file using the public_id
      const response = await cloudinary.uploader.destroy(publicId,{resource_type: "video"});

      return response
    } 
    catch (error) {
        return null;
    }
  };
  
export{uploadOnCloudinary, deleteOnCloudinary,VideodeleteOnCloudinary}