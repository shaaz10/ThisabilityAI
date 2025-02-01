# app.py
from flask import Flask, request, jsonify
from flask_server import fetch_youtube_transcript, generate_speech
from pdf import upload_pdf
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/process_video', methods=['POST'])
def process_video():
    try:
        data = request.json
        video_url = data.get('url')
        operation = data.get('operation')
        language = data.get('language', 'en')  # default to English for translation

        if not video_url:
            return jsonify({"error": "No URL provided"}), 400

        transcript = fetch_youtube_transcript(video_url, language)
        if "Error" in transcript:
            return jsonify({"error": transcript}), 500

        # Handle different operations
        if operation == 'transcript':
            return jsonify({"transcript": transcript})

        if operation == 'summarize':
            # This can be expanded as needed
            summary = f"Summary of the video: {transcript[:500]}..."  # Example summary logic
            return jsonify({"summary": summary})

        if operation == 'speech':
            mp3_fp = generate_speech(transcript)
            return send_file(mp3_fp, mimetype="audio/mpeg", as_attachment=False, download_name="summary.mp3")

        return jsonify({"error": "Invalid operation"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload_pdf', methods=['POST'])
def upload_pdf_route():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['pdf_file']
    return upload_pdf(file)

if __name__ == '__main__':
    app.run(debug=True)
