import "./App.css";
import oneLinerJoke from 'one-liner-joke';
import YouTubePlayer from 'youtube-player';
import { useState, useEffect } from "react";

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false);

  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-IN';
        setRecognition(recognition);
        setBrowserSupportsSpeechRecognition(true);
      }
    };

    initializeSpeechRecognition();
  }, []);

  const handleStartListening = () => {
    if (recognition) {
      setTranscript("");
      recognition.start();
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleResult = (event) => {
    const result = event.results[0][0].transcript;
    setTranscript(result);
    console.log("Final transcript:", result);
    // speakResult(result);
    processQuery(result); // Call the processQuery function with the result
  };

  const speakResult = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    utterance.onend = () => {
      if (recognition && recognition.state !== "listening") {
        handleStartListening();
      }
    };
  };
  

  const processQuery = (query) => {
    console.log("Processing query:", query);
    if (query.includes("alexa") || query.includes("Google") || query.includes("google")) {
      if (query.includes("weather")) {
        speakResult("Processing weather request...");
        // Call the necessary weather-related functions here
      } else if (query.includes("news")) {
        speakResult("Processing news request...");
        // Call the necessary news-related functions here
      } else if (query.includes("play")) {
        // speakResult("Processing play request...");
        // playSong(q)
        // Call the necessary functions to play a song here
      } else if (query.includes("joke")) {
        // speakResult("Processing joke request...");
        // Call the necessary functions to get a joke here
        get_joke();
      } else if (
        query.includes("who is") ||
        query.includes("what is") ||
        query.includes("tell me about")
      ) {
        // speakResult("Processing information request...");
        // const text = searchWikipedia(query);
        // console.log(text);
        // speakResult(text)
        // Call the necessary functions to get information here
      } else if (query.includes("search")) {
        speakResult("Processing search request...");
        // Call the necessary functions to perform a search here
      } else {
        speakResult("Unable to process the query.");
      }
    } else {
      speakResult("This is wrong");
    }
    setTranscript(""); // Reset the transcript to null
  };
  





  const get_joke = () => {
    const joke = oneLinerJoke.getRandomJoke().body;
    console.log(joke)
    speakResult(joke);
  };
  
//   const searchWikipedia = async (query) => {
//     try {
//       const page = await wiki().page(query);
//       const summary = await page.summary();
//       return summary;
//     } catch (error) {
//       if (error.code === 'missingtitle') {
//         return 'There are multiple matches for that query. Please be more specific.';
//       } else {
//         // return generateResponse(query, 'en', [query]);
//       }
//     }
//   };
  
  


  const playSong = (songName) => {
    const player = YouTubePlayer('player');
  
    player.loadVideoById(songName);
    player.playVideo();
  };







  useEffect(() => {
    if (recognition) {
      recognition.onresult = handleResult;
    }
  }, [recognition]);

  return (
    <>
      <div className="container">
        <h2>Speech to Text Converter</h2>
        <br />
        <p>A React hook that converts speech from the microphone to text and makes it available to your React components.</p>

        <div className="main-content">
          {transcript}
        </div>

        <div className="btn-style">
          <button onClick={handleStartListening}>Start Listening</button>
          <button onClick={handleStopListening}>Stop Listening</button>
        </div>
      </div>
    </>
  );
};

export default App;
