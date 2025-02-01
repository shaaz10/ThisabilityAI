import os
from dotenv import load_dotenv
import json
import PyPDF2
import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS

# Initialize Flask app and enable CORS
app = Flask(_name_)
CORS(app, resources={r"/api/": {"origins": ""}})

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

# Load PDF text and extract main points using the Gemini model
pdf_text = extract_text_from_pdf("/Users/shaazhussain/Desktop/snist_hackathon/UNIT-4 CN(TL).pdf")
main_points = model.generate_content(f"Return the main points in the following text: {pdf_text}")
if hasattr(main_points, 'text'):
    main_points_text = main_points.text
    print("## Main Points of the Text:\n", main_points_text)
else:
    main_points_text = ""
    print("Error: main_points does not contain 'text'. Check API response format.")

# Function to generate quiz data
def generate_quiz():
    quiz = model.generate_content(
        f"Return a dictionary with keys 'question', 'answer', and 'options'. Generate 5 multiple-choice questions on the following main points: {main_points_text}. "
        "Each question should have 4 options and a correct answer."
    )
    
    # Attempt to parse the quiz response
    if hasattr(quiz, 'text') and quiz.text:
        clean_text = quiz.text.strip('json\n').strip('')
        try:
            quiz_dict = json.loads(clean_text)
            return quiz_dict
        except json.JSONDecodeError:
            print("Failed to decode JSON from generated quiz data. Raw response:", quiz.text)
            # Provide fallback response or parse as plain text
            return [{"error": "Invalid JSON format from quiz generation."}]
    return []

# Route to get quiz questions
@app.route('/api/quiz', methods=['GET'])
def get_quiz():
    quiz_data = generate_quiz()
    return jsonify(quiz_data)

# Route to submit answers and evaluate
@app.route('/api/evaluate', methods=['POST'])
def evaluate_answers():
    user_answers = request.json.get('answers')
    quiz_data = generate_quiz()  # Generate or fetch saved quiz data
    
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

if _name_ == '_main_':
    app.run(debug=True)