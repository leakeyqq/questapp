"use client"

import { useState } from "react";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

export default function MyForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      console.log("Uploaded image URL:", url);
    } catch (err) {
      console.error("Upload failed", err);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Submit imageUrl with your other form data to backend
    console.log("Form submitted with image:", imageUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Your other form inputs... */}

      <div>
        <label className="block mb-1 font-medium">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        {/* {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 w-40 rounded shadow" />
        )} */}
        {imageUrl && (
        <div className="mt-2 space-y-2">
            <img src={imageUrl} alt="Preview" className="w-40 rounded shadow" />
            <p className="text-sm text-gray-600 break-all">
            <strong>Image URL:</strong>{" "}
            <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                {imageUrl}
            </a>
            </p>
        </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
