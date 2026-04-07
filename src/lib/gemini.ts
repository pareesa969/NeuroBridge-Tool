import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAISummary(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following text for someone with cognitive processing needs. Keep it clear, concise, and use bullet points if necessary: \n\n${text}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error generating summary.";
  }
}

export async function getAISuggestion(context: string): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the following context about a learner's progress or current state, provide exactly 3 short, encouraging, and actionable suggestions for their learning sanctuary. 
      Return the response as a JSON array of objects, where each object has a "title" and a "description".
      
      Context: ${context}`,
      config: {
        responseMimeType: "application/json",
      }
    });
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    return [
      { title: "Quick Break", description: "Step away for 5 minutes to reset your focus." },
      { title: "Hydration", description: "Grab a glass of water to keep your brain sharp." },
      { title: "Deep Breath", description: "Take 3 deep breaths to ground your nervous system." }
    ];
  }
}

export async function getTaskBreakdown(task: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down the following complex task into 3-5 simple, manageable steps for someone who struggles with executive function: \n\n${task}`,
    });
    const text = response.text || "";
    return text.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error("AI Error:", error);
    return ["Step 1: Start small", "Step 2: Focus on one thing", "Step 3: Take a break"];
  }
}
