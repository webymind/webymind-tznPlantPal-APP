"use client";

import React, { useState, useRef, useEffect } from "react";
import PlantInfo from "./PlantInfo";
import { identifyPlant } from "../lib/gemini";
import { Camera, Upload, Loader, RotateCcw } from "lucide-react";

const PlantIdentifier = () => {
  const [image, setImage] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraPermission, setCameraPermission] = useState("prompt");
  const [videoStream, setVideoStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    );
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" });
      setCameraPermission(result.state);
      result.onchange = () => setCameraPermission(result.state);
    } catch (error) {
      console.error("Error checking camera permission:", error);
      setCameraPermission("prompt");
    }
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission("granted");
      initializeCamera();
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      setCameraPermission("denied");
      setError(
        "Camera permission denied. Please enable camera access in your browser settings.",
      );
    }
  };

  const initializeCamera = async () => {
    try {
      console.log("Initializing camera...");
      const constraints = {
        video: isMobile
          ? { facingMode: facingMode }
          : { width: { ideal: 1280 }, height: { ideal: 720 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera stream obtained:", stream);
      setVideoStream(stream);
      setShowCamera(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        `Unable to access camera: ${err.message}. Please check your permissions and ensure no other app is using the camera.`,
      );
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (cameraPermission === "granted") {
      initializeCamera();
    } else {
      requestCameraPermission();
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      setImage(canvas.toDataURL("image/jpeg"));
      setShowCamera(false);
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }
    } else {
      console.error("Video element not found when capturing image");
      setError("Unable to capture image. Please try again.");
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    initializeCamera();
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
      {cameraPermission === "prompt" && (
        <button
          onClick={requestCameraPermission}
          className="mb-4 w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300"
        >
          Allow Camera Access
        </button>
      )}
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
              disabled={cameraPermission === "denied"}
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
          <div className="relative w-full h-64 bg-gray-200 rounded-md">
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
              autoPlay
              playsInline
            />
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={captureImage}
              className="flex-1 flex justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            >
              <Camera className="mr-2" size={20} />
              Capture Image
            </button>
            {isMobile && (
              <button
                onClick={switchCamera}
                className="flex-1 flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                <RotateCcw className="mr-2" size={20} />
                Switch Camera
              </button>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {isMobile && image && !showCamera && (
        <div className="mt-4 space-y-4">
          <img
            src={image}
            alt="Captured plant"
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setImage(null);
                handleCameraCapture();
              }}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
            >
              Retake Photo
            </button>
            <button
              onClick={handleIdentify}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            >
              Identify Plant
            </button>
          </div>
        </div>
      )}
      {plantInfo && <PlantInfo info={plantInfo} />}
    </div>
  );
};

export default PlantIdentifier;
