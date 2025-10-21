// src/components/Chat/MessageBubble.jsx
import React, { useRef, useEffect } from "react";
import {
  Copy as CopyIcon,
  TrashCan as DeleteIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from "@carbon/icons-react";
import "../../styles/MessageBubble.css";
import { useChat } from "../../Context/ChatContext";

const MessageBubble = ({ id, sender, text }) => {
  const isUser = sender === "user";
  const {
    handleDeleteMessage,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    editingMessageId,
    editText,
    setEditText,
  } = useChat();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const isEditing = editingMessageId === id;

  // 🧠 Dynamic vertical auto-resize for textarea
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, window.innerHeight * 0.4)}px`;
    }
  }, [editText]);

  const handleEditChange = (e) => {
    setEditText(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, window.innerHeight * 0.4)}px`;
  };

  return (
    <div className={`message-row ${isUser ? "user" : "ai"}`}>
      {/* Normal message bubble */}
      <div
        className={`message-bubble ${isUser ? "user-bubble" : "ai-bubble"} ${
          isEditing ? "editing" : ""
        }`}
      >
        {!isEditing && <pre className="message-text">{text}</pre>}
      </div>

      {/* Edit box (below bubble) */}
      {isEditing && (
        <div className="edit-mode-container">
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={handleEditChange}
            className="edit-textarea"
            placeholder="Edit your message..."
            autoFocus
          />
          <div className="edit-actions">
            <button onClick={handleSaveEdit} className="save-edit-btn">
              <SendIcon size={16} />
              Send
            </button>
            <button onClick={handleCancelEdit} className="cancel-edit-btn">
              <CloseIcon size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hover actions */}
      {!isEditing && (
        <div className={`message-actions ${isUser ? "user-actions" : "ai-actions"}`}>
          <div className="icon-wrapper">
            <button onClick={handleCopy} className="icon-btn">
              <CopyIcon size={16} />
              <span className="tooltip">Copy</span>
            </button>

            {isUser && (
              <button
                onClick={() => handleStartEdit(id, text)}
                className="icon-btn edit-btn"
              >
                <EditIcon size={16} />
                <span className="tooltip">Edit</span>
              </button>
            )}

            {isUser && (
              <button
                onClick={() => handleDeleteMessage(id)}
                className="icon-btn delete-btn"
              >
                <DeleteIcon size={16} />
                <span className="tooltip">Delete</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;