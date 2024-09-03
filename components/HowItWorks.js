import React from "react";
import { Upload, Cpu, Info } from "lucide-react";

const HowItWorksCard = ({ icon, title, description }) => (
  <div className="bg-slate-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
    <div className="bg-lime-500 rounded-full p-3 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload size={24} className="text-slate-800" />,
      title: "Upload Image",
      description:
        "Take a photo or upload an existing image of a plant you want to identify.",
    },
    {
      icon: <Cpu size={24} className="text-slate-800" />,
      title: "AI Analysis",
      description:
        "Our advanced AI analyzes the image to identify the plant species.",
    },
    {
      icon: <Info size={24} className="text-slate-800" />,
      title: "Get Information",
      description:
        "Receive detailed information about the plant, including its name, scientific name, and characteristics.",
    },
  ];

  return (
    <div className="bg-gradient-to-br bg-[#82be34] text-white rounded-md hover:bg-[#6ea12b] transition duration-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-white mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <HowItWorksCard key={index} {...step} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
