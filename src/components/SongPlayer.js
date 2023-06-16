import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';

const SongPlayer = ({ songName }) => {
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
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
  }, [songName]);



  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div>
      {videoId && <YouTube videoId={videoId} opts={opts} />}
    </div>
  );
};

export default SongPlayer;
