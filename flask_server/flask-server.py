import re
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import os
import google.generativeai as genai
from dotenv import load_dotenv
from gtts import gTTS
from io import BytesIO
import traceback
import PyPDF2
import threading
import time
import json

# Load environment variables for Gemini API key
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = Flask(__name__)
extracted_PDF_text = None
CORS(app)
model = genai.GenerativeModel("gemini-1.5-flash")


def get_gemini_response(prompt):
    """Fetches response from Gemini API."""
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        app.logger.error(f"Gemini API error: {e}")
        return f"Error fetching response from Gemini API: {str(e)}"

def extract_video_id(video_url):
    """Extracts the video ID from various YouTube URL formats."""
    video_id_patterns = [
        r"(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w\-]{11})",  # Standard YouTube URL
        r"^[\w\-]{11}$"  # Direct video ID
    ]
    for pattern in video_id_patterns:
        match = re.search(pattern, video_url)
        if match:
            return match.group(1) if match.lastindex else video_url  # Return matched ID or original if it's an ID
    
    raise ValueError("Invalid YouTube URL or Video ID format. Please provide a valid YouTube link or 11-character video ID.")

def fetch_youtube_transcript(video_url, language='en'):
    """Fetches transcript from a YouTube video and translates it if needed."""
    try:
        video_id = extract_video_id(video_url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        app.logger.info(f"Fetched transcript for video ID: {video_id}")
        transcript_text = " ".join([entry['text'] for entry in transcript])

        if language != 'en':
            app.logger.info(f"Translating transcript to {language}")
            translated_text = get_gemini_response(f"Translate this text to {language}: {transcript_text}")
            return translated_text
        return transcript_text

    except Exception as e:
        app.logger.error(f"Error fetching transcript: {e}")
        return f"Error fetching transcript: {str(e)}"

def generate_speech(summary):
    """Generates speech from the given summary using gTTS."""
    try:
        tts = gTTS(text=summary, lang='en')
        mp3_fp = BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        return mp3_fp
    except Exception as e:
        app.logger.error(f"gTTS error: {e}")
        raise

@app.route('/process_video', methods=['POST'])
def process_video():
    try:
        data = request.json
        video_url = data.get('url')
        operation = data.get('operation')  # operation: transcript, translate, summarize, bullet_points, or question
        language = data.get('language', 'en')  # default to English for translation
        perspective = data.get('perspective', '')  # perspective: student or teacher
        question = data.get('question', '')  # user question

        if not video_url:
            return jsonify({"error": "No URL provided"}), 400
        
        transcript = fetch_youtube_transcript(video_url, language)
        if "Error" in transcript:
            return jsonify({"error": transcript}), 500

        # Handle operations
        if operation == 'transcript':
            return jsonify({"transcript": transcript})

        if operation == 'translate':
            return jsonify({"translation": transcript})

        if operation == 'summarize':
            if perspective == 'student':
                response = get_gemini_response(f"Summarize this text for a student: {transcript}")
            elif perspective == 'teacher':
                response = get_gemini_response(f"Summarize this text for a teacher: {transcript}")
            else:
                return jsonify({"error": "Invalid perspective for summary"}), 400
            return jsonify({"summary": response})

        if operation == 'bullet_points':
            # Generate bullet points from the summary
            summary_response = get_gemini_response(f"Summarize this text: {transcript}")
            bullet_points_response = get_gemini_response(f"Generate bullet points from this summary: {summary_response}")
            return jsonify({"bullet_points": bullet_points_response})

        if operation == 'question':
            if not question:
                return jsonify({"error": "No question provided"}), 400
            response = get_gemini_response(f"Answer this question based on the video transcript: {question}\n\nTranscript: {transcript}")
            return jsonify({"answer": response})

        return jsonify({"error": "Invalid operation"}), 400

    except Exception as e:
        app.logger.error(f"Error in process_video: {str(e)}")
        traceback.print_exc()  # Print full traceback to the terminal
        return jsonify({"error": str(e)}), 500

@app.route('/process_voice_command', methods=['POST'])
def process_voice_command():
    try:
        data = request.get_json()
        video_url = data.get('url')

        transcript = fetch_youtube_transcript(video_url)
        if "Error" in transcript:
            return jsonify({"error": transcript}), 500

        # Generate summary from transcript
        summary = get_gemini_response(f"Summarize this text: {transcript}")

        # Generate speech using gTTS
        mp3_fp = generate_speech(summary)

        # Return the MP3 file as a response
        return send_file(mp3_fp, mimetype="audio/mpeg", as_attachment=False, download_name="voice_command.mp3")

    except Exception as e:
        app.logger.error(f"Error in process_voice_command: {str(e)}")
        traceback.print_exc()  # Print full traceback to the terminal
        return jsonify({'error': str(e)}), 500


def extract_text_from_pdf(file):
    """Extracts text from a PDF file."""
    text = ""
    pdf_reader = PyPDF2.PdfReader(file)
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    return text

@app.route('/process_pdf', methods=['POST'])
def process_pdf():
    global extracted_PDF_text
    try:
        # Get the PDF file from the request
        file = request.files.get('pdf')
        if not file:
            return jsonify({"error": "No PDF file provided"}), 400
        
        extracted_PDF_text = extract_text_from_pdf(file)
        
        return jsonify({"extracted_text": extracted_PDF_text})

    except Exception as e:
        app.logger.error(f"Error processing PDF: {str(e)}")
        traceback.print_exc()  # Print full traceback to the terminal
        return jsonify({"error": str(e)}), 500

def translate_pdf_text(text, language):
    """Translates the given text into the specified language."""
    try:
        # Assuming you want to use Gemini for translation
        translated_text = get_gemini_response(f"Translate this text to {language}: {text}")
        return translated_text
    except Exception as e:
        app.logger.error(f"Error in translate_pdf_text: {e}")
        return f"Error in translation: {str(e)}"

@app.route('/translate_pdf_text', methods=['POST'])
def translate_pdf_text_route():
    try:
        data = request.json
        extracted_text = data.get('extracted_text')
        language = data.get('language', 'en')  # Default to English if no language specified

        if not extracted_text:
            return jsonify({"error": "No text provided"}), 400

        # Translate the extracted text
        translated_text = translate_pdf_text(extracted_text, language)
        return jsonify({"translated_text": translated_text})

    except Exception as e:
        app.logger.error(f"Error in translate_pdf_text_route: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/summarize_pdf_text', methods=['POST'])
def summarize_pdf_text():
    try:
        data = request.json
        extracted_text = data.get('extracted_text')

        if not extracted_text:
            return jsonify({"error": "No extracted text provided"}), 400
        
        # Call Gemini API for summarization
        summary = get_gemini_response(f"Summarize the following text in long: {extracted_text}")
        return jsonify({"summary": summary})

    except Exception as e:
        app.logger.error(f"Error in summarize_pdf_text: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



def generate_main_points(text):
    main_points = model.generate_content(f"Return the main points in the following text: {text}")
    
    if hasattr(main_points, 'text'):
        main_points_text = main_points.text
        print("## Main Points of the Text:\n", main_points_text)
        return main_points_text
    else:
        print("Error: main_points does not contain 'text'. Check API response format.")
        return ""

# Function to generate quiz data based on the main points
def generate_quiz(main_points_text):
    quiz = model.generate_content(
        f"Return a dictionary with keys 'question', 'answer', and 'options'. Generate 5 multiple-choice questions on the following main points: {main_points_text}. "
        "Each question should have 4 options and a correct answer."
    )
    
    if hasattr(quiz, 'text') and quiz.text:
        clean_text = quiz.text.strip('```json\n').strip('```')
        try:
            quiz_dict = json.loads(clean_text)
            return quiz_dict
        except json.JSONDecodeError:
            print("Failed to decode JSON from generated quiz data. Raw response:", quiz.text)
            return [{"error": "Invalid JSON format from quiz generation."}]
    return []

# Route to accept extracted text and generate quiz
@app.route('/api/quiz', methods=['POST'])
def get_quiz():
    # Receive the extracted text from the frontend (QuickQuiz component)
    text = request.json.get('text')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Generate main points from the extracted text
    main_points_text = generate_main_points(text)
    
    if not main_points_text:
        return jsonify({"error": "Failed to generate main points"}), 500
    
    # Generate quiz based on the main points
    quiz_data = generate_quiz(main_points_text)
    
    return jsonify(quiz_data)

# Route to submit answers and evaluate
@app.route('/api/evaluate', methods=['POST'])
def evaluate_answers():
    user_answers = request.json.get('answers')
    quiz_data = request.json.get('quiz')  # Receive quiz data from frontend (passed along with answers)
    
    if not quiz_data:
        return jsonify({"error": "No quiz data provided"}), 400
    
    score = 0
    for idx, question in enumerate(quiz_data):
        user_answer = user_answers.get(str(idx + 1))  # User answer is in the form of {"1": "option 1", "2": "option 3", ...}
        correct_answer = question.get('answer')
        
        if user_answer == correct_answer:
            score += 1

    total_questions = len(quiz_data)
    return jsonify({
        'score': score,
        'total': total_questions
    })


@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_query = data.get('user_query')
    extracted_text = data.get('extracted_text')
    # Get response from Gemini API
    response = response = get_gemini_response(f"Answer this question {user_query}  without any headings in simple manner")
    return jsonify({"answer": response})



if __name__ == '__main__':
    app.run(debug=True)