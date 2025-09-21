// content.js

const backendApiUrl = "https://YOUR CLOUD FUNCTION LINK.cloudfunctions.net/analyze_content"; 

function extractTextFromPost(postElement) {
    return postElement.innerText || "";
}

function addFactifyIcon(postElement, postText) {
    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('images/factify_icon.png');
    icon.style.width = '20px';
    icon.style.height = '20px';
    icon.style.cursor = 'pointer';
    icon.style.marginLeft = '10px';
    icon.title = 'Analyze with Factify';

    icon.addEventListener('click', () => {
        // Here, we check for a valid connection before sending the message
        try {
            chrome.runtime.sendMessage({ action: "openPopupAndAnalyze", text: postText });
            // Check if the message failed due to the context being invalidated
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    postElement.appendChild(icon);
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
            mutation.addedNodes.forEach((node) => {
                // Ensure the node is an element and matches our selector
                if (node.nodeType === 1 && node.matches("div[data-testid='tweet']")) {
                    console.log("New social media post detected:", node);
                    const postText = extractTextFromPost(node);
                    addFactifyIcon(node, postText);
                }
            });
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

console.log("Factify content script loaded and observing for new posts.");