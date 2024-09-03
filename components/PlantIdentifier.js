"use client";

import React, { useState, useRef } from "react";
import PlantInfo from "./PlantInfo";
import { identifyPlant } from "../lib/gemini";
import { Camera, Upload, Loader } from "lucide-react";

const PlantIdentifier = () => {
  const [image, setImage] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Please check your permissions.");
      });
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    setImage(canvas.toDataURL("image/jpeg"));
    setShowCamera(false);
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Plant Identifier
      </h2>
      {!showCamera ? (
        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            >
              <Upload className="mr-2" size={20} />
              Upload Image
            </button>
            <button
              onClick={handleCameraCapture}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
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
            className="w-full flex justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? (
              <Loader className="animate-spin mr-2" size={20} />
            ) : (
              "Identify Plant"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover rounded-md"
          />
          <button
            onClick={captureImage}
            className="w-full flex justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            <Camera className="mr-2" size={20} />
            Capture Image
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {plantInfo && <PlantInfo info={plantInfo} />}
    </div>
  );
};

export default PlantIdentifier;
