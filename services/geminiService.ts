
import { GoogleGenAI, Type } from "@google/genai";
import { ContentIdea } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const contentIdeasSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "A short, catchy title for the content idea.",
            },
            type: {
                type: Type.STRING,
                enum: ['Text', 'Photo', 'Video'],
                description: "The format of the content (e.g., Text post, Photo, Video).",
            },
            description: {
                type: Type.STRING,
                description: "A brief, one-to-two sentence description of the content idea, explaining what the post would be about.",
            },
        },
        required: ["title", "type", "description"],
    },
};

/**
 * Generates content ideas for a creator based on a given topic.
 * @param topic - The theme or topic for the content ideas.
 * @returns A promise that resolves to an array of ContentIdea objects.
 */
export const generateContentIdeas = async (topic: string): Promise<ContentIdea[]> => {
    try {
        const prompt = `
            You are an expert social media strategist for content creators on a platform like Patreon or OnlyFans.
            Your goal is to generate 3 creative and engaging content ideas based on a given topic.
            The ideas should be suitable for a subscription-based platform, meaning they should feel exclusive and valuable to paying fans.
            For each idea, provide a title, specify the content type (Text, Photo, or Video), and write a brief description.
            The topic is: "${topic}"
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: contentIdeasSchema,
                temperature: 0.8,
                topP: 0.95,
            },
        });

        const jsonText = response.text.trim();
        // The response text is already a JSON string, so we can parse it directly.
        const parsedJson = JSON.parse(jsonText);

        if (!Array.isArray(parsedJson)) {
            throw new Error("API did not return a valid array of ideas.");
        }
        
        // Filter out any malformed ideas just in case
        const validIdeas = parsedJson.filter(idea => idea.title && idea.type && idea.description);

        return validIdeas as ContentIdea[];

    } catch (error) {
        console.error("Error generating content ideas with Gemini:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
};

/**
 * Applies a watermark to an image using HTML Canvas.
 * @param imageUrl - The data URL of the image to watermark.
 * @param watermarkText - The text to apply as a watermark.
 * @returns A promise that resolves to a data URL of the watermarked image.
 */
export const applyWatermark = (imageUrl: string, watermarkText: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Style the watermark
            const fontSize = Math.max(14, Math.min(img.width / 25, img.height / 20));
            ctx.font = `bold ${fontSize}px "Inter var", sans-serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';

            // Add a subtle shadow for better readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 5;

            // Draw text in the bottom-right corner
            ctx.fillText(watermarkText, canvas.width - 15, canvas.height - 10);

            resolve(canvas.toDataURL('image/jpeg', 0.9)); // Use JPEG for smaller file size
        };
        img.onerror = () => {
            reject(new Error('Failed to load image for watermarking'));
        };
        img.src = imageUrl;
    });
};
