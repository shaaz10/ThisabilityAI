import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import yt from '../../assets/yt.png';  // Adjust the path for the YouTube logo
import { FaRegQuestionCircle } from "react-icons/fa";

const VideoProcessor = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [output, setOutput] = useState('');
  const [fullText, setFullText] = useState('');  // Store the complete text here
  const [operation, setOperation] = useState('');
  const [language, setLanguage] = useState('en');
  const [perspective, setPerspective] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle character reveal effect
  useEffect(() => {
    let index = 0;
    if (fullText) {
      setOutput('');  // Reset output before starting
      const interval = setInterval(() => {
        setOutput((prev) => prev + fullText[index]);
        index++;
        if (index === fullText.length) {
          clearInterval(interval);
        }
      }, 2); // Adjust speed by changing interval time
      return () => clearInterval(interval);
    }
  }, [fullText]);

  const handleProcess = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    setFullText('');

    try {
      const response = await axios.post('http://localhost:5000/process_video', {
        url: videoUrl,
        operation,
        language,
        perspective,
        question,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      let result = '';
      if (operation === 'transcript') result = response.data.transcript;
      else if (operation === 'translate') result = response.data.translation;
      else if (operation === 'summarize') result = response.data.summary;
      else if (operation === 'bullet_points') result = response.data.bullet_points;
      else if (operation === 'question') result = response.data.answer;

      setFullText(result);  // Set the complete text to reveal
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
        <h1 className="text-center mb-5 text-white">YouTube Video Processor</h1>
      </div>

      <div className='bg-white p-5 border rounded-4 border-3'>
        <div className="form-group mb-4">
          <input
            type="text"
            className="form-control"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube Video URL"
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="mb-4">
          <button
            className={`btn ${operation === 'transcript' ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
            onClick={() => { setOperation('transcript'); handleProcess(); }}
          >
            Transcript
          </button>
          <button
            className={`btn ${operation === 'translate' ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
            onClick={() => setOperation('translate')}
          >
            Translate
          </button>
          <button
            className={`btn ${operation === 'summarize' ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
            onClick={() => setOperation('summarize')}
          >
            Summarize
          </button>
          <button
            className={`btn ${operation === 'bullet_points' ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
            onClick={() => { setOperation('bullet_points'); handleProcess(); }}
          >
            Bullet Points
          </button>
          <button
            className={`btn ${operation === 'question' ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
            onClick={() => setOperation('question')}
          >
            Ask a Question
          </button>
        </div>

        {operation === 'translate' && (
          <div className="form-group mb-4 w-25">
            <label>Select Language for Translation</label>
            <select
              className="form-control"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
            </select>
            <button className="btn btn-dark mt-3 w-50" onClick={handleProcess} disabled={loading}>
              {loading ? 'Translating...' : 'Submit'}
            </button>
          </div>
        )}

        {operation === 'summarize' && (
          <div className="mt-3">
            <h5>Select Summary Perspective:</h5>
            <button
              className={`btn ${perspective === 'student' ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
              onClick={() => setPerspective('student')}
            >
              Student
            </button>
            <button
              className={`btn ${perspective === 'teacher' ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
              onClick={() => setPerspective('teacher')}
            >
              Teacher
            </button>
            <button className="btn btn-dark mx-2" onClick={handleProcess} disabled={loading}>
              {loading ? 'Summarizing...' : 'Submit'}
            </button>
          </div>
        )}

        {operation === 'question' && (
          <div className="form-group mt-5 w-75 mx-auto">
            <label className='text-center fs-5'>Ask a Question <FaRegQuestionCircle className='fs-5 text-primary-emphasis' /></label>
            <input
              type="text"
              className="form-control"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button className="btn btn-dark mt-3 w-25 mx-auto d-block" onClick={handleProcess} disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        )}

        {output && (
          <div className="mt-4">
            <h2>{operation.charAt(0).toUpperCase() + operation.slice(1)}</h2>
            <textarea
              className="form-control"
              value={output}
              readOnly
              rows={10}
            ></textarea>
          </div>
        )}

        {loading && (
          <div className="d-flex justify-content-center mt-3">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoProcessor;
