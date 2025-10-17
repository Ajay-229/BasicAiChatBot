import React, { useState } from "react";
import { Add, ChevronRight, ChevronLeft } from "@carbon/icons-react";
import "../styles/Sidebar.css";

const Sidebar = ({ onNewChat }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      {/* Toggle Button */}
      <button
        className="toggle-btn"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* New Chat Button */}
      <button
        className={`new-chat-btn ${isExpanded ? "expanded-btn" : "icon-only"}`}
        onClick={onNewChat}
      >
        <Add size={20} />
        {isExpanded && <span className="btn-text">New Chat</span>}
      </button>

      {/* Future Chat List Placeholder */}
      {isExpanded && (
        <div className="sidebar-body">
          <p className="placeholder-text">No chat history yet</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;