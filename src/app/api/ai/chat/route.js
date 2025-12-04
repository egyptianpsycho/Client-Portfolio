// src/app/api/ai/chat/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkAvailability } from "@/app/utils/googleCalendar";

const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
  console.warn("GEMINI_API_KEY not configured — AI calls will fail.");
}

// Tool implementations
const availableTools = {
  checkAvailability: async ({ startISO, endISO }) => {
    console.log(`Tool: checkAvailability(${startISO}, ${endISO})`);
    try {
      const isAvailable = await checkAvailability(startISO, endISO);
      return {
        is_available: !!isAvailable,
        message: isAvailable
          ? `Slot ${startISO} -> ${endISO} is available`
          : `Slot ${startISO} -> ${endISO} is NOT available`,
      };
    } catch (err) {
      console.error("Tool error (checkAvailability):", err);
      return {
        is_available: false,
        message: "Technical error checking calendar",
      };
    }
  },

  searchGoogle: async ({ query }) => {
    if (!query) return { result: "No query provided." };
    if (query.toLowerCase().includes("price") || query.toLowerCase().includes("cost")) {
      return {
        result: "Portrait Session = $350/1hr, Event Coverage = $600/2hr, Product Photography = $400/1.5hr, Corporate Headshots = $250/45min",
      };
    }
    return {
      result: "General photography info. Ask specifics for pricing.",
    };
  },
};

// Convert client history to Gemini format
function normalizeClientHistory(conversationHistory = []) {
  const filteredHistory = conversationHistory.filter((m, idx) => {
    if (idx === 0 && m.role === "assistant") {
      return false;
    }
    return true;
  });

  return filteredHistory.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

// Tool declarations for Gemini
const tools = [
  {
    functionDeclarations: [
      {
        name: "checkAvailability",
        description: "Checks if a time slot is available for booking.",
        parameters: {
          type: "object",
          properties: {
            startISO: {
              type: "string",
              description: "Start time in ISO 8601 format",
            },
            endISO: {
              type: "string",
              description: "End time in ISO 8601 format",
            },
          },
          required: ["startISO", "endISO"],
        },
      },
      {
        name: "searchGoogle",
        description: "Searches for pricing or business details.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query",
            },
          },
          required: ["query"],
        },
      },
    ],
  },
];

const systemInstruction = `You are Lens, an AI assistant for Abbas Visuals photography Studio.

Your goals:
1. Answer questions about services and pricing
2. Help users book photography sessions through a streamlined TWO-STEP process
3. Show available time slots when asked

SERVICES AVAILABLE:
- Portrait Session: $350 / 1 hour - Professional portrait photography
- Event Coverage: $600 / 2 hours - Complete event documentation
- Product Photography: $400 / 1.5 hours - High-quality product shots
- Corporate Headshots: $250 / 45 minutes - Professional business portraits

BOOKING FLOW - TWO MESSAGES ONLY:

When a user wants to book, follow this EXACT pattern:

STEP 1 - Personal & Schedule Info (ONE MESSAGE):
Ask for ALL of these in a single, friendly message:
- Full Name
- Email Address
- Phone Number
- Preferred Date (month and day only - assume 2025)
- Start Time
- End Time

Example: "Great! Let's get you booked. I'll need a few details:
• Your full name
• Email address
• Phone number
• What date works for you? (just the month and day, like "December 15")
• Preferred start time
• And when should we wrap up?

Just share these with me and we'll move to the next step!"
IMPORTANT: When user provides a date, always assume the year is 2025. If they say "December 15" or "12/15", interpret it as December 15, 2025.


STEP 2 - Session Details (ONE MESSAGE):
After you have ALL personal/schedule info, ask for:
- Service Type (Portrait, Event, etc.)
- Location/Place
- Any special notes or requests

Example: "Perfect! Now just a couple more things:
• What type of session are you interested in? (Portrait, Event, etc.)
• Where would you like the shoot? (Studio, outdoor location, address)
• Any special requests or notes?"

ONLY when ALL fields from BOTH steps are collected, set intent to "book" with complete booking_details.

IMPORTANT RULES:
- Be conversational but efficient
- If user provides some info unprompted, acknowledge it and only ask for what's missing
- When converting date/time to ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ), ALWAYS use 2025 as the year
- If user says "December 15" or "12/15" or any date without a year, treat it as 2025
- Use checkAvailability tool to verify times before confirming
- Set intent to "show_schedule" when user asks about availability/times/schedule/when available
- Set intent to "show_pricing" when user asks about pricing/services/costs/packages/how much
- Set intent to "book" ONLY when ALL required fields are collected
- Keep responses concise and friendly
- When user asks about pricing or services, mention that they can view the pricing panel for details

Response Format (always valid JSON, no markdown):
{
  "intent": "chat" | "book" | "show_schedule" | "show_pricing",
  "assistant_message": "Your response here",
  "booking_details": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "service": "Service Type",
    "place": "Location",
    "startISO": "2025-12-01T10:00:00Z",
    "endISO": "2025-12-01T11:00:00Z",
    "notes": "Optional notes"
  }
}`;

