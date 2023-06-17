const { GPT } = require('openai');

class OpenAiModel {
  constructor(apiKey) {
    this.openai = new GPT({
      apiKey: apiKey,
      model: 'davinci',
      useBetaAPI: true
    });
  }

  async generateResponse(prompt) {
    try {
      const response = await this.openai.complete(prompt);
      const { choices } = response.data;
      if (choices && choices.length > 0) {
        const generatedResponse = choices[0].text.trim();
        return generatedResponse;
      } else {
        throw new Error('Failed to generate response from OpenAI API');
      }
    } catch (error) {
      throw new Error('Failed to generate response from OpenAI API');
    }
  }
}

module.exports = OpenAiModel;
