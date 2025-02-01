import React from 'react';
import { useLocation } from 'react-router-dom';
import PdfPreview from './PdfPreview';
import Chatbot from './Chatbot';

const ChatbotWithPDF = () => {
  const { state } = useLocation();
  const { pdfFile } = state || {};

  return (
    <div className="d-flex flex-wrap chatbot " style={{backgroundColor:"#2f2f2f"}}>
      <PdfPreview pdfFile={pdfFile}  />
      <Chatbot />
    </div>
  );
};

export default ChatbotWithPDF;
