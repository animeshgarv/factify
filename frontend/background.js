// background.js

function getPostContent() {
    // This is a placeholder. You'll need to pass the correct selector
    // and context from your content.js file to get the correct post
    return document.body.innerText || "";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // This listener handles messages from the content script AND the popup
    if (request.action === "getPostTextToAnalyze") {
        const tabId = request.tabId;

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: getPostContent
        }, (injectionResults) => {
            const postContent = injectionResults && injectionResults[0] && injectionResults[0].result ? injectionResults[0].result : '';

            // This is the CRUCIAL part: The API call is now in the background script
            const backendApiUrl = "https://YOUR CLOUD FUNCTION LINK.cloudfunctions.net/analyze_content";
            
            fetch(backendApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // The background script doesn't have the same CORS issues as a popup
                    // but it's good practice to ensure the backend allows it
                },
                body: JSON.stringify({ text_to_analyze: postContent }),
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response from backend:", data);
                // Send the final data back to the popup
                sendResponse({ explanation: data.explanation });
            })
            .catch(error => {
                console.error("Error from backend:", error);
                sendResponse({ explanation: "Error analyzing post. Check background logs." });
            });
        });
        return true; // Indicates an asynchronous response
    }
});