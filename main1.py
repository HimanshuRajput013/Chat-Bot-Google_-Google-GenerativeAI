from dotenv import load_dotenv
from fastapi import FastAPI, Form,  File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from io import BytesIO
import google.generativeai as genai
from google.generativeai.types.safety_types import HarmCategory, HarmBlockThreshold
import PyPDF2
import docx
import csv

# Load environment variables from .env file (if any)
load_dotenv()

class Response(BaseModel):
    result: str


SAFETY_SETTINGS = {
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
}

genai.configure(api_key=os.environ["API_KEY"])

model = genai.GenerativeModel("gemini-pro", safety_settings=SAFETY_SETTINGS)
model_image = genai.GenerativeModel('gemini-pro-vision')



def extract_text_from_pdf(contents):
    pdf_reader = PyPDF2.PdfReader(BytesIO(contents))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(contents):
    doc = docx.Document(BytesIO(contents))
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text


def read_csv_contents(contents):
    content_str = contents.decode() if isinstance(contents, bytes) else contents
    csv_file = csv.reader(content_str.splitlines())
    csv_data = []
    for row in csv_file:
        csv_data.append(row)

    # Convert CSV data to text
    text = '\n'.join(','.join(row) for row in csv_data)
    return text

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict", response_model=Response)
async def predict(question: str  = Form(None), file: UploadFile = File(None)) -> Response:
    try:
        if file:
            contents = await file.read()
            print('file read')
            if file.filename.endswith('.txt'):
                text = contents.decode()
                print(text)
            elif file.filename.endswith('.csv'):
                text = read_csv_contents(contents)
                print(text)
            elif file.filename.endswith('.pdf'):
                text = extract_text_from_pdf(contents)
                print(text)
            elif file.filename.endswith('.docx'):
                text = extract_text_from_docx(contents)
                print(text)

            else:
                raise ValueError("Unsupported file format")
        else:
            text = ""

        if question is None:
            input_text = text
        elif isinstance(question, str):
            input_text = question + "\n" + text
        else:
            raise ValueError("Invalid input type")
        # Generate content using Gemini API
        response = model.generate_content(input_text)
        generated_text = response._result.candidates[0].content.parts[0].text

    except AttributeError as e:
        print("Error:", e)
        generated_text = "An error occurred during content generation."

    return JSONResponse(content={"result": generated_text})