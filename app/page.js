import PlantIdentifier from "../components/PlantIdentifier";
import HowItWorks from "../components/HowItWorks";
import Description from "../components/Description";
import { Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <header className="bg-[#82be34] text-white py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Leaf className="mr-2" size={24} />
          <h1 className="text-2xl font-bold">Plant Pal App</h1>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <PlantIdentifier />
        </div>
        <HowItWorks />
        <Description />
      </main>

      <footer className="bg-[#82be34] text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Tizardin.mu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
