import { GoogleGenAI } from "@google/genai";
import { ProductData, BrandData, AgentResult, AuditData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AGENT_1_MODEL = 'gemini-2.5-flash';
const AGENT_2_MODEL = 'gemini-2.5-flash';
const AGENT_3_MODEL = 'gemini-2.5-flash';

// Helper to reliably extract HTML from model response
const cleanAndExtractHtml = (text: string): string => {
  if (!text) return "";
  
  // 1. Remove markdown code blocks wrappers
  let clean = text.replace(/```html/gi, '').replace(/```/g, '');
  
  // 2. Find the standard HTML envelope
  const doctypeIndex = clean.indexOf('<!DOCTYPE html>');
  const htmlStartIndex = clean.indexOf('<html');
  const htmlEndIndex = clean.lastIndexOf('</html>');

  let startIndex = -1;

  if (doctypeIndex !== -1) {
    startIndex = doctypeIndex;
  } else if (htmlStartIndex !== -1) {
    startIndex = htmlStartIndex;
  }

  // If we found a start and an end, substring it
  if (startIndex !== -1 && htmlEndIndex !== -1) {
    // +7 to include the length of </html>
    return clean.substring(startIndex, htmlEndIndex + 7).trim();
  }

  // Fallback: just return the cleaned text if tags aren't clear, 
  // though the regex above usually catches most issues.
  return clean.trim();
};

export const runAgent1 = async (data: ProductData): Promise<AgentResult> => {
  const prompt = `
    ROLE: You are an expert AEO Content Writer and Front-End Developer. Your focus is on technical compliance, optimal structure for AI extraction, and clear web standards.

    CONTEXT: You have been provided with detailed product information for a life insurance product.

    TASK: Generate a single, complete HTML5 file (including all necessary CSS embedded in a <style> block in the <head>) for a dedicated product landing page.

    REQUIREMENTS (AEO Focus):

    HTML Structure: Must be semantic HTML5.

    AEO Optimization:
    - The primary content must be organized around question-and-answer pairs using conversational language (e.g., using <h2> for the question and the following paragraph or list for the answer).
    - The answer to the main question (e.g., "What is ${data.productName} life insurance?") must be concise and direct (40-60 words) and presented immediately below the corresponding heading.
    - Include a dedicated FAQ Section at the bottom with at least three common, high-intent questions about life insurance (e.g., "How much does ${data.productName} cost?", "Do I need a medical exam?", "How long does the application take?").
    - Implement Structured Data (Schema Markup) using a <script type="application/ld+json"> block in the <head> for FAQPage or Product to enhance machine readability.
    - Generate a highly relevant, compelling <title> and <meta name="description"> that is question-answer focused.

    Initial Styling: Apply basic, neutral, clean, and modern CSS for readability. Use clear, un-branded formatting (bullet points, numbered lists) to aid AI extraction.

    OUTPUT FORMAT: 
    Return ONLY the complete HTML code block. Do not include any introductory text, markdown formatting, or explanations. Start immediately with <!DOCTYPE html>.

    INPUT DATA:
    Product Name: ${data.productName}
    Key Features/Benefits: ${data.features}
    Target Audience Summary: ${data.targetAudience}
    Call-to-Action (CTA): ${data.cta}
  `;

  try {
    const response = await ai.models.generateContent({
      model: AGENT_1_MODEL,
      contents: prompt,
    });
    
    const html = cleanAndExtractHtml(response.text || "");
    return { html, prompt };
  } catch (error) {
    console.error("Agent 1 Error:", error);
    throw new Error("Agent 1 failed to generate content.");
  }
};

export const refineAgent1 = async (currentHtml: string, instructions: string): Promise<AgentResult> => {
  const prompt = `
    ROLE: You are an expert AEO Content Writer and Web Developer.
    
    TASK: You have been given an existing HTML file and a set of REVISION INSTRUCTIONS. You must rewrite the HTML to incorporate these changes while maintaining the strict AEO structure (semantic HTML, Q&A format, Schema markup).

    EXISTING HTML:
    ${currentHtml}

    REVISION INSTRUCTIONS:
    "${instructions}"

    OUTPUT FORMAT: 
    Return ONLY the updated, complete HTML code. Do not include any text before or after the code.
  `;

  try {
    const response = await ai.models.generateContent({
      model: AGENT_1_MODEL,
      contents: prompt,
    });
    
    const html = cleanAndExtractHtml(response.text || "");
    return { html, prompt };
  } catch (error) {
    console.error("Agent 1 Refine Error:", error);
    throw new Error("Agent 1 failed to refine content.");
  }
};

export const runAgent2 = async (htmlInput: string, brand: BrandData, product: ProductData): Promise<AgentResult> => {
  
  // Logic to determine which brand source to use
  let brandContext = '';
  if (brand.brandingDocument && brand.brandingDocument.trim().length > 0) {
    brandContext = `
    IMPORTANT: The user has uploaded a specific BRANDING DOCUMENT. You must strictly adhere to the guidelines, voice, tone, and visual cues found in the text below. Ignore any generic default styling assumptions.
    
    === BRANDING DOCUMENT ===
    ${brand.brandingDocument}
    =========================
    `;
  } else {
    brandContext = `
    BRAND PROFILE (Manual Entry):
    - Personality: ${brand.personality}
    - Tone: ${brand.tone}
    - Primary Color Theme: ${brand.primaryColor}
    `;
  }

  const prompt = `
    ROLE: You are a Brand Strategist and Personality Psychology Expert who specializes in taking raw content and adjusting its visual and textual style to align perfectly with a defined brand personality and Ideal Customer Profile (ICP).

    CONTEXT: You have received raw HTML/CSS output. You also have a comprehensive Brand Personality Profile.

    TASK: Analyze the raw HTML and the provided brand profile, then edit the HTML/CSS to align the style, tone, and visual elements with the brand's characteristics.

    ${brandContext}

    - Target Audience: ${product.targetAudience}

    INSTRUCTIONS:
    1.  **Refine the CSS**: Overhaul the existing <style> block. Use colors, fonts, and spacing that reflect the Brand Personality defined above. 
        - If the profile suggests "Professional", use serifs or clean sans-serifs, blues/navies, ample whitespace.
        - If "Playful", use rounded fonts, vibrant colors, dynamic spacing.
        - Ensure mobile responsiveness is preserved or improved.
    2.  **Refine the Copy Tone**: Rewrite the introductions, headlines, and call-to-action buttons to match the Brand Tone. 
        - Keep the core AEO answers (the concise 40-60 word definitions) intact for SEO purposes, but adjust the surrounding conversational text.
    3.  **Visual Elements**: Add placeholder image tags (using https://picsum.photos/...) where appropriate to break up text and add visual interest.
    
    OUTPUT FORMAT: 
    Return ONLY the full, valid HTML5 file. Do not wrap in markdown. Do not include "Here is the code" or any conversational filler. Start with <!DOCTYPE html>.

    RAW HTML INPUT:
    ${htmlInput}
  `;

  try {
    const response = await ai.models.generateContent({
      model: AGENT_2_MODEL,
      contents: prompt,
    });

    const html = cleanAndExtractHtml(response.text || "");
    return { html, prompt };
  } catch (error) {
    console.error("Agent 2 Error:", error);
    throw new Error("Agent 2 failed to refine content.");
  }
};

export const refineAgent2 = async (currentHtml: string, instructions: string, brand: BrandData): Promise<AgentResult> => {
    // Logic to determine which brand source to use for context (brief version)
    let brandContext = '';
    if (brand.brandingDocument && brand.brandingDocument.trim().length > 0) {
      brandContext = `BRAND GUIDELINES DOCUMENT: Included in previous context. Ensure revisions align with the uploaded brand voice and style.`;
    } else {
      brandContext = `BRAND PERSONALITY: ${brand.personality}. TONE: ${brand.tone}.`;
    }

    const prompt = `
      ROLE: You are a Brand Strategist and Web Developer.
      
      TASK: You have been given an existing HTML file (which has already been styled for the brand) and a set of REVISION INSTRUCTIONS.
      
      OBJECTIVE: Apply the requested changes while STRICTLY maintaining the existing Brand Personality and Design System present in the HTML. Do not revert to generic styles.
  
      ${brandContext}
  
      EXISTING HTML:
      ${currentHtml}
  
      REVISION INSTRUCTIONS:
      "${instructions}"
  
      OUTPUT FORMAT: 
      Return ONLY the updated, complete HTML code. Do not wrap in markdown. Do not include any text before or after the HTML.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: AGENT_2_MODEL,
        contents: prompt,
      });
      
      const html = cleanAndExtractHtml(response.text || "");
      return { html, prompt };
    } catch (error) {
      console.error("Agent 2 Refine Error:", error);
      throw new Error("Agent 2 failed to refine content.");
    }
  };

export const runAgent3 = async (htmlContent: string): Promise<{ audit: AuditData, prompt: string }> => {
  const prompt = `
    ROLE: You are an expert AEO (Answer Engine Optimization) Auditor and QA Specialist.
    CONTEXT: You are analyzing a webpage to determine how well it is optimized for AI-driven Answer Engines (Google SGE, ChatGPT, Perplexity, Bing Chat).
    
    TASK: Analyze the provided HTML code and generate a comprehensive AEO Audit Report in JSON format.

    HTML CONTENT:
    ${htmlContent}

    ANALYSIS CRITERIA:
    1. **Q&A Structure**: Are there clear questions (H2) followed by direct, concise answers?
    2. **Schema Markup**: Is there valid structured data (FAQPage, Product)?
    3. **Content Clarity**: Is the language conversational yet factual? Is the main entity clearly defined?
    4. **Formatting**: Are lists and bullet points used effectively for data extraction?

    OUTPUT FORMAT (JSON ONLY):
    {
      "overallScore": number (0-100),
      "summary": "Brief executive summary of the AEO performance.",
      "checklist": [
        { "criteria": "Schema Markup", "status": "pass"|"fail"|"warning", "details": "Explanation..." },
        { "criteria": "Q&A Formatting", "status": "pass"|"fail"|"warning", "details": "Explanation..." },
        { "criteria": "Direct Answer Conciseness", "status": "pass"|"fail"|"warning", "details": "Explanation..." },
        { "criteria": "Semantic HTML", "status": "pass"|"fail"|"warning", "details": "Explanation..." },
        { "criteria": "Entity Clarity", "status": "pass"|"fail"|"warning", "details": "Explanation..." }
      ],
      "engineSimulations": [
        {
           "engineName": "Google SGE",
           "simulatedResponse": "Simulate how SGE might summarize this page in a snapshot.",
           "verdict": "Likely to be featured / Unlikely"
        },
        {
           "engineName": "ChatGPT Search",
           "simulatedResponse": "Simulate how ChatGPT might cite this page in an answer.",
           "verdict": "High citation probability / Low"
        },
        {
           "engineName": "Perplexity",
           "simulatedResponse": "Simulate the direct answer citation.",
           "verdict": "Strong source / Weak source"
        }
      ]
    }
  `;

  try {
     const response = await ai.models.generateContent({
      model: AGENT_3_MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text || "{}";
    const audit = JSON.parse(text) as AuditData;
    return { audit, prompt };
  } catch (error) {
    console.error("Agent 3 Error:", error);
    throw new Error("Agent 3 failed to audit content.");
  }
};
