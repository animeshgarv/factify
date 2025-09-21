# factify
A Multimodal Fact-Checking Extension
Factify is a powerful Chrome extension that leverages the latest advancements in AI to combat misinformation. It provides users with instant, on-demand analysis of claims found in text, images, and videos on any webpage. By connecting to a dedicated backend powered by the Google Gemini API, it provides a clear credibility score and a concise summary, all without leaving the current page.

✨ Features
Multimodal Analysis: Analyze text snippets, images, and video content for misinformation and factual inaccuracies.

Intuitive UI: A clean, minimalist popup provides a clear credibility score (1-5) and a brief analysis summary.

Seamless Interaction: Analyze content with a single click or a simple right-click, providing a fluid user experience.

Robust Backend: Utilizes Google Cloud Functions and a background script to ensure analysis is completed reliably and quickly, even on long-running tasks.

Secure Architecture: Designed with a zero-trust policy in mind, keeping sensitive API keys secure and separating the core logic from the user interface.

🚀 How to Use
Analyze Text: Select a paragraph or a few sentences on any webpage and click the "Analyze Selected Text" button in the extension popup.

Analyze Image: Right-click on any image on a webpage and select "Analyze image with Factify" from the context menu.

Analyze Video: Open the extension popup on a page with video content and click the "Analyze Video" button to get an analysis based on the page's metadata and context.


⚙️ Technologies Used
Frontend: HTML, CSS, JavaScript (Chrome Extension API)

Backend: Python, Google Cloud Functions

AI Model: Google Gemini 1.5 Pro


💻 Installation and Deployment
Follow these steps to deploy and run your own version of the Factify extension.

Set up the Backend:

Create a new project on the Google Cloud Console.

Enable the Cloud Functions API and the Generative Language API.

Set the GEMINI_API_KEY as an environment variable for your Cloud Function.


Deploy the backend using the gcloud command:

Bash

gcloud functions deploy analyze_content \
--runtime python311 \
--trigger-http \
--allow-unauthenticated \
--set-env-vars GEMINI_API_KEY="YOUR_API_KEY_HERE"


Install the Extension:

Open Chrome and navigate to chrome://extensions.

Enable Developer mode in the top-right corner.

Click Load unpacked and select the extension folder from this repository.

Note: The extension will be assigned a unique ID. Your Cloud Function is configured to work with a wildcard (*) for hackathon purposes. For production, you must update the allowed_origin in main.py with your extension's specific ID.

🚧 Future Enhancements
Advanced Video Analysis: Implement scraping for comments and transcript data from specific platforms like YouTube for a deeper analysis.

Real-time Analysis: Provide a live, continuous analysis of social media feeds or news articles.

Enhanced UI: Add a dashboard to track a history of fact-checked claims.

Rate Limiting: Add a rate-limiting layer to the Cloud Function to prevent abuse and manage API costs.
