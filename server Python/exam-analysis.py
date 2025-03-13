import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS 
import json
from openai import OpenAI 

app = Flask(__name__)
CORS(app)

load_dotenv()
my_api_key = os.getenv("OPENAI_API_KEY")


os.environ['OPENAI_API_KEY'] = my_api_key

client = OpenAI()
my_model = "gpt-4o-mini"

def grade_exam(student_exam, teacher_exam):
    prompt = f"""
    תלמידה ענתה על המבחן הבא:
    {student_exam}

    התשובות הנכונות הן:
    {teacher_exam}

    אנא תן ציון מדויק באחוזים לתשובות של התלמידה והסבר את הציון. אם התשובות של התלמידה נכונות, גם אם הן שונות מהתשובות של המורה, אנא ציין זאת כ"נכון",  והסבר שהן כוללות את המידע הבסיסי הנדרש. 
    אם התשובות נכונות אך חסרות פרטים זניחים , יש לציין זאת, אך לא להוריד ציונים  .
    אם יש בהן חלק שגוי לחלוטין אז יש להוריד בציון
    """
    
    response = client.chat.completions.create(
        model=my_model,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ])
    
    return response.choices[0].message.content

@app.route('/grade', methods=['OPTIONS'])
def options():
    return jsonify({'status': 'ok'}), 200

@app.route('/grade', methods=['POST'])
def grade():
    data = request.json
    student_exam_path = data.get('student_exam_path')
    teacher_exam_path = data.get('teacher_exam_path')
    
    if not student_exam_path or not teacher_exam_path:
        return jsonify({"error": "Both student_exam_path and teacher_exam_path are required."}), 400
    
    # קריאת תוכן הקבצים
    try:
        with open(student_exam_path, 'r', encoding='utf-8') as student_file:
            student_exam = student_file.read()

        with open(teacher_exam_path, 'r', encoding='utf-8') as teacher_file:
            teacher_exam = teacher_file.read()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    grade_result = grade_exam(student_exam, teacher_exam)
    response = jsonify({"grade": grade_result})
    return response

if __name__ == '__main__':
    app.run(debug=True)