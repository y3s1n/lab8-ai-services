import { getStoredOpenAIKey, getUserOpenAIKey } from './userKeyManager.js';

/**
 * Custom element <chat-view> responsible for chat UI interactions.
 * Provides methods for sending, editing, deleting, importing/exporting messages
 * and managing provider selection.
 */
export class chatView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.form = this.querySelector('#chatForm');
        this.textarea = this.querySelector('#messageBox');
        this.sendBtn = this.querySelector('#sendBtn');
        this.chatBox = this.querySelector('.chatBox');
        this.toggleBtn = this.querySelector('#toggleBtn');
        this.clearBtn = this.querySelector('.clearBtn');
        this.sideBar = this.querySelector('#sideBar');
        this.providerSelect = this.querySelector('#providerSelect');
        this.lastProvider = this.providerSelect?.value || 'eliza';
        
        

   
        this.attachListeners();

    }

    attachListeners() {
        this.sendBtn.addEventListener('click', this.onSend);
        this.textarea.addEventListener('keydown', this.onEnter);
        this.toggleBtn.addEventListener('click', this.onToggle);
        this.clearBtn.addEventListener('click', this.onClear);
        this.chatBox.addEventListener('click', this.onChatDelete);
        this.chatBox.addEventListener('click', this.onChatEdit);
        this.sideBar.addEventListener('click', this.onExport);
        this.sideBar.addEventListener('click', this.onImport);
        this.providerSelect.addEventListener('change', this.onProviderChange);

    }



    // Handlers
    onProviderChange = (e) => this.changeProvider(e);
    onImport = (e) => this.importChat(e);
    onExport = (e) => this.exportChat(e);
    onClear = () => this.clearChat();
    onChatDelete = (e) => this.deleteMsg(e);
    onChatEdit = (e) => this.editMsg(e);
    onCreate = () => this.CreateChat();
    onSend = ()  => this.sendMessage();
    onEnter = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            this.sendMessage();
        }
    };
    onToggle = () => {
        this.closest('.box').classList.toggle('is-open');
    }


    //CRUD Methods

    importChat(e) {
        /**
         * Handle importing a chat JSON file selected by the user.
         * Dispatches an 'importChat' event with the parsed data on success.
         * @param {Event} e - Click event originating from the import button.
         */
        const btn = e.target.closest('.importBtn');
        if (!btn) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = (ev) => {
            const file = ev.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    this.dispatchEvent(new CustomEvent('importChat', { detail: {data}}));
                } catch (err) {
                    alert('Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    exportChat(e) {
        /**
         * Dispatch an exportChat event to request the controller/model export.
         * @param {Event} e - Click event from the export button.
         */
        const btn = e.target.closest('.exportBtn');
        if (!btn) return;

        this.dispatchEvent(new CustomEvent('exportChat'));
    }


    editMsg(e) {
        /**
         * Request editing of a user's message. Dispatches 'requestEdit' with key and currentText.
         * @param {Event} e - Click event from the edit button.
         */
        const btn = e.target.closest('.editBtn');
        if (!btn) return;

        const block = btn.closest('.userMsg');
        if (!block) return;

        const key = block.dataset.key;
        const currentText = block.querySelector('.message.user').textContent;

        this.dispatchEvent(new CustomEvent('requestEdit', {detail: {key, currentText}}));
    }
    deleteMsg(e) {
        /**
         * Delete a user's message after confirmation. Dispatches 'deleteMessage' with the message key.
         * @param {Event} e - Click event from the delete button.
         */
       
        const del = e.target.closest('.deleteBtn');
        if (!del) return;

         if (!(window.confirm("Are you sure you want to delete this message?"))) return;

        const block = del.closest('.userMsg');
        if (!block) return;

        const key = block.dataset.key;
        this.dispatchEvent(new CustomEvent('deleteMessage', {detail: {key}}));

    }
    clearChat() {
    /**
     * Clear the chat UI and notify listeners via 'clearChat' event.
     * Asks for confirmation before clearing.
     * @returns {void}
     */
       if (!(window.confirm("Are you sure you want to clear the chat?"))) return;


        this.dispatchEvent(new CustomEvent('clearChat'));   
        this.chatBox.innerHTML = '';
    }

    // Functions

     sendMessage() {
        /**
         * Assemble the current textarea contents as a user message and dispatch 'messageSent'.
         * Clears the textarea and focuses it after dispatch.
         * @returns {void}
         */
        const providerSelect = this.querySelector('#providerSelect');
        const selectedProvider = providerSelect ? providerSelect.value : 'eliza';
        const userText = {
            id: 'user',
            message: this.textarea.value,
            date: new Date(),
            provider: selectedProvider,
        };

        this.dispatchEvent(new CustomEvent('messageSent', {detail: userText}));

        this.textarea.value = '';
        this.textarea.focus();

        
    }

    formatDate(dateLike) {
        /**
         * Format a date-like value into a short time string for display.
         * @param {string|Date|number} dateLike - Input compatible with Date constructor.
         * @returns {string} Localized time string.
         */
        const d = new Date(dateLike);
        return d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    }

     addUserMsg(text) {
        /**
         * Render a user's message block into the chat box.
         * @param {object} text - Message object containing id, message and date.
         * @returns {void}
         */
    

        
        const userMsg = document.createElement('div');
        userMsg.className = 'userMsg';

     
        const theMessage = document.createElement('div');
        theMessage.className = `message ${text.id}`; 
        theMessage.textContent = text.message;

        const meta = document.createElement('div');
        meta.className = 'metaData';

     
        const time = document.createElement('time');
        time.className = `timestamp ${text.id}`;
        const d = new Date(text.date);
        const key = d.toISOString();
        userMsg.dataset.key = key;
        time.dateTime = key;
        time.textContent = this.formatDate(d); 

  
        const actions = document.createElement('div');
        actions.className = 'actions';

     
        const editBtn = document.createElement('button');
        editBtn.className = 'editBtn';
        editBtn.textContent = 'edit';

       
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'deleteBtn';
        deleteBtn.textContent = '🗑️';

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        meta.appendChild(time);
        meta.appendChild(actions);

        userMsg.appendChild(theMessage);
        userMsg.appendChild(meta);

        this.chatBox.appendChild(userMsg);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;

    }

    addBotMsg(text) {
    /**
     * Render a bot message (or system message) into the chat box.
     * @param {object} text - Message object containing id, message and date.
     * @returns {void}
     */
        
        const theMessage = document.createElement('div');
        theMessage.className = `message ${text.id}`;
        theMessage.textContent = text.message;
        

        const time = document.createElement('time');
        time.className = `timestamp ${text.id}`;

        const d = new Date(text.date);
        time.dateTime = d.toISOString();
        time.textContent = this.formatDate(d);
        
        this.chatBox.appendChild(theMessage);
        this.chatBox.appendChild(time);


        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    removeMsgByKey(key) {
        /**
         * Remove a user message from the DOM identified by its datetime key.
         * @param {string} key - ISO datetime string used as the message key.
         * @returns {void}
         */
        const block = this.chatBox.querySelector(`.userMsg [datetime="${key}"]`).closest('.userMsg');
        if (block) block.remove();
    }

    updateMsgByKey(key, newText, edited=false) {
        /**
         * Update a message's text in the DOM and mark it as edited when requested.
         * @param {string} key - Message key (ISO datetime string).
         * @param {string} newText - New text content for the message.
         * @param {boolean} [edited=false] - Whether to show an edited tag.
         * @returns {void}
         */
        const block = this.chatBox.querySelector(`.userMsg[data-key="${key}"]`);
        if (!block) return;

        const msgEl = block.querySelector('.message.user');
        if (msgEl) msgEl.textContent = newText;

        if (edited) {
            const meta = block.querySelector('.metaData');
            if (!meta) return;
        
            let editedTag = meta.querySelector('.editedTag');
            if (!editedTag) {
                editedTag = document.createElement('span');
                editedTag.className = 'editedTag';
                editedTag.textContent = ' (edited)';
                const timeEl = meta.querySelector('time');
                if (timeEl && timeEl.nextSibling) {
                    meta.insertBefore(editedTag, timeEl.nextSibling);
                } else {
                    meta.appendChild(editedTag);
                }
            }
        }
    
    }

    async changeProvider(e) {
        /**
         * Handle provider selection changes. If OpenAI is selected, prompt for a key if none stored.
         * @param {Event} e - Change event from the provider select element.
         * @returns {Promise<void>}
         */
        const sel = e.target.value;

        if (sel === 'openai') {
            try {
                if (!getStoredOpenAIKey()) {
                    await getUserOpenAIKey();
                }
                this.lastProvider = 'openai';
            } catch {
                alert('OpenAI key not provided');
                e.target.value = this.lastProvider;
                return;
            }
        } else {
            this.lastProvider = sel;
        }
    }
}

customElements.define('chat-view', chatView);