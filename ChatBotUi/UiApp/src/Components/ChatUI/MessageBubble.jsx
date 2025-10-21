import React from "react";
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

  return (
    <div className={`message-row ${isUser ? "user" : "ai"}`}>
      <div
        className={`message-bubble ${isUser ? "user-bubble" : "ai-bubble"} ${
          isEditing ? "editing" : ""
        }`}
      >
        {/* 🟢 Normal message display */}
        {!isEditing && <pre className="message-text">{text}</pre>}

        {/* ✏️ Edit mode */}
        {isEditing && (
          <div className="edit-container">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-textarea"
              placeholder="Edit your message..."
              autoFocus
            />
            <div className="edit-actions">
              <button onClick={handleSaveEdit} className="edit-send-btn">
                <SendIcon size={16} />
                <span className="tooltip">Send</span>
              </button>
              <button onClick={handleCancelEdit} className="edit-cancel-btn">
                <CloseIcon size={16} />
                <span className="tooltip">Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hover icons on right side */}
      {!isEditing && (
        <div className={`message-actions ${isUser ? "user-actions" : "ai-actions"}`}>
          <div className="icon-wrapper">
            <button onClick={handleCopy} className="icon-btn">
              <CopyIcon size={16} />
              <span className="tooltip">Copy</span>
            </button>

            {/* Edit only for user messages */}
            {isUser && (
              <button onClick={() => handleStartEdit(id, text)} className="icon-btn edit-btn">
                <EditIcon size={16} />
                <span className="tooltip">Edit</span>
              </button>
            )}

            {/* Delete only for user messages */}
            {isUser && (
              <button onClick={() => handleDeleteMessage(id)} className="icon-btn delete-btn">
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