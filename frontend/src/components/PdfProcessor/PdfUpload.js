import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PdfUpload.css'; // Import CSS file
import { FaRegFilePdf } from "react-icons/fa6";

function PdfUpload() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);
  let navigate = useNavigate();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setProcessing(true);

      const formData = new FormData();
      formData.append('pdf', file);

      try {
        const response = await axios.post('http://localhost:5000/process_pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setExtractedText(response.data.extracted_text);
        console.log(response.data.extracted_text)
        setProcessing(false);
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('There was an error processing the PDF.');
        setProcessing(false);
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSummarize = () => {
    if (!extractedText) {
      alert('Please upload a PDF first.');
      return;
    }
    navigate('/summarizepdf', { state: { extractedText } });
  };

  const handleTranslate = () => {
    if (!extractedText) {
      alert('Please upload a PDF first.');
      return;
    }
    navigate('/translatepdf', { state: { extractedText } });
  };

  const handleQuickQuiz = () => {
    if (!extractedText) {
      alert('Please upload a PDF first.');
      return;
    }
    navigate('/quickquiz', { state: { extractedText } });
  };
  const handleChatbot = () => {
    if (!extractedText || !pdfFile) {
      alert('Please upload a PDF first.');
      return;
    }
    navigate('/chatbotwithpdf', { state: { extractedText, pdfFile } });
  };

  return (
    <div className="pdf-processor-container"
     
      >
      <h1 className='fw-bold mt-2'> <FaRegFilePdf className='me-2 fs-1 fw-semibold' />PDF Learning </h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button className="uploadbutton" onClick={triggerFileInput}>Upload PDF</button>

      <div className="cards-section">
        <div className="cards" onClick={handleSummarize} style={{minHeight:"300px"}}>
        <img 
            src="https://pedagog.ai/wp-content/uploads/sites/3/2023/11/a-large-stack-of-papers-next-to-one-piece-of-paper-FiAutjCcQ6mPMm2WME62dA-K9ZkXzRyTr2xhQWCFgbUxA.jpeg"
            alt="Summarize" 
            className="card-img  mx-auto" 
          />

          <h4 className='fw-semibold pt-1'>Summarize</h4>
          <p>Summarize the extracted text.</p>
          <button className='mt-4'>Start Summarizing</button>
        </div>
        <div className="cards" onClick={handleTranslate}>
            <img src="https://media.istockphoto.com/id/1251722943/vector/translator-blue-rgb-color-icon-foreign-language-freelance-interpreter-professional.jpg?s=612x612&w=0&k=20&c=VqkluwD6D8ADaX4eCm74QzGF7kdD3ZU5mx7mmZgfVwE=" className="card-img" alt="" />
          <h4 className='fw-semibold pt-1'>Translate</h4>
          <p>Translate the extracted text to another language.</p>
          <button>Start Translating</button>
        </div>
        <div className="cards" onClick={handleQuickQuiz}>
        <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK1cfwYfqwUYr879eD746EWch4dG_q4Hg2Bg&s" 
            alt="Generate Quiz" 
            className="card-img" 
          />
          <h4 className='fw-semibold pt-1'>QuickQuiz</h4>
          <p>Take a quick quiz based on the extracted text.</p>
          <button  >Start Quiz</button>
        </div>
        <div className="cards" onClick={handleChatbot}>
        <img 
            src="https://i.pinimg.com/originals/0c/67/5a/0c675a8e1061478d2b7b21b330093444.gif" 
            alt="Generate Quiz" 
            className="card-img mt-4" 
            
          />
          <h4 className='fw-semibold pt-1 '>ChatBot With PDF</h4>
          <p className='mb-3'>Chat with a bot and explore your PDF for quick answers!</p>
          <button className='mt-4'>Ask the Bot</button>
        </div>
      </div>

    </div>
  );
}

export default PdfUpload;
