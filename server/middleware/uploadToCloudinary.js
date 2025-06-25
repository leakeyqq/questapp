import { todo } from "node:test";

export async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `${process.env.CLOUD_PRESET_NAME}`);
  
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    const data = await response.json();
    return data.secure_url; // Use this URL to display or store the image
  }

