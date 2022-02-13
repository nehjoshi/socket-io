import React, { useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import InputEmoji from "react-input-emoji";

function Chat({ socket, name, id }) {
    const [message, setMessage] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const [typing, setTyping] = React.useState("");

    const SendMessage = async () => {
        const date = new Date(Date.now());
        const hours = date.getHours();
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        const timeString = hours + ":" + minutes;
        if (message !== "") {
            const messageData = {
                id,
                from: name,
                message,
                time: timeString
            }
            await socket.emit("send_message", messageData);
            setMessages(messages => [...messages, messageData]);
            setMessage("");
        }
    }

    const handleChangeMessage = (message) => {
        setMessage(message);
        if (message===""){
            socket.emit("not_typing", { name, id });
        }
        else {
            socket.emit("typing", { name, id });    
        }
    }
    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data);
            setMessages(messages => [...messages, data]);
            setTyping(false);
        })
        socket.on("typing", name => {
            const str = name + " is typing...";
            setTyping(str);
        })
        socket.on("not_typing", () => {
            setTyping("");
        })

    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messages.map((msg) => {
                        return (
                            <div className="message" id={name === msg.from ? "you" : "other"} >
                                <div>
                                    <div className="message-content">
                                        <p>{msg.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{msg.time}</p>
                                        <p id="author">{msg.from}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <p id="typing">{typing}</p>
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                {/* <input 
            type="text" 
            value={message}
            placeholder="Type your message here..." 
            onChange={handleChangeMessage}
            onKeyPress={e => {e.key === "Enter" && SendMessage()}}
            /> */}
                <InputEmoji
                    value={message}
                    onChange={text => handleChangeMessage(text)}
                    className="input"
                    onEnter = {message => SendMessage(message)}
                    placeholder="Type a message"
                />
                <button onClick={SendMessage}>&#9658;</button>
            </div>

        </div>
    )
}

export default Chat;