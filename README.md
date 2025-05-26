# 🤖 AI-Powered Hiring Assistant

![AI Hiring Assistant Banner](assets/banner.gif)

An intelligent, fully automated hiring platform that streamlines the recruitment process using AI-driven workflows, voice-based coding interviews, and real-time candidate evaluation.

---

## 🚀 Features

* **🧑‍💼 Admin Panel**: Create job roles with specific timelines and requirements.
* **👨‍💻 Candidate Portal**: Apply to job roles and participate in coding interviews.
* **⏰ Automated Scheduling**: Utilizes `APScheduler` to manage the hiring workflow based on predefined timelines.
* **📄 Resume Evaluation**: Parses and ranks resumes using AI models.
* **🧠 Voice-Based Coding Interviews**: Conducts live coding interviews using voice inputs, transcribed and evaluated by ML models.
* **📧 Automated Communication**: Sends emails to candidates at each stage of the hiring process.
* **📊 Real-Time Insights**: Provides hiring managers with up-to-date analytics and candidate progress.

---

## 🖥️ Tech Stack

![Python](https://img.shields.io/badge/Python-3.9-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.70.0-green.svg)
![APScheduler](https://img.shields.io/badge/APScheduler-3.7.0-orange.svg)
![Vapi](https://img.shields.io/badge/Vapi-Voice_Processing-red.svg)
![LLM](https://img.shields.io/badge/LLM-Model_Evaluation-purple.svg)

---

## 📈 Workflow Overview

1. **Job Creation**: HR creates a job role with specific timelines.
2. **Resume Collection**: Candidates submit resumes within the defined period.
3. **Resume Evaluation**: AI models parse and rank resumes; top candidates are selected.
4. **Coding Round**: Selected candidates participate in voice-based coding interviews.
5. **Evaluation**: ML models assess coding responses and provide feedback.
6. **Interview Round**: Top performers are invited for the final HR interview.
7. **Hiring Decision**: Final selections are made, and offers are extended.

---

## 🛠️ Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/ai-hiring-assistant.git
   cd ai-hiring-assistant
   ```



2. **Create a Virtual Environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```



3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```



4. **Run the Application**

   ```bash
   uvicorn main:app --reload
   ```
---
