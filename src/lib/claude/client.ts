import Anthropic from '@anthropic-ai/sdk';
import { ClaudeModel, TaskResult } from './types';

/**
 * Message structure for Claude API requests.
 */
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * ClaudeClient handles communication with the Anthropic Claude API.
 *
 * This class provides a simplified interface for generating responses from
 * Claude models, handling authentication, request formatting, and error handling.
 */
export class ClaudeClient {
  private client: Anthropic;
  private model: ClaudeModel;
  private apiKey: string;

  /**
   * Creates a new ClaudeClient instance.
   *
   * @param apiKey - Anthropic API key for authentication
   * @param model - Claude model to use (defaults to claude-3-haiku-20240229 for cost efficiency)
   */
  constructor(apiKey: string, model: ClaudeModel = 'claude-3-haiku-20240229') {
    if (!apiKey) {
      throw new Error('API key is required for ClaudeClient');
    }

    this.apiKey = apiKey;
    this.client = new Anthropic({
      apiKey,
    });
    this.model = model;
  }

  /**
   * Gets the API key used by this client.
   *
   * @returns The Anthropic API key
   */
  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Gets the model being used by this client.
   *
   * @returns The Claude model ID
   */
  getModel(): ClaudeModel {
    return this.model;
  }

  /**
   * Generates a response from Claude based on the provided prompt.
   *
   * @param prompt - The user's prompt or question
   * @param systemPrompt - Optional system instructions to guide Claude's behavior
   * @param maxTokens - Maximum number of tokens to generate (default: 1024)
   * @returns A TaskResult containing either the response data or error information
   */
  async generateResponse(prompt: string, systemPrompt?: string, maxTokens: number = 1024): Promise<TaskResult<string>> {
    if (!prompt || prompt.trim() === '') {
      return {
        success: false,
        error: 'Prompt cannot be empty',
        code: 'VALIDATION_ERROR'
      };
    }

    try {
      const messages: Message[] = [
        { role: 'user', content: prompt }
      ];

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        messages,
        ...(systemPrompt ? { system: systemPrompt } : {})
      });

      // Get the response text from the last message
      const responseText = response.content
        .filter(block => block.type === 'text')
        .map(block => (block.type === 'text' ? block.text : ''))
        .join('\n');

      if (!responseText) {
        return {
          success: false,
          error: 'Empty response from Claude API',
          code: 'API_ERROR'
        };
      }

      // Estimate tokens used (this is approximate since the API doesn't return this directly)
      const tokensUsed = {
        prompt: Math.ceil(prompt.length / 4), // Rough estimate: ~4 chars per token
        completion: Math.ceil(responseText.length / 4)
      };

      return {
        success: true,
        data: responseText,
        model: this.model,
        tokensUsed: tokensUsed.prompt + tokensUsed.completion
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'API_ERROR',
        model: this.model
      };
    }
  }
}
