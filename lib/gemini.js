import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function identifyPlant(imageBase64) {
  try {
    // Use the new gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Identify this plant and provide the following information: name, scientific name, family, a brief description, and care tips.";

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(",")[1],
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    console.log("Received response from Gemini API:", text);

    // Parse the response text into an object
    const info = parseResponse(text);

    console.log("Parsed plant information:", info);
    return info;
  } catch (error) {
    console.error("Error in identifyPlant function:", error);
    throw new Error("Failed to identify plant: " + error.message);
  }
}

function parseResponse(text) {
  const lines = text.split("\n");
  return {
    name: extractInfo(lines, "name"),
    scientificName: extractInfo(lines, "scientific name"),
    family: extractInfo(lines, "family"),
    description: extractInfo(lines, "description"),
    careTips: extractInfo(lines, "care tips"),
  };
}

function extractInfo(lines, key) {
  const line = lines.find((l) => l.toLowerCase().includes(key.toLowerCase()));
  return line ? line.split(":")[1]?.trim() : `No ${key} available`;
}
