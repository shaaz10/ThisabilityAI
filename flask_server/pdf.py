# pdf.py
from flask import jsonify
import PyPDF2
import os

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, "rb") as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text

def upload_pdf(file):
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith('.pdf'):
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)
        extracted_text = extract_text_from_pdf(file_path)
        os.remove(file_path)  # Optionally delete the file after processing
        return jsonify({"extracted_text": extracted_text}), 200
    else:
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400
