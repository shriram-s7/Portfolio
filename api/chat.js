import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPortfolioKnowledge } from '../src/lib/buildPortfolioKnowledge.js';

export default async function handler(req, res) {
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Unavailable', message: 'Assistant is offline right now.' });
    }

    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [] } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // Retrieve the complete portfolio knowledge base dynamically from data files
        const knowledgeBase = buildPortfolioKnowledge();
        
        // Compile the portfolio details in a clean, structured layout
        const contextString = knowledgeBase
            .map(item => `[${item.type.toUpperCase()}] ${item.title}\n${item.content}`)
            .join('\n\n');

        const systemPrompt = `
You are Helper AI — Shriram’s intelligent portfolio assistant.
Your GOAL is to convince recruiters of Shriram's expertise by providing structured, confident, and enthusiastic answers.
Speak about Shriram in the third person, in a friendly, concise, recruiter-pitch tone.

Shriram's Portfolio Information:
${contextString}

Instructions:
1. Answer ONLY using the provided portfolio context (projects, skills, achievements, certifications, education, hackathons).
2. Keep responses short (2-4 sentences) unless asked for details.
3. If asked something outside the portfolio scope, politely redirect to portfolio-related topics.
4. When relevant, suggest a "navigateTo" section id matching this site's actual section IDs: "home", "skills", "projects", "hackathon", "achievements", "education", "contact".
5. If the user asks about or shows interest in a specific project, set "highlightCard" to that project's ID (e.g., "auramed", "0", "1", "2", "3", "4", "5").
6. If the user asks specifically to open, view, or show details for a project, set "openModalId" to that project's ID (e.g., "auramed", "0", "1", "2", "3", "4", "5").
7. Ensure that the "reply" string in the JSON is a clean markdown response (e.g. bolding key terms, using bullet points), but do NOT wrap the reply text itself in triple backticks blocks (like \`\`\`markdown) inside the JSON.
`;

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        // Map frontend history array ({role, content}) to Gemini SDK contents array ({role, parts: [{text}]})
        // Mappings:
        // - 'user' -> 'user'
        // - 'assistant' -> 'model'
        const contents = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));
        
        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Request structured JSON output
        const response = await model.generateContent({
            contents,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        reply: { 
                            type: "STRING",
                            description: "The assistant response speaking about Shriram in third person, recruiter-pitch style. Do not wrap in markdown code blocks."
                        },
                        navigateTo: { 
                            type: "STRING", 
                            description: "The section ID to navigate to ('home', 'skills', 'projects', 'hackathon', 'achievements', 'education', 'contact') if relevant, otherwise null or empty string."
                        },
                        highlightCard: { 
                            type: "STRING", 
                            description: "The ID of the project card to highlight if the user shows interest in a specific project (e.g., 'auramed', '0', '1', '2', '3', '4', '5'), otherwise null or empty string."
                        },
                        openModalId: { 
                            type: "STRING", 
                            description: "The ID of the project to open modal details for if requested (e.g., 'auramed', '0', '1', '2', '3', '4', '5'), otherwise null or empty string."
                        }
                    },
                    required: ["reply"]
                }
            }
        });

        const responseText = response.response.text();
        const responseJson = JSON.parse(responseText);

        // Standardize output
        return res.status(200).json({
            reply: responseJson.reply || "I couldn't process that.",
            navigateTo: responseJson.navigateTo || null,
            highlightCard: responseJson.highlightCard || null,
            openModalId: responseJson.openModalId || null
        });

    } catch (error) {
        console.error("Gemini API Error:", error?.status || '', String(error?.message || '').slice(0, 200));
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Assistant is offline right now.'
        });
    }
}
