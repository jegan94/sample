// script.js
document.addEventListener("DOMContentLoaded", function () {
    const chatbotContainer = document.getElementById("chatbot-container");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");
  
    const chatbotIcon = document.getElementById("chatbot-icon");
    const closeButton = document.getElementById("close-btn");
  
    // Toggle chatbot visibility when clicking the icon
    // Show chatbot when clicking the icon
    chatbotIcon.addEventListener("click", function () {
      chatbotContainer.classList.remove("hidden");
      chatbotIcon.style.display = "none"; // Hide chat icon
    });
  
    // Also toggle when clicking the close button
    closeButton.addEventListener("click", function () {
      chatbotContainer.classList.add("hidden");
      chatbotIcon.style.display = "flex"; // Show chat icon again
    });
  
    sendBtn.addEventListener("click", sendMessage);
    chatbotInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  
    function sendMessage() {
      const userMessage = chatbotInput.value.trim();
      if (userMessage) {
        appendMessage("user", userMessage);
        chatbotInput.value = "";
        getBotResponse(userMessage);
      }
    }
  
    function appendMessage(sender, message) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", sender);
      messageElement.textContent = message;
      chatbotMessages.appendChild(messageElement);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function typeBotMessage(message) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "bot");
      chatbotMessages.appendChild(messageElement);
    
      for (let i = 0; i < message.length; i++) {
        messageElement.textContent += message[i];
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 20)); // Typing speed (ms per character)
      }
    }
  
    async function getBotResponse(userMessage) {
      const apiKey = "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";
      const apiUrl = "https://api.openai.com/v1/chat/completions";
  
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            store: true,
            messages: [
              { role: "system", content: "You are a laptop service expert. Only respond with information related to laptop services, repairs, maintenance, and troubleshooting. If the user's question is not related to laptop services, respond with 'I can only help with laptop service-related questions.'" },
              { role: "user", content: userMessage }
            ],
            max_tokens: 15000,
          }),
        });
  
        const data = await response.json();
  
        if (!data.choices || data.choices.length === 0) {
          console.error("Invalid API response:", data);
          appendMessage("bot", "Sorry, I didn't get a response from the server. Please try again.");
          return;
        }
  
        const botMessage = data.choices[0].message.content;
        // Check if the response is related to laptop services
        if (!botMessage.toLowerCase().includes("laptop") && !botMessage.toLowerCase().includes("computer")) {
          appendMessage("bot", "I can only help with laptop service-related questions.");
          return;
        }
  
        appendMessage("bot", botMessage);
      } catch (error) {
        console.error("Error fetching bot response:", error);
        appendMessage("bot", "Sorry, something went wrong. Please try again.");
      }
    }
  });
  