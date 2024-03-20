This project is a web application that utilizes Google GenerativeAI to predict content based on a user's question and an optional uploaded file. Users can submit a question and upload a text file (.txt), CSV file (.csv), PDF document (.pdf), or docx document (.docx) for the model to consider when generating content.

![Screenshot 2024-03-21 032210](https://github.com/HimanshuRajput013/chat-bot-google_api/assets/131947510/15b4aa13-2720-4895-881d-22ade6d5a1cc)


Clone this repository:


git clone https://github.com/<your-username>/<your-repository-name>.git

Use code with caution.
Install dependencies:


cd <your-repository-name>
pip install requirements.txt
Use code with caution.

Prerequisites

A Google Cloud project with the GenerativeAI API enabled. Refer to Google Cloud documentation on how to enable GenerativeAI: [invalid URL removed]
An API key for the GenerativeAI API. Refer to Google Cloud documentation on how to create an API key: https://cloud.google.com/docs/authentication/getting-started
Configuration

Create a file named .env in the project root directory and add the following line, replacing <YOUR_API_KEY> with your actual API key:

API_KEY=<YOUR_API_KEY>
Running the application

Start the backend server:
.

uvicorn main:app --reload
Use code with caution.

The frontend application is a basic React application and is not included in this repository. You can develop your own frontend to interact with the backend API at 

http://localhost:8000/predict
Using the Google GenerativeAI API

This project utilizes Google GenerativeAI to generate content. Refer to the Google GenerativeAI documentation for more details on the API and its capabilities.
