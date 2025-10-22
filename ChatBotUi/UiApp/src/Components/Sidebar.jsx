import React, { useState, useEffect } from "react";
import { Add, ChevronRight, ChevronLeft } from "@carbon/icons-react";
import "../styles/Sidebar.css";

/**
 * Sidebar component
 *
 * Desktop behavior:
 * - toggles between "collapsed" and "expanded" (width changes)
 *
 * Mobile behavior (<= 768px):
 * - sidebar becomes a fixed overlay (uses .mobile and .show)
 * - toggle button is fixed and always visible
 *
 * We keep the toggle button always in the DOM but add a class depending
 * on whether we're in mobile view so the CSS positions it appropriately.
 */
const Sidebar = ({ onNewChat }) => {
  const [isExpanded, setIsExpanded] = useState(false); // desktop expand/collapse or mobile open/close
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);

  // update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle behavior:
  // - on mobile, toggle opens/closes overlay (we'll reuse isExpanded state)
  // - on desktop, toggle collapses/expands width
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // close only for mobile
  const handleCloseMobile = () => {
    if (isMobile && isExpanded) setIsExpanded(false);
  };

  // Determine classes to apply to sidebar element:
  // - mobile: always add 'mobile', add 'show' when expanded
  // - desktop: 'expanded' or 'collapsed'
  const sidebarClass = isMobile
    ? `sidebar mobile ${isExpanded ? "show" : ""}`
    : `sidebar ${isExpanded ? "expanded" : "collapsed"}`;

  return (
    <>
      {/* Toggle button always in DOM */}
      <button
        className={`toggle-btn ${isMobile ? "mobile-toggle" : "desktop-toggle"}`}
        onClick={handleToggle}
        aria-label={isExpanded ? "Close sidebar" : "Open sidebar"}
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Mobile overlay (closes when tapped) */}
      {isMobile && isExpanded && <div className="sidebar-overlay" onClick={handleCloseMobile} />}

      <aside className={sidebarClass}>
        {/* New Chat Button - keep icon + text; text show depends on desktop expansion */}
        <button
          className={`new-chat-btn ${!isMobile && isExpanded ? "expanded-btn" : "icon-only"}`}
          onClick={onNewChat}
          aria-label="New chat"
        >
          <Add size={20} />
          {/* On desktop: show text when expanded. On mobile: we always show text to improve discoverability when open */}
          {(!isMobile && isExpanded) || (isMobile && isExpanded) ? (
            <span className="btn-text">New Chat</span>
          ) : null}
        </button>

        {/* Sidebar body: only show the chat list when desktop expanded (keeps original behavior).
            For mobile, you can later render the list when the sidebar is open. */}
        {(!isMobile && isExpanded) && (
          <div className="sidebar-body">
            <p className="placeholder-text">No chat history yet</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;