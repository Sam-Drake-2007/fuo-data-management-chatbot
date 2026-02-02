/* content.jsx */

import { useState } from 'react'

export default function ContentPage() {
    
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [history, setHistory] = useState([[], []]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() === "" || isLoading) return;
        const newMessage = { text: input, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const currentInput = input;
        setInput("");
        setIsLoading(true);

        const historyParam = encodeURIComponent(JSON.stringify(history));

        const response = await fetch(`http://localhost:8000/generate?prompt=${encodeURIComponent(currentInput)}&history=${historyParam}`, {
            method: "POST",
        });

        const data = await response.json();
        const botMessage = { text: data.response, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        setHistory(prev => [
            [...prev[0], currentInput],  // Append input to first list (Index 0)
            [...prev[1], data.response]  // Append response to second list (Index 1)
        ]);

        setIsLoading(false);
    }
    
    return (
        <div className="chat-container">
            <header>Welcome to the Content Page</header>
            
            <div className="chat-messages">
                { messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                )) }
            </div>

            <form onSubmit={handleSubmit} className='input-area'>
                <input  
                    type="text" 
                    placeholder="Type your message here..." 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    autoFocus 
                />
                <button 
                    onClick={(e) => handleSubmit(e)}
                >
                Send
                </button>
            </form>
        </div>
    );
}