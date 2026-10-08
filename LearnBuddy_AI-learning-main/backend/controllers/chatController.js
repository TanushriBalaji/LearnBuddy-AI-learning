const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askAI = async (req, res) => {
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ message: 'Question is required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.json({ 
        answer: "System Notice: I am ready to answer your questions, but the system administrator needs to add a valid GEMINI_API_KEY to the backend/.env file to activate my real intelligence." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are LearnBuddy, an AI learning assistant for students studying computer science. Your answers must be short, direct, and to the point. Do NOT provide elaborate breakdowns or long explanations unless explicitly asked. Keep responses strictly between 1 to 3 sentences maximum. Answer the following question exactly in this concise manner: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
    
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: 'Error communicating with AI', error: error.message });
  }
};
