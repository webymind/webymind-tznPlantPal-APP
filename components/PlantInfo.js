import React from "react";
import { Leaf, Droplet, Sun, Thermometer, BookOpen, world } from "lucide-react"; // Import only known good icons

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="text-green-600 mr-2 mt-1">{icon}</div>
    <div>
      <span className="font-semibold text-green-800">{label}:</span>{" "}
      {value || "Not available"}
    </div>
  </div>
);

const PlantInfo = ({ info }) => {
  if (!info) return null;

  const careTips = [
    { icon: <Sun size={16} />, tip: "Light: Bright, indirect sunlight" },
    { icon: <Droplet size={16} />, tip: "Water: Keep soil consistently moist" },
    { icon: <Thermometer size={16} />, tip: "Temperature: 60-75°F (15-24°C)" },
  ];

  return (
    <div className="mt-8 bg-green-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center">
        <Leaf className="mr-2" /> Plant Information
      </h2>
      <div className="space-y-4">
        <InfoItem icon={<Leaf />} label="Name" value={info.name} />
        <InfoItem
          icon={<BookOpen />}
          label="Scientific Name"
          value={info.scientificName}
        />
        <InfoItem icon={<BookOpen />} label="Family" value={info.family} />
        <InfoItem
          icon={<BookOpen />}
          label="Description"
          value={info.description}
        />
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3 text-green-700">Care Tips</h3>
        <table className="w-full">
          <tbody>
            {careTips.map((tip, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-green-100" : "bg-green-50"}
              >
                <td className="py-2 px-4 flex items-center">
                  {tip.icon}
                  <span className="ml-2">{tip.tip}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3 text-green-700">Source</h3>
        <table className="w-full">
          <tbody>
            <span>
              <a href="https://tizardin.mu">www.tizardin.mu</a>
            </span>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantInfo;
