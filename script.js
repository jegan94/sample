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
  chatbotIcon.addEventListener("click", function () {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none"; // Hide chat icon
  });

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
    const points = message.split(/[\n•\-]\s*/).filter(p => p.trim() !== "");
  
    for (const point of points) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "bot", "bullet");
      messageElement.innerHTML = `• <span class="typing-text"></span>`;
      chatbotMessages.appendChild(messageElement);
  
      const span = messageElement.querySelector(".typing-text");
  
      for (let i = 0; i < point.length; i++) {
        span.textContent += point[i];
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 25)); // typing speed
      }
  
      // Add a little delay between points
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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
          messages: [
            {
              role: "system",
              content: "You are a support assistant for CHIKKU, a tech platform offering home/office IT services like Computer Repair, Software Installation, Networking Support, Server & Storage Management, and Printer Solutions. Only respond to questions related to these services. If the user's question is unrelated to CHIKKU's services, reply with: 'I'm here to help with CHIKKU-related IT services only.'"
            },
            { role: "user", content: userMessage }
          ],
          max_tokens: 1500,
        }),
      });

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        await typeBotMessage("Sorry, I didn't get a response from the server. Please try again.");
        return;
      }

      const botMessage = data.choices[0].message.content;

      // Optional: Filter further to avoid off-topic responses
      const serviceKeywords = ["computer", "repair", "software", "network", "printer", "server", "storage", "IT", "support", "CHIKKU"];
      const isRelevant = serviceKeywords.some(keyword => botMessage.toLowerCase().includes(keyword));

      if (!isRelevant) {
        appendMessage("bot", "I'm here to help with CHIKKU-related IT services only.");
        return;
      }

      await typeBotMessage(botMessage);
      //appendMessage("bot", botMessage);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      await typeBotMessage("Sorry, something went wrong. Please try again.");
    }
  }
});
