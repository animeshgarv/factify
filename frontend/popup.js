const backendApiUrl = "https://YOUR CLOUD FUNCTION LINK.cloudfunctions.net/analyze_content";

document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const analysisResult = document.getElementById('analysisResult');
    const errorDisplay = document.getElementById('error');

    analyzeBtn.addEventListener('click', async () => {
        errorDisplay.textContent = '';
        analysisResult.innerHTML = '';
        loadingSpinner.style.display = 'block'; // Show the spinner
        analyzeBtn.disabled = true;

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            const injectionResults = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getSelectedText,
            });

            const textToAnalyze = injectionResults[0].result;

            if (!textToAnalyze) {
                analysisResult.innerHTML = '<p>Please select some text to analyze.</p>';
                loadingSpinner.style.display = 'none'; // Hide the spinner
                analyzeBtn.disabled = false;
                return;
            }

            const response = await fetch(backendApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text_to_analyze: textToAnalyze })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            analysisResult.innerHTML = `<div class="result-title">Analysis from Factify:</div>${data.analysis}`;

        } catch (e) {
            console.error('Error:', e);
            errorDisplay.textContent = `Error: ${e.message}`;
        } finally {
            loadingSpinner.style.display = 'none'; // Hide the spinner on completion or error
            analyzeBtn.disabled = false;
        }
    });
});

function getSelectedText() {
    return window.getSelection().toString();
}