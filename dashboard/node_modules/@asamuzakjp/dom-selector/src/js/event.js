/**
 * event.js
 */

/* constants */
const KEYS_MODIFIER = new Set([
  'Alt',
  'AltGraph',
  'CapsLock',
  'Control',
  'Fn',
  'FnLock',
  'Hyper',
  'Meta',
  'NumLock',
  'ScrollLock',
  'Shift',
  'Super',
  'Symbol',
  'SymbolLock'
]);

/**
 * EventHandler
 * Tracks window events to record recent user interactions.
 */
export class EventHandler {
  /* private fields */
  #window;
  #event;
  #eventHandlers;
  #focusEvent;
  #lastFocusVisible;

  /**
   * @param {Window} window - The window object.
   */
  constructor(window) {
    this.#window = window;
    this.#event = null;
    this.#focusEvent = null;
    this.#lastFocusVisible = null;
    this.#eventHandlers = [
      {
        keys: ['focus', 'focusin'],
        handler: this.handleFocusEvent.bind(this)
      },
      {
        keys: ['keydown', 'keyup'],
        handler: this.handleKeyboardEvent.bind(this)
      },
      {
        keys: ['mouseover', 'mousedown', 'mouseup', 'click', 'mouseout'],
        handler: this.handleMouseEvent.bind(this)
      }
    ];
    this.registerEventListeners();
  }

  /**
   * Gets the most recent non-modifier keyboard or mouse event.
   * @returns {Event|null} The current event object.
   */
  get currentEvent() {
    return this.#event;
  }

  /**
   * Gets the most recent focus event.
   * @returns {Event|null} The current focus event object.
   */
  get currentFocus() {
    return this.#focusEvent;
  }

  /**
   * Gets the node that last had visible focus.
   * @returns {Element|null} The last focused node.
   */
  get lastFocusVisible() {
    return this.#lastFocusVisible;
  }

  /**
   * Sets the node that last had visible focus.
   * @param {Element} node - The node to set as the last visible focus.
   */
  set lastFocusVisible(node) {
    this.#lastFocusVisible = node;
  }

  /**
   * Handles focus events and updates the current focus state.
   * @param {Event} evt - The focus event.
   */
  handleFocusEvent(evt) {
    this.#focusEvent = evt;
  }

  /**
   * Handles keyboard events and updates the current event state.
   * @param {KeyboardEvent} evt - The keyboard event.
   */
  handleKeyboardEvent(evt) {
    const { key } = evt;
    if (!KEYS_MODIFIER.has(key)) {
      this.#event = evt;
    }
  }

  /**
   * Handles mouse events and updates the current event state.
   * @param {MouseEvent} evt - The mouse event.
   */
  handleMouseEvent(evt) {
    this.#event = evt;
  }

  /**
   * Registers all predefined event listeners on the window object.
   */
  registerEventListeners() {
    for (const { keys, handler } of this.#eventHandlers) {
      for (const key of keys) {
        this.#window.addEventListener(key, handler, {
          capture: true,
          passive: true
        });
      }
    }
  }

  /**
   * Removes all registered event listeners and resets all internal states.
   */
  destroy() {
    for (const { keys, handler } of this.#eventHandlers) {
      for (const key of keys) {
        this.#window.removeEventListener(key, handler, { capture: true });
      }
    }
    this.#event = null;
    this.#focusEvent = null;
    this.#lastFocusVisible = null;
  }
}
