import { userProfile } from './profile.js';

async function getLLMAnswers(apiKey, questions) {
  const prompt = `You are an expert assistant helping a candidate fill out a job application. 
  Here is the candidate's profile: ${JSON.stringify(userProfile, null, 2)}.
  Based on this profile, please provide concise and professional answers for the following questions. 
  Return the answers as a JSON object where the keys are the questions and the values are the answers.

  Questions:
  ${JSON.stringify(questions)}
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat-v3.1:free",
        "messages": [
          { "role": "user", "content": prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);

  } catch (error) {
    console.error("Error calling LLM:", error);
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_profile') {
    sendResponse({ profile: userProfile });
  }

  if (request.action === 'llm_fill_fields') {
    chrome.storage.sync.get(['apiKey'], async (result) => {
      if (!result.apiKey) {
        sendResponse({ error: "API key not found." });
        return;
      }
      const answers = await getLLMAnswers(result.apiKey, request.questions);
      sendResponse({ answers: answers });
    });
    return true; // for async sendResponse
  }
});
