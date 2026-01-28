import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ViralScoreData, Language, TrendPostsData } from "../types";
import { getActiveApiKey, updateLastUsed } from "../utils/apiKeyStorage";

// Get API key from localStorage
const getApiKey = (): string => {
  const activeKey = getActiveApiKey();
  
  if (!activeKey) {
    throw new Error('API key not found. Please configure your API key in settings.');
  }
  
  // Update last used timestamp
  updateLastUsed(activeKey.id);
  
  return activeKey.key;
};

// Initialize Gemini Client - will be created per request
const createAIInstance = () => {
  return new GoogleGenAI({ apiKey: getApiKey() });
};

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: "0-100 score.",
    },
    classification: {
      type: Type.STRING,
      description: "Verbal classification of the score.",
    },
    summary: {
      type: Type.STRING,
      description: "Brief summary explanation.",
    },
    positiveFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Boosting factors.",
    },
    negativeFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Penalty factors.",
    },
    improvementTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Concrete improvement tips.",
    },
    optimizedVariations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Variation type label" },
          content: { type: Type.STRING, description: "Rewritten content" },
          explanation: { type: Type.STRING, description: "Why this works better" },
          predictedScore: { type: Type.NUMBER, description: "Estimated viral score (0-100) for this specific variation." }
        },
        required: ["label", "content", "explanation", "predictedScore"]
      },
      description: "3 optimized variations of the post."
    }
  },
  required: ["score", "classification", "summary", "positiveFactors", "negativeFactors", "improvementTips", "optimizedVariations"],
};

/**
 * Converts a File object to a Base64 string.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzePostViralPotential = async (text: string, imageFile: File | null, lang: Language): Promise<ViralScoreData> => {
  try {
    const parts: any[] = [];
    
    // Add text part
    if (text) {
      parts.push({ text: `Content to analyze: "${text}"` });
    }

    // Add image part if exists
    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      parts.push(imagePart);
    }

    // If inputs are empty
    if (parts.length === 0) {
      throw new Error(lang === 'tr' ? "Lütfen analiz için metin yazın veya bir görsel yükleyin." : "Please enter text or upload an image to analyze.");
    }

    const langInstruction = lang === 'tr' 
      ? "Tüm yanıtları, analizleri ve önerileri SADECE TÜRKÇE dilinde ver." 
      : "Provide all responses, analyses, and suggestions STRICTLY in ENGLISH.";

    // Define engaging labels based on language
    const variationLabels = lang === 'tr' 
      ? {
          conversation: "Sohbeti Ateşle",
          viral: "Viral Etki",
          story: "Hikaye Ustalığı"
        }
      : {
          conversation: "Spark Conversation",
          viral: "Go Viral Fast",
          story: "Storytelling Masterpiece"
        };

    // System instruction based on X Algorithm (Open Source)
    const systemPrompt = `
      You are the world's best social media algorithm engineer. Your task is to analyze the provided X (formerly Twitter) post based on the open-source 'X Recommendation Algorithm' rules on GitHub.
      
      ${langInstruction}
      
      Score precisely between 0 and 100 based on:
      
      POSITIVE SIGNALS:
      1. Media: Images/Videos get ~2x boost.
      2. Engagement Probability (Heavy Ranker): Like (30x), Retweet (20x), Reply (1x). Does it have hooks?
      3. Trending Topics.
      4. Clarity & CTA.
      
      NEGATIVE SIGNALS:
      1. External Links: Often penalty/spam.
      2. Toxic Language: Zero visibility.
      3. Unknown Language (relative to user base).
      4. Text-only without context/length optimization.

      TASK 1: IMPROVEMENT TIPS
      Provide 3-5 concrete, actionable tips. 
      CRITICAL: Each tip MUST be a "Call to Action" starting with an imperative verb (e.g., "Remove the link", "Add an image", "Shorten the sentence"). Do not just describe the problem; tell the user exactly what to do.

      TASK 2: OPTIMIZED VARIATIONS
      Rewrite the post in 3 DIFFERENT ways to maximize viral potential.
      For each variation, ESTIMATE a new score (predictedScore) which should typically be higher than the original score.
      
      CRITICAL CONSTRAINTS FOR VARIATIONS:
      1. LENGTH: All variations MUST be strictly under 280 characters to fit in a single tweet.
      2. HASHTAGS: You MUST identify MULTIPLE important keywords (topics, trends, entities) in the generated text and add a '#' symbol before them inline. Aim for 2-5 hashtags spread naturally (e.g., "The #future of #AI is transforming #business").
      
      Use these EXACT labels for the variations:
      - One "${variationLabels.conversation}" (Question/Debate oriented).
      - One "${variationLabels.viral}" (Short/Punchy oriented).
      - One "${variationLabels.story}" (Context/Hook oriented).
      
      Output strictly in JSON format matching the schema.
    `;

    const ai = createAIInstance(); // Create AI instance with current API key
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: { parts: parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (!response.text) {
      throw new Error(lang === 'tr' ? "API'den boş yanıt alındı." : "Received empty response from API.");
    }

    const data = JSON.parse(response.text) as ViralScoreData;
    return data;

  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error(lang === 'tr' ? "Analiz sırasında bir hata oluştu." : "An error occurred during analysis.");
  }
};

// Response schema for trend posts generation
const TREND_POSTS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    keyword: {
      type: Type.STRING,
      description: "User's input keyword."
    },
    generatedPosts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trendTopic: { 
            type: Type.STRING, 
            description: "The trending topic related to keyword (e.g., '#YapayZeka2026', 'AI Regulations')" 
          },
          content: { 
            type: Type.STRING, 
            description: "Generated viral post content (max 280 chars, with inline hashtags)" 
          },
          predictedScore: { 
            type: Type.NUMBER, 
            description: "Predicted viral score (0-100) based on X algorithm" 
          },
          explanation: { 
            type: Type.STRING, 
            description: "Brief explanation of why this post would work" 
          },
          algorithmFactors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key X algorithm factors applied (e.g., 'Question hook', '2x hashtags', 'Call to action')"
          },
          visualText: {
            type: Type.STRING,
            description: "Short catchy text for visual card (3-8 words, quotable, eye-catching)"
          },
          visualEmoji: {
            type: Type.STRING,
            description: "Single emoji that represents the post theme (e.g., 🚀, 💡, 🔥, ⚡, 🎯, 💪)"
          }
        },
        required: ["trendTopic", "content", "predictedScore", "explanation", "algorithmFactors", "visualText", "visualEmoji"]
      },
      description: "3 generated viral posts based on trending topics."
    }
  },
  required: ["keyword", "generatedPosts"]
};

/**
 * Generate viral posts based on a keyword and current X.com trends
 */
