import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './TranslatePdf.css'; // Import the CSS file for styling

function TranslatePdf() {
  const [extractedText, setExtractedText] = useState('');
  const [language, setLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.extractedText) {
      setExtractedText(location.state.extractedText);
    }
  }, [location]);

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/translate_pdf_text', {
        extracted_text: extractedText,
        language: language,
      });

      if (response.data.translated_text) {
        setTranslatedText(response.data.translated_text);
      } else {
        alert('Error in translation');
      }
    } catch (error) {
      console.error('Error translating:', error);
      alert('Error during translation.');
    }
    setIsLoading(false);
  };

  return (
    <div className="translate-container mx-auto mt-3 mb-3">
      <h3 className="title pt-3 fw-semibold">Translate PDF Text</h3>

      <div className="form-group">
        <label htmlFor="language-select">Choose Language:</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="te">Telugu</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <button onClick={handleTranslate} disabled={isLoading} className="translate-button w-50 mx-auto d-block">
        {isLoading ? 'Translating...' : 'Translate Text'}
      </button>

      {translatedText && (
        <div className="translated-text-container">
          <h3>Translated Text:</h3>
          <pre className="translated-text">{translatedText}</pre>
        </div>
      )}
    </div>
  );
}

export default TranslatePdf;
