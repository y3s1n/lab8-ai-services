import "./view.js";
import * as model from "./model.js";
import { sendToAI } from "./apiClient.js";

/**
 * Controller module: wires the chat view events to model and backend API calls.
 * - Listens for 'messageSent' and forwards messages to the AI backend.
 * - Handles edit/delete/import/export/clear actions and delegates to `model` and `view`.
 */
const view = document.querySelector('chat-view');

view.addEventListener('messageSent', async (e) => {
    const userMessage = e.detail;
    model.saveMessage(userMessage);
    view.addUserMsg(userMessage);

    
    const providerSelect = document.getElementById('providerSelect');
    const provider = providerSelect?.value?.toLowerCase() || 'eliza';

    try {
        const { reply } = await sendToAI(userMessage.message, provider);

    
        const botText = {
            id: 'bot',
            message: reply,
            date: new Date()
        };

        model.saveMessage(botText);
        view.addBotMsg(botText);
    } catch (error) {
        console.error('Error in controller messageSent:', error);
        const botError = {
            id: 'bot',
            message: '[Error: could not reach AI backend]',
            date: new Date()
        };
        model.saveMessage(botError);
        view.addBotMsg(botError);
    }
}); 

view.addEventListener('requestEdit', (e) => {
    const {key, currentText } = e.detail;
    const next = window.prompt('Edit your message:', currentText);
    if(next === null) return;
    const trimmed = next.trim();
    if (trimmed === '' || trimmed === currentText) return;

    const ok = model.updateMessage(key, trimmed);
    if (ok) view.updateMsgByKey(key, trimmed, true);

});

view.addEventListener('deleteMessage', (e) => {
    const {key} = e.detail;
    model.deleteMessage(key);
    view.removeMsgByKey(key);
});

view.addEventListener('clearChat', () => {
    model.clearMessages();
});

view.addEventListener('exportChat', () => {
    const data = model.loadMessages();
    const filename = `chat-export-${new Date().toISOString().slice(0,19)}.json`;
    model.downloadJSON(filename, data);
});

view.addEventListener('importChat', (e) => {
    const payload = e.detail.data;

    const arr = Array.isArray(payload) ? payload : Array.isArray(payload.messages) ? payload.messages : null;
    if (!arr) {
        alert('Unsupported import format.');
        return;
    }

    const count = model.importMessages(arr);
    view.chatBox.innerHTML = '';
    arr.forEach(msg => {
        if (msg.id === 'user') view.addUserMsg(msg);
        else if (msg.id === 'bot') view.addBotMsg(msg);
    });
    alert(`Imported ${count} messages.`)
});

