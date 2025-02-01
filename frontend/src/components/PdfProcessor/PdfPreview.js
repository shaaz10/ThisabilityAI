import React from 'react';
import { FaRegFilePdf } from 'react-icons/fa6';

const PdfPreview = ({ pdfFile }) => {
  return (
    <div className="w-75 p-3 mx-auto">
      <div className="bg-light p-3 rounded shadow-sm h-100">
        <h4><FaRegFilePdf /> PDF Preview</h4>
        <div className="d-flex justify-content-center">
          {/* PDF Preview */}
          <embed
            src={URL.createObjectURL(pdfFile)}  // Render the uploaded PDF file
            type="application/pdf"
            width="100%"
            height="500px"
            alt="PDF Preview"
            className="rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
