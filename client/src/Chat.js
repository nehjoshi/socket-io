import React, { useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Picker from 'emoji-picker-react';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function Chat({ socket, name, id }) {
    const [message, setMessage] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const [typing, setTyping] = React.useState("");
    const [showPicker, setShowPicker] = React.useState(false);

    const SendMessage = async () => {
        const date = new Date(Date.now());
        const hours = date.getHours();
        setShowPicker(false);
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

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
        if (e.target.value === "") {
            socket.emit("not_typing", { name, id });
        }
        else {
            socket.emit("typing", { name, id });
        }
    }
    const onEmojiClick = (e, emojiObj) => {
        setMessage(message => message + emojiObj.emoji);
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
        <>
            <div className="chat-window">
                <div className="chat-header">
                    <p>Logged in as: {name}</p>
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
                    <FontAwesomeIcon icon={faFaceSmile} className="expand-emoji-icon" onClick={() => setShowPicker(!showPicker)} />
                    <input
                        type="text"
                        value={message}
                        className="input"
                        placeholder="Type your message here..."
                        onChange={handleChangeMessage}
                        onKeyPress={e => { e.key === "Enter" && SendMessage() }}
                    />
                    <FontAwesomeIcon icon={faPaperPlane} onClick={SendMessage} className="send-icon" />
                </div>
            </div>
            {showPicker && <Picker onEmojiClick={onEmojiClick} />}
        </>
    )
}

export default Chat;