/**
 * StashSaarthi Accessibility (A11y) & Screen-Reader Helper Suite
 * Compliant with WCAG 2.1 AA & WAI-ARIA Standards.
 */

type Politeness = "polite" | "assertive";

interface Announcement {
  id: string;
  message: string;
  politeness: Politeness;
}

type Listener = (announcements: Announcement[]) => void;

class ScreenReaderAnnouncerBus {
  private listeners: Set<Listener> = new Set();
  private announcements: Announcement[] = [];

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  announce(message: string, politeness: Politeness = "polite") {
    if (!message) return;
    const id = Math.random().toString(36).substring(2, 9);
    const item: Announcement = { id, message, politeness };
    this.announcements = [item];
    this.listeners.forEach((fn) => fn(this.announcements));
  }
}

export const srAnnouncerBus = new ScreenReaderAnnouncerBus();

/**
 * Programmatically dispatch an announcement to screen readers (e.g. NVDA, JAWS, VoiceOver, TalkBack)
 */
export function announceToScreenReader(message: string, politeness: Politeness = "polite") {
  srAnnouncerBus.announce(message, politeness);
}

/**
 * Handle Enter or Space keydown for custom interactive elements
 */
export function handleEnterOrSpace(callback: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };
}

/**
 * Helper to construct WAI-ARIA tab properties
 */
export function getTabProps(tabId: string, panelId: string, isSelected: boolean) {
  return {
    role: "tab" as const,
    id: tabId,
    "aria-selected": isSelected,
    "aria-controls": panelId,
    tabIndex: isSelected ? 0 : -1,
  };
}

/**
 * Helper to construct WAI-ARIA tabpanel properties
 */
export function getTabPanelProps(tabId: string, panelId: string, isSelected: boolean) {
  return {
    role: "tabpanel" as const,
    id: panelId,
    "aria-labelledby": tabId,
    hidden: !isSelected,
    tabIndex: 0,
  };
}

/**
 * Traps keyboard focus inside a modal or dialog container
 */
export function handleFocusTrap(container: HTMLElement | null, e: KeyboardEvent) {
  if (!container || e.key !== "Tab") return;

  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (!firstElement || !lastElement) return;

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
}

/**
 * Conducts a runtime accessibility check inspecting interactive elements for proper ARIA labeling
 */
export function runScreenReaderAudit(): { passed: number; warnings: string[] } {
  if (typeof window === "undefined") return { passed: 0, warnings: [] };

  const warnings: string[] = [];
  let passed = 0;

  // Inspect interactive buttons and links
  const interactives = document.querySelectorAll<HTMLElement>(
    'button, a, input, select, textarea, [role="button"], [role="tab"]'
  );

  interactives.forEach((el, index) => {
    const textContent = (el.textContent || "").trim();
    const ariaLabel = el.getAttribute("aria-label");
    const ariaLabelledBy = el.getAttribute("aria-labelledby");

    const hasAccessibleName = textContent.length > 0 || !!ariaLabel || !!ariaLabelledBy;

    if (!hasAccessibleName) {
      warnings.push(`Interactive element #${index} (<${el.tagName.toLowerCase()}>) lacks an accessible ARIA label or visible text.`);
    } else {
      passed++;
    }

    // Check custom roles for tabIndex
    const role = el.getAttribute("role");
    if (role && role !== "presentation" && !el.hasAttribute("tabindex") && el.tagName !== "BUTTON" && el.tagName !== "A") {
      warnings.push(`Element with role="${role}" lacks explicit tabindex for keyboard navigation.`);
    }
  });

  return { passed, warnings };
}
