document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.querySelector(".footer__msg input");
  const sendButton = document.querySelector("#chat-submit");
  const chatContainer = document.querySelector("main");

  // Function to update chat UI
  function updateChatUI(message, isUser = true) {
    const chatDiv = document.createElement("div");
    chatDiv.className = isUser ? "question" : "answer";

    chatDiv.innerHTML = `
      <div class="${isUser ? "question__msg" : "answer__msg"}">
        ${message}
      </div>
      <div class="${isUser ? "question__time" : "answer__time"}">
        ${new Date().toLocaleTimeString()}
      </div>
    `;

    chatContainer.appendChild(chatDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
  }

  // Function to handle send message
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add message to UI
    updateChatUI(message, true);

    // Clear input field
    chatInput.value = "";

    // Optional: Send message to server
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message }),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  // Event listener for send button
  sendButton.addEventListener("click", sendMessage);

  // Optional: Fetch chat history from server
  async function fetchChatHistory() {
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();
      data.chat_history.forEach((chat) => {
        updateChatUI(chat.message, chat.sender === "user");
      });
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }

  // Initialize chat history
  fetchChatHistory();
});
