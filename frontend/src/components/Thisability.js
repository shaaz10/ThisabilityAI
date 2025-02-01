import React, { useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import yt from '../assets/yt.png';  // Adjust the path for the YouTube logo

const Thisability = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(''); // State for the audio URL

  const audioRef = useRef(null); // Reference to the audio element

  const handleProcess = async () => {
    setLoading(true);
    setError('');
    setAudioUrl(''); // Reset the audio URL before fetching new audio

    try {
      const response = await axios.post('http://localhost:5000/process_voice_command', {
        url: videoUrl,
      }, {
        responseType: 'blob', // Important to handle binary data
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Create a URL for the audio file
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      // Play the audio automatically after it is set
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (err) {
      setError('Error processing the request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-5" style={{ minHeight: "110px" }}>
      <div className='d-flex justify-content-center align-content-center text-center mx-auto'>
        <img src={yt} className='pe-3 pt-1 mt-1' style={{ height: "35px" }} alt="YouTube Logo" />
        <h1 className="text-center mb-5 text-white">YouTube Voice Command</h1>
      </div>

      <div className='bg-white p-5 border rounded-4 border-3'>
        {/* Input field for the YouTube video URL */}
        <div className="form-group mb-4 d-flex align-items-center">
          <input
            type="text"
            className="form-control w-75 h-75 me-3"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube Video URL"
          />
          <button className="btn btn-success mt-1" onClick={handleProcess} disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>

        {/* Display error if any */}
        {error && <p className="text-danger">{error}</p>}

        {/* Display loading spinner */}
        {loading && (
          <div className="d-flex justify-content-center mt-3">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Audio player */}
        {audioUrl && (
          <div className="mt-4">
            <h2>Voice Command</h2>
            <audio ref={audioRef} controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default Thisability;
