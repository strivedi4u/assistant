import "./App.css";
import oneLinerJoke from 'one-liner-joke';
import { useState, useEffect } from "react";
import axios from 'axios';
import YouTube from 'react-youtube';

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  /* ************************** Listening Start******************************/

  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-IN';
        setRecognition(recognition);
        setBrowserSupportsSpeechRecognition(true);
      } else {
        setBrowserSupportsSpeechRecognition(false);
      }
    };

    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.onresult = handleResult;
      recognition.onstart = handleMicOpen;
      recognition.onend = handleMicClose;
    }
  }, [recognition]);

  /* ************************** Listening End ******************************/

  /* ********************** Recognition Start ************************** */

  const handleResult = (event) => {
    const result = event.results[0][0].transcript;
    setTranscript(result);
    // console.log("Final transcript:", result);
    processQuery(result); // Call the processQuery function with the result
  };

  const handleMicOpen = () => {
    setIsMicOpen(true);
  };

  const handleMicClose = () => {
    setIsMicOpen(false);
    handleStartListening();
  };

  /* ************************ Recognition End ************************** */

  /* ************************* Speak Start ****************************** */
  const speakResult = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    // utterance.onend = () => {
    //   if (recognition && recognition.state !== "listening") {
    //     handleStartListening();
    //   }
    // };
  };

  /* ************************* Speak End ****************************** */

  /* ********************* Application On Off Start*************************/

  const handleStartListening = () => {
    try {
      if (recognition) {
        setTranscript("");
        recognition.start();
        setIsListening(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleStopListening = () => {
    window.location.reload();
    if (recognition) {
      console.log(isListening)
      recognition.stop();
      setIsListening(false);
    }
  };

  /* ********************* Application On Off End *************************/

  /* *********************** Process Query Start **************************/
  const processQuery = async (query) => {
    // console.log("Processing query:", query);
    if (query.includes("alexa") || query.includes("Google") || query.includes("google")) {
      if (query.includes("weather")) {
        // Handle weather request
      } else if (query.includes("news")) {
        // Handle news request
      } else if (query.includes("play")) {
        speakResult("Processing play request...");
        playSong(query);
      } else if (query.includes("joke")) {
        speakResult("Processing joke request...");
        getJoke();
      } else if (
        query.includes("who is") ||
        query.includes("what is") ||
        query.includes("tell me about")
      ) {
        speakResult("Processing information request...");
        // Handle information request
      } else if (query.includes("search")) {
        speakResult("Processing search request...");
        // Handle search request
      } else if (query.includes("stop music")) {
        stopMusic();
      } else {
        speakResult("Unable to process the query.");
      }
    } else {
      // speakResult("This is wrong");
    }
    setTranscript(""); // Reset the transcript to null
  };
  /* *********************** Process Query End *************************** */

  /* **************************** Jokes Start **************************** */
  const getJoke = () => {
    const joke = oneLinerJoke.getRandomJoke().body;
    console.log(joke)
    speakResult(joke);
  };
  /* **************************** Jokes End ******************************* */

  /* *********************** Song Player Start **************************** */
  const playSong = (songName) => {
    const searchSong = async () => {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              q: songName + ' audio',
              part: 'snippet',
              key: 'AIzaSyAXxhiLDukJ-h5bcuSdxWhw7LEMJbm_BdU',
              type: 'video',
              maxResults: 1,
            },
          }
        );

        if (response.data.items.length > 0) {
          const videoId = response.data.items[0].id.videoId;
          console.log("video " + videoId)
          setVideoId(videoId);
          setIsMusicPlaying(true);
        }
      } catch (error) {
        console.error('Error searching for the song:', error);
      }
    };

    if (songName) {
      searchSong();
    }
  };

  const stopMusic = () => {
    setIsMusicPlaying(false);
    setVideoId('');
  };

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
    },
  };
  /* *********************** Song Player End **************************** */

  return (
    <>
      <div className="container">
        <h2>Converter</h2>
        <br />
        <p>A React hook that converts speech from the microphone to text and makes it available to your React components.</p>

        <div className="main-content">
          {transcript}
        </div>

        <div className="mic-status">
          Microphone Status: {isMicOpen ? "Open" : "Closed"}
        </div>

        <div className="btn-style">
          {isMicOpen ? (
            <button onClick={handleStopListening}>Stop Listening</button>
          ) : (
            <button onClick={handleStartListening}>Start Listening</button>
          )}
        </div>

        {isMusicPlaying && videoId && <YouTube videoId={videoId} opts={opts} />}
      </div>
    </>
  );
};

export default App;
