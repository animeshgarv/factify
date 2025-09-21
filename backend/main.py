import os
import functions_framework
import google.generativeai as genai
from flask import jsonify
from google.generativeai.types.generation_types import StopCandidateException
from google.api_core.exceptions import GoogleAPIError, BadRequest

@functions_framework.http
def analyze_content(request):
    """
    HTTP Cloud Function that analyzes text for misinformation using the Gemini API.
    """
    # Set CORS headers for the preflight request
    # Using '*' for the hackathon to ensure it works out-of-the-box.
    allowed_origin = '*'
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': allowed_origin,
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': allowed_origin
    }

    try:
        request_json = request.get_json(silent=True)
        if not request_json or 'text_to_analyze' not in request_json:
            return jsonify({
                "error": "Invalid request: Missing 'text_to_analyze' in the JSON body."
            }), 400, headers

        text_to_analyze = request_json['text_to_analyze']
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
             return jsonify({
                "error": "API key not configured in environment variables."
            }), 500, headers
            
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-pro')

        prompt = (
            f"Analyze the following text for potential misinformation, factual claims that need "
            f"verification, or logical fallacies. Provide a clear, concise summary of your "
            f"findings and rate the text's credibility on a scale from 1 (highly misleading) "
            f"to 5 (highly credible). The text is: {text_to_analyze}"
        )
        
        response = model.generate_content(prompt)
        
        return jsonify({
            "analysis": response.text,
            "status": "success"
        }), 200, headers
        
    except (StopCandidateException, GoogleAPIError, BadRequest) as e:
        print(f"Gemini API Error: {e}")
        return jsonify({
            "error": "An error occurred with the Gemini API.",
            "details": str(e)
        }), 500, headers
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return jsonify({
            "error": "An unexpected error occurred."
        }), 500, headers