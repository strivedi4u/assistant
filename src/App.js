import "./App.css";
import oneLinerJoke from 'one-liner-joke';
import { useState, useEffect } from "react";
import axios from 'axios';
import YouTube from 'react-youtube';

const getNews = async () => {
    const newsApiKey = 'a6d2f06ffe3a449a87319ea551f1e542'; // Replace with your News API key
    const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${newsApiKey}`;
  
    try {
      const response = await axios.get(url);
      const articles = response.data.articles;
      const newsTitles = articles.map(article => article.title);
      return newsTitles;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  };

  const extractLocation = async (query) => {
    const patterns = [
      /in\s+(\w+)$/,
      /in\s+(.*?)\s+today$/,
      /in\s+(\w+)\s+right now$/,
      /for\s+(\w+)$/,
      /at\s+(\w+)$/,
      /of\s+(\w+)$/
    ];
  
    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match) {
        const city = match[1];
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search/${city}?format=json&limit=1`
          );
          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { city, lat, lon };
          }
        } catch (error) {
          console.error('Error retrieving location:', error);
        }
        break;
      }
    }
  
    return null;
  };



  const getWeather = async (location) => {
    const weatherApiKey = '388240077aa0bb2387aaec97eaf714e0'; // Replace with your Weather API key
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}`;
  
    try {
      const response = await axios.get(url);
      const data = response.data;
      const temperature = Math.round(data.main.temp - 273.15, 1);
      const weatherDescription = data.weather[0].description;
      const formattedWeather = `The temperature in ${location} is ${temperature}°C with ${weatherDescription}.`;
      console.log('Weather:', formattedWeather);
      return formattedWeather;
    } catch (error) {
      console.error('Error fetching weather:', error);
    //   return searchGoogle(`Weather in ${location}`);
    }
  };

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false);
  const [videoId, setVideoId] = useState('');

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
    processQuery(result); // Call the processQuery function with the result
  };

  const speakResult = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    utterance.onend = () => {
      if (recognition && recognition.state !== "listening") {
        handleStartListening();
      }
    };
  };

  const processQuery = async(query) => {
    console.log("Processing query:", query);
    if (query.includes("alexa") || query.includes("Google") || query.includes("google")) {
        if (query.includes("weather")) {
            const location = await extractLocation(query);
            if (location) {
              const { city, lat, lon } = location;
            //   speakResult("Processing weather request...");
              getWeather(city, lat, lon).then(weather => speakResult(weather));
              // Call the necessary weather-related functions here
            } else {
              speakResult("Unable to determine the location.");
            }
          } else if (query.includes("news")) {
        // speakResult("Processing news request...");
        // // Call the necessary news-related functions here
        getNews().then(news => speakResult(news));
      } else if (query.includes("play")) {
        speakResult("Processing play request...");
        playSong(query);
        // Call the necessary functions to play a song here
      } else if (query.includes("joke")) {
        speakResult("Processing joke request...");
        getJoke();
        // Call the necessary functions to get a joke here
      } else if (
        query.includes("who is") ||
        query.includes("what is") ||
        query.includes("tell me about")
      ) {
        speakResult("Processing information request...");
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

  const getJoke = () => {
    const joke = oneLinerJoke.getRandomJoke().body;
    console.log(joke)
    speakResult(joke);
  };

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
          setVideoId(videoId);
        }
      } catch (error) {
        console.error('Error searching for the song:', error);
      }
    };

    if (songName) {
      searchSong();
    }
  };

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    if (recognition) {
      recognition.onresult = handleResult;
    }
  }, [recognition]);

  return (
    <>
      <div className="container">
        <h2>Hi Converter</h2>
        <br />
        <p>A React hook that converts speech from the microphone to text and makes it available to your React components.</p>

        <div className="main-content">
          {transcript}
        </div>

        <div className="btn-style">
          <button onClick={handleStartListening}>Start Listening</button>
          <button onClick={handleStopListening}>Stop Listening</button>
        </div>

        {videoId && <YouTube videoId={videoId} opts={opts} />}
      </div>
    </>
  );
};

export default App;
