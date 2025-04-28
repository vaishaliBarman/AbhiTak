import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "Guest";
    setUserName(storedName);

    // Fetch chat history from backend
    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = { sender: userName, message };
    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h3>Live Chat</h3>
      <div style={{ height: "200px", overflowY: "auto", border: "1px solid gray", padding: "5px", backgroundColor: "#e1e9b7" }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <p key={index} style={{ textAlign: msg.sender === userName ? "right" : "left" }}>
              <b>{msg.sender}:</b> {msg.message}
            </p>
          ))
        ) : (
          <p>No messages yet...</p>
        )}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

