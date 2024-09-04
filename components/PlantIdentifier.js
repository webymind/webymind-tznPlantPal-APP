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
  const [facingMode, setFacingMode] = useState("environment"); // Default to rear camera
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);
    setFacingMode(mobile ? "environment" : "user"); // Set rear camera for mobile, front for desktop
    checkCameraPermission();
  }, []);

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
      setError("Camera permission denied. Please enable camera access in your browser settings.");
    }
  };

  const initializeCamera = async () => {
    try {
      const constraints = {
        video: isMobile 
          ? { facingMode: { exact: facingMode } }
          : true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Unable to access camera: ${err.message}. Please check your permissions and ensure no other app is using the camera.`);
    }
  };

  // ... rest of the component remains the same

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
    initializeCamera();
  };

  // ... rest of the component remains the same

  return (
    // ... the return statement remains the same
  );
};

export default PlantIdentifier;
