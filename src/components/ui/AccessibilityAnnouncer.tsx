import { useState, useEffect } from "react";
import { srAnnouncerBus } from "@/lib/accessibility";

export function AccessibilityAnnouncer() {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  useEffect(() => {
    return srAnnouncerBus.subscribe((announcements) => {
      const latest = announcements[0];
      if (!latest) return;

      if (latest.politeness === "assertive") {
        setAssertiveMessage(latest.message);
        setTimeout(() => setAssertiveMessage(""), 3000);
      } else {
        setPoliteMessage(latest.message);
        setTimeout(() => setPoliteMessage(""), 3000);
      }
    });
  }, []);

  return (
    <div className="sr-only" aria-hidden="false">
      {/* Polite live region for standard screen-reader updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>

      {/* Assertive live region for immediate alert notifications */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </div>
  );
}
