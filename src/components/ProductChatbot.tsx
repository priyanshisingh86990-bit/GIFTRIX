import { useState } from "react";

export default function ProductChatbot({ productName }: { productName: string }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: `Hi! Ask me anything about ${productName} 😊` }
  ]);
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    // 👉 simple smart replies
    let botReply = `AI Suggestion : ${productName} is great for gifting`;


    if (input.toLowerCase().includes("price")) {
      botReply = "This product costs ₹5,999 💸";
    } else if (input.toLowerCase().includes("gift")) {
      botReply = "Perfect for birthday & festive gifting 🎁";
    } else if (input.toLowerCase().includes("material")) {
      botReply = "It is made with premium decorative materials ✨";
    }

    const botMessage = { sender: "bot", text: botReply };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  }

  return (
    <div className="bg-white border border-violet-100 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-2">💬 Product Assistant</h3>

      {/* Chat messages */}
      <div className="h-40 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm px-3 py-2 rounded-lg w-fit max-w-[80%] ${
              msg.sender === "user"
                ? "ml-auto bg-violet-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this product..."
          className="flex-1 px-3 py-2 border border-violet-200 rounded-lg text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}