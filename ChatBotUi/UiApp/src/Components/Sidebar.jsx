import React, { useState, useEffect } from "react";
import { Add, ChevronRight, ChevronLeft } from "@carbon/icons-react";
import "../styles/Sidebar.css";

/**
 * Final Sidebar (Full Height)
 * - Toggle button inside sidebar
 * - Collapsed view always visible
 * - Expands smoothly across all devices
 * - Full-page vertical height (no header gap)
 */
const Sidebar = ({ onNewChat }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => setIsExpanded((prev) => !prev);
  const handleOverlayClick = () => isMobile && setIsExpanded(false);

  const sidebarClass = isMobile
    ? `sidebar mobile ${isExpanded ? "show" : ""}`
    : `sidebar ${isExpanded ? "expanded" : "collapsed"}`;

  return (
    <>
      {isMobile && isExpanded && (
        <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
      )}

      <aside className={sidebarClass}>
        {/* Toggle Button (inside sidebar) */}
        <button className="toggle-btn" onClick={handleToggle}>
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* New Chat Button */}
        <button
          className={`new-chat-btn ${
            isExpanded ? "expanded-btn" : "icon-only"
          }`}
          onClick={onNewChat}
        >
          <Add size={20} />
          {isExpanded && <span className="btn-text">New Chat</span>}
        </button>

        {/* Sidebar Content */}
        {isExpanded && (
          <div className="sidebar-body">
            <p className="placeholder-text">No chat history yet</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;