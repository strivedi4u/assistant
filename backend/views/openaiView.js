const OpenAIView = {
    formatResponse: (response) => {
      let formattedResponse = response.replace('as an AI language model', '');
      formattedResponse = formattedResponse.replace('but as an ai model', '');
      formattedResponse = formattedResponse.replace('I am AI Model and', '');
      formattedResponse = formattedResponse.replace('AI Model', 'Shashank developed assistant');
      formattedResponse = formattedResponse.replace('ai model', 'Shashank developed assistant');
      formattedResponse = formattedResponse.replace('Ai model', 'Shashank developed assistant');
  
      return formattedResponse;
    },
  };
  
  module.exports = OpenAIView;
  