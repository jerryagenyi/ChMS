import { ClaudeClient } from '@/lib/claude/client';
import Anthropic from '@anthropic-ai/sdk';

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockImplementation(async ({ messages, model }) => {
        if (messages[0].content.includes('error')) {
          throw new Error('API Error');
        }
        return {
          content: [
            {
              type: 'text',
              text: `Mock response for: ${messages[0].content}`
            }
          ]
        };
      })
    }
  }));
});

describe('ClaudeClient', () => {
  let client: ClaudeClient;
  
  beforeEach(() => {
    jest.clearAllMocks();
    client = new ClaudeClient('test-api-key', 'claude-3-sonnet-20240229');
  });
  
  it('initializes with the provided API key and model', () => {
    expect(Anthropic).toHaveBeenCalledWith({
      apiKey: 'test-api-key'
    });
  });
  
  describe('generateResponse', () => {
    it('returns a successful response', async () => {
      const prompt = 'Test prompt';
      const result = await client.generateResponse(prompt);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('Mock response for: Test prompt');
      
      // Verify the Anthropic SDK was called correctly
      const anthropicInstance = (Anthropic as jest.Mock).mock.instances[0];
      const createMethod = anthropicInstance.messages.create;
      expect(createMethod).toHaveBeenCalledWith({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: 'Test prompt' }]
      });
    });
    
    it('includes system prompt when provided', async () => {
      const prompt = 'Test prompt';
      const systemPrompt = 'System instructions';
      const result = await client.generateResponse(prompt, systemPrompt);
      
      // Verify the Anthropic SDK was called with the system prompt
      const anthropicInstance = (Anthropic as jest.Mock).mock.instances[0];
      const createMethod = anthropicInstance.messages.create;
      expect(createMethod).toHaveBeenCalledWith({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: 'Test prompt' }],
        system: 'System instructions'
      });
    });
    
    it('handles API errors gracefully', async () => {
      const prompt = 'error test';
      const result = await client.generateResponse(prompt);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });
});
