import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './SummarizePdf.css';  // Import the CSS file for styling

function SummarizePdf() {
  const { state } = useLocation();
  const [extractedText, setExtractedText] = useState(state?.extractedText || '');
  const [summary, setSummary] = useState('');
  const [formattedSummary, setFormattedSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (extractedText) {
      setLoading(true);
      // Step 1: Send the extracted text to the Flask backend for summarization
      const summarizeText = async () => {
        try {
          const response = await axios.post('http://localhost:5000/summarize_pdf_text', { extracted_text: extractedText });
          setSummary(response.data.summary); // Set the summary from the backend
        } catch (error) {
          console.error('Error during summarization:', error);
        } finally {
          setLoading(false);
        }
      };

      summarizeText();
    }
  }, [extractedText]);

  // Function to format the summary text
  const formatSummaryText = (text) => {
    // Split the text into parts based on '**' and '*' to identify headings and points
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/).filter(part => part.trim() !== '');
    
// Iterate over the parts to build a formatted HTML structure
const formattedParts = parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Handle headings: remove '**' and use <h3> for headings
      const headingText = part.slice(2, -2);
      return `<h3>${headingText}</h3>`;
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      // Handle list items: remove '*' and use <li> for list items
      const listItemText = part.slice(1, -1);
      return `<ul><li>${listItemText}</li></ul>`;
    } else {
      // For normal text, just wrap it in <p> tags
      return `<p>${part}</p>`;
    }
  });
  

    return formattedParts.join('');
  };

  useEffect(() => {
    if (summary) {
      const formattedText = formatSummaryText(summary);
      setFormattedSummary(formattedText);
    }
  }, [summary]);

  return (
    <div className="summarize-pdf-container">
      <h2 className="summarize-title">Summarized PDF</h2>
      {loading ? (
        <p className="loading-message">Summarizing...</p>
      ) : (
        <div className="summary-container">
          <h3 className="summary-heading">Summary</h3>
          <div className="summary-text" dangerouslySetInnerHTML={{ __html: formattedSummary }}></div>
        </div>
      )}
    </div>
  );
}

export default SummarizePdf;
