import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { embed, generateObject, generateText } from 'ai';
import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  // --- CONFIGURATION ---
  // Primary: Google Gemini 3 Flash (Fast, Cheap, Massive Context)
  // Alternative: GPT-4o (Higher reasoning, expensive)
  
  // Embedding Model
  // const embeddingModel = openai.embedding('text-embedding-3-small'); // OpenAI Option
  private readonly embeddingModel = google.textEmbeddingModel('text-embedding-004'); // Google Option

  // Chat Model (Vision Capable)
  // private readonly chatModel = openai('gpt-4o'); // OpenAI Option (~$16.50/mo for 100 docs/day)
  // Using Gemini 3.0 Flash (Released Dec 2025 - Best Speed/Cost/Context)
  private readonly chatModel = google('gemini-3.0-flash'); 

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const { embedding } = await embed({
        model: this.embeddingModel,
        value: text,
      });
      return embedding;
    } catch (error) {
      this.logger.error('Failed to generate embedding', error);
      throw error;
    }
  }

  async extractStructure(
    prompt: string,
    schema: z.Schema<any>,
    imageUrl?: string | Buffer,
  ): Promise<any> {
    try {
        const messages: any[] = [{ role: 'user', content: [{ type: 'text', text: prompt }] }];
        
        if (imageUrl) {
            // Google Gemini typically accepts base64 or storage URIs. 
            // The AI SDK handles Buffer -> Base64 conversion automatically for vision.
            messages[0].content.push({ type: 'image', image: imageUrl });
        }

        const { object } = await generateObject({
            model: this.chatModel,
            schema,
            messages,
        });
        return object;
    } catch (error) {
        this.logger.error('Failed to extract structure', error);
        throw error;
    }
  }
  
  async answerQuestion(context: string, question: string): Promise<string> {
      const { text } = await generateText({
          model: this.chatModel,
          prompt: `Context: ${context}\n\nQuestion: ${question}\n\nAnswer directly based on the context.`, 
      });
      return text;
  }
}