export const generateTrendPosts = async (keyword: string, tone: PostTone, lang: Language): Promise<TrendPostsData> => {
  try {
    if (!keyword.trim()) {
      throw new Error(lang === 'tr' ? "Lütfen bir anahtar kelime girin." : "Please enter a keyword.");
    }

    const langInstruction = lang === 'tr' 
      ? "Tüm yanıtları, içerikleri ve açıklamaları SADECE TÜRKÇE dilinde ver." 
      : "Provide all responses, content, and explanations STRICTLY in ENGLISH.";

    // Tone instruction mapping
    const toneInstructions: Record<PostTone, string> = {
      friendly: lang === 'tr' 
        ? "Samimi, arkadaş canlısı, sıcak bir dil kullan. Emoji kullanabilirsin."
        : "Use a warm, conversational, friendly tone. Emojis are welcome.",
      professional: lang === 'tr'
        ? "Ciddi, profesyonel, iş dünyasına uygun bir ton kullan. Emoji kullanma."
        : "Use a serious, professional, business-appropriate tone. No emojis.",
      exciting: lang === 'tr'
        ? "Heyecanlı, coşkulu, enerji dolu bir dil kullan! Ünlem işaretleri kullan!"
        : "Use an exciting, enthusiastic, energetic tone! Use exclamation marks!",
      optimistic: lang === 'tr'
        ? "İyimser, pozitif, umut verici bir perspektif sun."
        : "Use an optimistic, positive, hopeful perspective.",
      pessimistic: lang === 'tr'
        ? "Karamsar, eleştirel, endişeli bir bakış açısı kullan."
        : "Use a pessimistic, critical, worried perspective.",
      humorous: lang === 'tr'
        ? "Komik, esprili, hafif mizahi bir dil kullan. İroni yapabilirsin."
        : "Use a funny, witty, light-hearted tone. Irony is welcome.",
      motivational: lang === 'tr'
        ? "Motive edici, ilham verici, güçlendirici bir dil kullan."
        : "Use a motivational, inspiring, empowering tone.",
      controversial: lang === 'tr'
        ? "Tartışmalı, cesur, sınırları zorlayan bir yaklaşım kullan. Sert gerçekler paylaş."
        : "Use a controversial, bold, boundary-pushing approach. Share hard truths."
    };

    // System instruction for trend-based viral post generation
    const systemPrompt = `
      You are an expert X (Twitter) viral content creator and trend analyst with deep knowledge of the X Recommendation Algorithm (open source).
      
      ${langInstruction}
      
      TONE REQUIREMENT: ${toneInstructions[tone]}
      
      TASK: Given the keyword "${keyword}", you must:
      
      1. IDENTIFY 3 REALISTIC TRENDING TOPICS on X.com (Twitter) related to this keyword
         - Topics should feel current and relevant (January 2026)
         - Mix of hashtags and discussion topics
         - Can include: global events, tech trends, cultural moments, debates
      
      2. For EACH trending topic, GENERATE 1 OPTIMIZED VIRAL POST that:
         
         ✅ FOLLOWS X ALGORITHM RULES (Same as analysis criteria):
         
         POSITIVE SIGNALS (Apply these):
         - Engagement hooks: Questions, bold claims, controversy, emotional triggers
         - Call to action: Ask for engagement (reply, share, opinion)
         - Clarity: Clear, concise message
         - Hashtags: 2-5 hashtags integrated INLINE naturally (e.g., "The #future of #AI is...")
         - Trending context: Reference the trending topic directly
         - Thread potential: Hint at more info without giving it all away
         
         NEGATIVE SIGNALS (Avoid these):
         - External links (major penalty)
         - Toxic/divisive language beyond acceptable debate
         - Too many hashtags (spam)
         - Generic/boring statements
         
         ✅ TECHNICAL REQUIREMENTS:
         - Maximum 280 characters (STRICT)
         - Inline hashtags (not at the end)
         - Predict viral score (0-100) based on algorithm factors
         - List which algorithm factors were applied
      
      3. VISUAL CARD GENERATION (REQUIRED):
         For each post, you MUST also generate:
         - visualText: A short, punchy quote or key message (3-8 words) that MUST include or relate to the keyword "${keyword}"
           Examples: "${keyword} is changing everything", "The future of ${keyword}", "${keyword}: Don't miss this"
         - visualEmoji: ONE emoji that represents the theme (🚀💡🔥⚡🎯💪🌟✨🏆💰📈🎨🧠)
         These will be displayed as eye-catching visual cards above the post content
      
      4. OUTPUT FORMAT:
         - Total: 3 posts (one per trending topic)
         - Each post must have: trendTopic, content, predictedScore, explanation, algorithmFactors, visualText, visualEmoji
         - Scores should reflect realistic algorithm predictions (60-90 for well-optimized posts)
      
      CRITICAL: Posts must be ACTIONABLE examples users can copy and use immediately.
      
      Output strictly in JSON format matching the schema.
    `;

    const ai = createAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [{ text: `Generate viral posts for keyword: "${keyword}"` }] 
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: TREND_POSTS_SCHEMA,
      },
    });

    if (!response.text) {
      throw new Error(lang === 'tr' ? "API'den boş yanıt alındı." : "Received empty response from API.");
    }

    const data = JSON.parse(response.text) as TrendPostsData;
    
    // Ensure we have exactly 3 posts
    if (!data.generatedPosts || data.generatedPosts.length < 3) {
      throw new Error(lang === 'tr' ? "Yeterli post üretilemedi." : "Could not generate enough posts.");
    }

    return data;

  } catch (error) {
    console.error("Trend Generation Error:", error);
    throw new Error(lang === 'tr' ? "Post üretimi sırasında bir hata oluştu." : "An error occurred during post generation.");
  }
};