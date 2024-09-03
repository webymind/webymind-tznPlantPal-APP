"use client";

import React, { useState, useRef } from "react";
import PlantInfo from "./PlantInfo";
import { identifyPlant } from "../lib/gemini";
import { Upload, Camera, Loader } from "lucide-react";

const PlantIdentifier = () => {
  const [image, setImage] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const info = await identifyPlant(image);
      setPlantInfo(info);
    } catch (error) {
      console.error("Error identifying plant:", error);
      setError(error.message || "Error identifying plant. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-[#82be34] mb-6">
        Plant Identifier
      </h2>
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center px-4 py-2 bg-[#82be34] text-white rounded-md hover:bg-[#6ea12b] transition duration-300"
          >
            <Upload className="mr-2" size={20} />
            Upload Image
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
            <Camera className="mr-2" size={20} />
            Take Photo
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        {image && (
          <div className="mt-4">
            <img
              src={image}
              alt="Captured plant"
              className="w-full h-64 object-cover rounded-md"
            />
          </div>
        )}
        <button
          onClick={handleIdentify}
          disabled={!image || loading}
          className="w-full flex justify-center items-center px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300"
        >
          {loading ? (
            <Loader className="animate-spin mr-2" size={20} />
          ) : (
            "Identify Plant"
          )}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {plantInfo && <PlantInfo info={plantInfo} />}
    </div>
  );
};

export default PlantIdentifier;
