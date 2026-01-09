const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getStepByStepExplanation = async (questionText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are an expert aptitude tutor. Provide a detailed, step-by-step solution as described in the AptiVerve system instruction.",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: questionText }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
      },
    });

    const output = result.response.text();
    return output;

  } catch (error) {
    console.error("AI Error:", error);
    return "Error generating explanation.";
  }
};

module.exports = { getStepByStepExplanation };
