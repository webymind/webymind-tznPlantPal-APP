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
  const [facingMode, setFacingMode] = useState("environment");
  const [isMobile, setIsMobile] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    );

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      console.log("PWA install prompt detected");
      setShowInstallPrompt(true);
    });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (showCamera) {
      initializeCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  }, [showCamera, facingMode]);

  const initializeCamera = async () => {
    try {
      console.log("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isMobile ? { facingMode: facingMode } : true,
      });
      console.log("Camera permission granted");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      } else {
        console.error("Video element not available");
        setError("Video element not available. Please try again.");
      }
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
    setShowCamera(true);
    setError(null);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      setImage(canvas.toDataURL("image/jpeg"));
      setShowCamera(false);
    } else {
      console.error("Video element not available for capture");
      setError("Unable to capture image. Please try again.");
    }
  };

  const switchCamera = () => {
    if (isMobile) {
      setFacingMode((prevMode) =>
        prevMode === "user" ? "environment" : "user",
      );
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

  const handleInstallClick = async () => {
    console.log("Install button clicked");
    const promptEvent = window.deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      console.log(
        `User ${outcome === "accepted" ? "accepted" : "dismissed"} the install prompt`,
      );
      window.deferredPrompt = null;
      setShowInstallPrompt(false);
    } else {
      console.log("No deferred prompt available");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Plant Identifier
      </h2>
      {showInstallPrompt && (
        <button
          onClick={handleInstallClick}
          className="mb-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Install App
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
            autoPlay
            playsInline
          />
          <div className="flex justify-center space-x-4">
            <button
              onClick={captureImage}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            >
              <Camera className="mr-2" size={20} />
              Capture Image
            </button>
            {isMobile && (
              <button
                onClick={switchCamera}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                <RotateCcw className="mr-2" size={20} />
                Switch Camera
              </button>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {plantInfo && <PlantInfo info={plantInfo} />}
    </div>
  );
};

export default PlantIdentifier;
