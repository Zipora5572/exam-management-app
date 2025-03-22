import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from google.cloud import storage
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io
from openai import OpenAI
import requests
import json
import base64
from email.mime.text import MIMEText
from google.oauth2 import service_account
from googleapiclient.discovery import build


app = Flask(__name__)
CORS(app)
SERVICE_ACCOUNT_FILE = "./client_secret.json"
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


load_dotenv()
my_api_key = os.getenv("OPENAI_API_KEY")
os.environ['OPENAI_API_KEY'] = my_api_key

credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path

client = OpenAI()
my_model = "gpt-4o-mini"

def send_email(to_email, grade, evaluation):
    print("Sending email")
    from_email = os.getenv("EMAIL_USER")  
    password = os.getenv("EMAIL_PASSWORD")  
   
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = 'תוצאות המבחן שלך'

    body = f'ציון: {grade}\nהערכה: {evaluation}'
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(from_email, password)
            server.send_message(msg)
        print("Email sent successfully")
    except Exception as e:
        print(f'Error sending email: {str(e)}')


def grade_exam(student_exam, teacher_exam):
    prompt = f"""
    תלמידה ענתה על המבחן הבא:
    {student_exam}

    התשובות הנכונות הן:
    {teacher_exam}

    אנא תן ציון מדויק באחוזים לתשובות של התלמידה והסבר את הציון. אם התשובות של התלמידה נכונות, גם אם הן שונות מהתשובות של המורה, אנא ציין זאת כ"נכון",  והסבר שהן כוללות את המידע הבסיסי הנדרש. 
    אם התשובות נכונות אך חסרות פרטים זניחים , יש לציין זאת, אך לא להוריד ציונים  .
    אם יש בהן חלק שגוי לחלוטין אז יש להוריד 
     החזר את התשובות בפורמט JSON כך:
     ללא הוספת המילה JSON 
     התשובה צריכה להתחיל ישר ב 
    {{
        "grade": "ציון באחוזים",
        "evaluation": "הערכה במילים"
    }}
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

def download_blob(bucket_name, blob_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    image_data = blob.download_as_bytes()
    return Image.open(io.BytesIO(image_data))

@app.route('/grade', methods=['OPTIONS'])
def options():
    return jsonify({'status': 'ok'}), 200


@app.route('/grade', methods=['POST'])
def grade():
    data = request.json
    student_exam_name = data.get('student_exam_name')
    teacher_exam_name = data.get('teacher_exam_name')
    student_email = data.get('student_email')
    if not student_exam_name or not teacher_exam_name:
        return jsonify({"error": "Both student_exam_url and teacher_exam_url are required."}), 400

    try:

        student_exam_image = download_blob("exams-bucket", student_exam_name)
        teacher_exam_image = download_blob("exams-bucket", teacher_exam_name)

        student_exam = pytesseract.image_to_string(student_exam_image)
        teacher_exam = pytesseract.image_to_string(teacher_exam_image)
        # student_exam_image = Image.open(student_exam_url)
        
        # student_exam = pytesseract.image_to_string(student_exam_image)
      
        # teacher_exam_image = Image.open(teacher_exam_url)

        # teacher_exam = pytesseract.image_to_string(teacher_exam_image)
       
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    grade_result = grade_exam(student_exam, teacher_exam)
   
    
    try:
        print("grade_result  ",grade_result)
        result_json = json.loads(grade_result)
        print("result  ",result_json)
        grade = result_json.get("grade")
        evaluation = result_json.get("evaluation")
        response = jsonify({
            "grade": grade,
            "evaluation": evaluation
        })

    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode the response from the model."}), 500

    # send_email(student_email, grade, evaluation)

    return response


if __name__ == '__main__':
    app.run(debug=True)
