class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async generateCompletion(prompt, context = {}) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert programming assistant helping users with code. Provide clear, concise, and helpful responses.'
            },
            {
              role: 'user', 
              content: `Context: ${JSON.stringify(context)}\n\nPrompt: ${prompt}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        completion: data.choices[0]?.message?.content || '',
        usage: data.usage,
        model: data.model
      };

    } catch (error) {
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  async generateCodeSuggestion(code, language, cursor) {
    const prompt = `Given this ${language} code, suggest a completion or improvement for the code at the cursor position:\n\n${code}`;
    
    return this.generateCompletion(prompt, {
      language,
      cursor,
      type: 'code_completion'
    });
  }

  async explainCode(code, language) {
    const prompt = `Explain this ${language} code in simple terms:\n\n${code}`;
    
    return this.generateCompletion(prompt, {
      language,
      type: 'code_explanation'
    });
  }

  async findBugs(code, language) {
    const prompt = `Review this ${language} code and identify potential bugs or issues:\n\n${code}`;
    
    return this.generateCompletion(prompt, {
      language,
      type: 'bug_detection'
    });
  }

  async optimizeCode(code, language) {
    const prompt = `Suggest optimizations for this ${language} code:\n\n${code}`;
    
    return this.generateCompletion(prompt, {
      language,
      type: 'code_optimization'
    });
  }
}

module.exports = new AIService();
