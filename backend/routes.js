const express = require('express');
const openAIController = require('./controllers/openaiController');

const router = express.Router();

router.post('/generate-response', openAIController.generateResponse);

module.exports = router;
