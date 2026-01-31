# Email Draft Writer – Personal AI Content Assistant

## Live Demo
https://email-draft-writer-4ox9.vercel.app/

---

## Product Brief

Email Draft Writer is a web-based AI content assistant designed to help users quickly generate clear, professional emails. Writing effective emails often takes more time than expected because users must consider tone, structure, and clarity while avoiding vague or overly casual language. This tool simplifies that process by allowing users to describe their goal, choose a tone, and provide key context, then instantly receive a well-structured email draft.

The target users are students and early-career professionals who frequently write emails to professors, managers, clients, or teammates. These users may know what they want to say but struggle with how to phrase it professionally. The tool’s approach is effective because it enforces a simple and repeatable structure (purpose, context, request, and closing), supports tone selection, and allows rapid refinement through regeneration. Instead of rewriting emails from scratch, users can adjust their inputs and generate improved versions in seconds. This results in clearer communication, reduced anxiety around writing, and more consistent professional messaging.

---

## How to Use

- Open the Live Demo link above.
- Enter the **Purpose** of the email.
- Select a **Tone** (formal, friendly, urgent, etc.).
- Add **Key details or context** such as dates, constraints, or requests.
- Click **Generate** to create the email draft.
- Modify inputs and click **Regenerate** to refine the result.
- Copy or download the final email.

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (single-page web application)
- **AI API:** OpenAI API
- **Backend:** Vercel Serverless Function (`/api/generate`) for secure API requests
- **Deployment:** Vercel
- **AI Coding Assistant:** ChatGPT

---

## Reflection 

Using an AI coding assistant significantly accelerated development by helping generate UI layouts, JavaScript logic, and API integration code. Instead of focusing on syntax, I could focus on product decisions and user experience. The most challenging part of the project was deployment and configuration, especially learning how to securely handle API keys using environment variables and debugging issues related to deployment and caching. This process helped me understand the importance of separating frontend and backend responsibilities. If I were to build version 2.0, I would add saved draft history, reusable templates for common scenarios (such as extension requests), and separate subject-line generation to better match real-world email workflows.
