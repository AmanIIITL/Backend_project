import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilepath) => {
    try{
        if(!localfilepath) return null;
        //upload the file on cloudinary
        const absolutePath = path.resolve(localfilepath);
        const response = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "auto"
        })
        // file has been uploaded succefully
        fs.unlinkSync(absolutePath);
        // console.log("file is uploaded on cloudinary", response.url);
        return response
    } catch (error){
        console.error("❌ Cloudinary upload failed:", error);
        fs.unlinkSync(localfilepath) // remove the locally saved temporarily file as the upload operation failed
        return null;
    }
}


export {uploadOnCloudinary}