export async function POST(request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    const history = normalizeClientHistory(conversationHistory);

    const ai = new GoogleGenerativeAI(apiKey);
    const generativeModel = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
      tools: tools,
    });

    const chat = generativeModel.startChat({
      history: history,
    });

    let result = await chat.sendMessage(message);
    let response = result.response;

    // Handle function calls
    let iterations = 0;
    const maxIterations = 5;

    while (iterations < maxIterations) {
      const candidate = response.candidates?.[0];
      if (!candidate?.content?.parts) break;

      const functionCalls = candidate.content.parts.filter(
        (part) => part.functionCall
      );

      if (functionCalls.length === 0) break;

      iterations++;
      const functionResponses = [];

      for (const part of functionCalls) {
        const { name, args } = part.functionCall;

        if (availableTools[name]) {
          console.log(`Executing tool: ${name}`, args);
          const toolResult = await availableTools[name](args);

          functionResponses.push({
            functionResponse: {
              name: name,
              response: toolResult,
            },
          });
        } else {
          console.error(`Unknown tool: ${name}`);
          functionResponses.push({
            functionResponse: {
              name: name,
              response: { error: "Unknown function" },
            },
          });
        }
      }

      result = await chat.sendMessage(functionResponses);
      response = result.response;
    }

    // Extract text response
    let finalText = "";
    try {
      finalText = response.text();
    } catch (err) {
      console.error("Error extracting text:", err);
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        const textParts = candidate.content.parts
          .filter((p) => p.text)
          .map((p) => p.text);
        finalText = textParts.join("");
      }
    }

    // Clean markdown fences
    finalText = finalText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/\bNone\b/g, "null")
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .trim();

    // Parse JSON
    let finalJson;
    try {
      finalJson = JSON.parse(finalText);
    } catch (parseError) {
      console.warn("JSON Parse Error, using fallback", parseError);
      
      const lowerText = finalText.toLowerCase();
      
      // Detect intent from text if JSON parsing fails
      let detectedIntent = "chat";
      if (lowerText.includes("show_schedule") || 
          lowerText.includes("available times") || 
          lowerText.includes("free slots") ||
          lowerText.includes("check availability")) {
        detectedIntent = "show_schedule";
      } else if (lowerText.includes("show_pricing") || 
                 lowerText.includes("view pricing") ||
                 lowerText.includes("pricing panel") ||
                 lowerText.includes("our services")) {
        detectedIntent = "show_pricing";
      }
      
      finalJson = {
        intent: detectedIntent,
        assistant_message: finalText || "I'm here to help! How can I assist you?",
      };
    }

    // Ensure required fields
    if (!finalJson.intent) {
      finalJson.intent = "chat";
    }
    if (!finalJson.assistant_message) {
      finalJson.assistant_message = "I'm here to help! How can I assist you?";
    }

    // Validate booking_details if intent is "book"
    if (finalJson.intent === "book" && finalJson.booking_details) {
      const bd = finalJson.booking_details;
      const requiredFields = ["name", "email", "phone", "service", "place", "startISO", "endISO"];
      const missingFields = requiredFields.filter(field => !bd[field]);
      
      if (missingFields.length > 0) {
        // If fields are missing, revert to chat mode
        console.log("Booking attempted with missing fields:", missingFields);
        finalJson.intent = "chat";
        finalJson.assistant_message = "I still need a few more details. " + finalJson.assistant_message;
        delete finalJson.booking_details;
      }
    }

    console.log("Final Response:", finalJson);
    return NextResponse.json(finalJson);

  } catch (err) {
    console.error("AI Chat Route Error:", err);

    if (err.status === 429 || err.message?.includes("quota")) {
      return NextResponse.json(
        {
          intent: "chat",
          assistant_message: "⚠️ I'm currently experiencing high traffic. Please wait a moment and try again.",
          error: "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        intent: "chat",
        assistant_message: "I'm experiencing a technical issue. Please try again.",
        error: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}