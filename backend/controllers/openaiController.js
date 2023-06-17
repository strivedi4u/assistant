const OpenAiModel = require('../models/openaiModel');

const OPENAI_API_KEY = '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';

const openaiModel = new OpenAiModel(OPENAI_API_KEY);

exports.generateResponse = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openaiModel.generateResponse({
      prompt: prompt,
      maxTokens: 100
    });
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' });
  }
};
