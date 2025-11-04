
const KEY  = 'chat.messages.v1';

/**
 * Load stored chat messages from localStorage.
 * @returns {Array<object>} An array of message objects (may be empty).
 */
export function loadMessages() {
  const stored = localStorage.getItem(KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Append a message to the stored chat message array.
 * @param {object} msg - Message object to save (should include id, message, date, ...).
 * @returns {void}
 */
export function saveMessage(msg) {
  const messageArr = loadMessages();
  messageArr.push(msg);
  localStorage.setItem(KEY, JSON.stringify(messageArr));
}

/**
 * Remove all stored chat messages.
 * @returns {void}
 */
export function clearMessages() {
  localStorage.removeItem(KEY);
}

/**
 * Delete a single message by its key (date string used as key).
 * @param {string} key - The ISO date string used as the message key.
 * @returns {void}
 */
export function deleteMessage(key) {
  const arr = loadMessages();
  const next = arr.filter(msg => msg.date !== key);
  localStorage.setItem(KEY, JSON.stringify(next));
}

/**
 * Update the text of an existing message and mark it edited.
 * @param {string} key - The ISO date string key identifying the message.
 * @param {string} newText - The new text content for the message.
 * @returns {boolean} True if update succeeded, false if message not found.
 */
export function updateMessage(key, newText) {
  const arr = loadMessages();
  const i = arr.findIndex(msg => msg.date === key);
  if (i === -1) return false;

  arr[i].message = newText;
  arr[i].edited = true;
  arr[i].editedAt = new Date().toISOString();

  localStorage.setItem(KEY, JSON.stringify(arr));
  return true;
}

/**
 * Trigger a download of the provided data as a JSON file.
 * @param {string} filename - The filename to use for the download.
 * @param {any} data - Data to serialize to JSON.
 * @returns {void}
 */
export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Replace stored messages with the provided array.
 * @param {Array<object>} arr - Array of message objects to import.
 * @returns {number} Number of messages imported (0 if invalid input).
 */
export function importMessages(arr) {
  if (!Array.isArray(arr)) return 0;
  localStorage.setItem(KEY, JSON.stringify(arr));
  return arr.length;
}