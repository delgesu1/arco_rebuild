// Chat module encapsulating AI chat functionality
(function(global) {
  // Private state
  let currentConversationId = null;
  const conversations = {};
  let inDepthMode = false;

  // Auto-resize textarea based on content
  function autoResize(textarea) {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = newHeight + 'px';
    const wrapper = textarea.closest('.chat-input-wrapper');
    if (wrapper) {
      if (newHeight > 60) wrapper.classList.add('expanded');
      else wrapper.classList.remove('expanded');
    }
  }

  // Enable/disable send button
  function updateChatSendButton() {
    const input = document.querySelector('.chat-input');
    const btn = document.getElementById('chatSendBtn');
    if (input && btn) {
      if (input.value.trim() !== '') {
        btn.classList.add('active', 'pulse');
        setTimeout(() => btn.classList.remove('pulse'), 600);
      } else {
        btn.classList.remove('active');
      }
    }
  }

  // Typing indicator
  function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message assistant typing-message';
    div.innerHTML = `
      <div class="typing-indicator">
        <span>AI is thinking</span>
        <div class="typing-dots">
          <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
        </div>
      </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function hideTypingIndicator() {
    const el = document.querySelector('.typing-message');
    if (el) el.remove();
  }

  // Append a chat message
  function addMessage(sender, content, isInitial = false) {
    const container = document.getElementById('chatMessages');
    const empty = container.querySelector('.empty-state');
    if (empty) empty.remove();

    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    let html = `<div class="message-bubble">${content}</div><div class="message-time">${time}</div>`;
    if (isInitial && sender === 'assistant') {
      html += `<button class="in-depth-btn"><i class="fas fa-brain"></i> Get In-Depth Analysis</button>`;
    }
    msg.innerHTML = html;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    if (conversations[currentConversationId]) {
      conversations[currentConversationId].push({ sender, content, timestamp: now, isInitial });
    }
    const btn = msg.querySelector('.in-depth-btn');
    if (btn) btn.addEventListener('click', requestInDepthAnalysis);
  }

  // Simulate AI initial response
  function simulateAIResponse(query, id) {
    if (currentConversationId !== id) return;
    showTypingIndicator();
    setTimeout(() => {
      if (currentConversationId !== id) { hideTypingIndicator(); return; }
      hideTypingIndicator();
      const resp = generateInitialAIResponse(query);
      addMessage('assistant', resp, true);
    }, 1500);
  }

  // Start a new conversation
  function startConversation(query) {
    currentConversationId = Date.now().toString();
    conversations[currentConversationId] = [];
    inDepthMode = false;
    addMessage('user', query);
    if (query) simulateAIResponse(query, currentConversationId);
  }

  // Generate basic advice
  function generateInitialAIResponse(query) {
    const q = query.toLowerCase();
    let advice = 'Focus on fundamentals: posture, bow hold, and left hand position. Daily practice yields results.';
    if (q.includes('bow') || q.includes('bowing')) {
      advice = 'For bowing technique, focus on straight bow movement and consistent contact point. Use long, slow bows for muscle memory.';
    } else if (q.includes('shift') || q.includes('position')) {
      advice = 'Position shifting requires precise finger placement. Practice scales with marked position changes.';
    } else if (q.includes('vibrato')) {
      advice = 'Start with arm vibrato before wrist. Keep motion relaxed and consistent.';
    } else if (q.includes('scale') || q.includes('arpeggio')) {
      advice = 'Scale practice is fundamental. Use a metronome and vary rhythmic patterns.';
    }
    return advice;
  }

  // Handle user send
  function sendChatMessage() {
    const input = document.querySelector('.chat-input');
    const msg = input.value.trim();
    if (!msg || !currentConversationId) return;
    addMessage('user', msg);
    input.value = '';
    autoResize(input);
    updateChatSendButton();
    showTypingIndicator();
    const delay = 800 + Math.min(msg.length * 20, 1500) + Math.random() * 800;
    setTimeout(() => {
      hideTypingIndicator();
      const r = generateChatResponse(msg);
      addMessage('assistant', r);
    }, delay);
  }

  // Generate follow-up AI response
  function generateChatResponse(message) {
    const options = [
      'Great question! Start with basic finger exercises for strength.',
      'Try practicing that passage at different speeds.',
      'Break it into smaller sections and focus on intonation.',
      'Relax your shoulder and maintain consistent bow pressure.',
      'Use a slower tempo then gradually increase speed.'
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // In-depth analysis
  function requestInDepthAnalysis() {
    inDepthMode = true;
    const btn = document.querySelector('.in-depth-btn'); if (btn) btn.remove();
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      const detail = generateInDepthResponse();
      addMessage('assistant', detail);
      enableChatInput();
    }, 2000);
  }

  function generateInDepthResponse() {
    return `
      <h3 class="chat-section-title">Comprehensive Analysis</h3>

      <h4 class="chat-subtitle">Technical Foundation</h4>
      <ul class="chat-list">
        <li>Maintain <strong>proper posture</strong> and balanced bow hold.</li>
        <li>Use a mirror to continually monitor form.</li>
        <li>Keep shoulders relaxed to avoid tension-related injuries.</li>
      </ul>

      <h4 class="chat-subtitle">Practice Strategy</h4>
      <ul class="chat-list">
        <li>Practice with <strong>slow, deliberate</strong> movements for accuracy.</li>
        <li>Employ a metronome to build rhythmic stability.</li>
        <li>Segment difficult passages and loop them.</li>
      </ul>

      <h4 class="chat-subtitle">Progressive Development</h4>
      <ul class="chat-list">
        <li>Begin with foundational techniques before advancing.</li>
        <li>Gradually <strong>increase tempo</strong> only after consistent accuracy.</li>
        <li>Record yourself weekly to track progress.</li>
      </ul>

      <p class="chat-conclusion">Would you like specific exercises tailored to your current level?</p>
    `;
  }

  function enableChatInput() {
    const input = document.querySelector('.chat-input');
    input.placeholder = 'Continue the conversation...';
    input.disabled = false;
  }

  // Chat history modal
  function toggleChatHistory() {
    const existing = document.querySelector('.chat-history-modal');
    if (existing) { existing.remove(); return; }
    const modal = document.createElement('div'); modal.className = 'chat-history-modal';
    modal.innerHTML = `<div class="modal-content">` +
      `<div class="modal-header"><h3>Conversation History</h3>` +
      `<button class="modal-close"><i class="fas fa-times"></i></button></div>` +
      `<div class="modal-body"><div class="history-list">` +
      (Object.keys(conversations).length > 0 ?
        Object.keys(conversations).map(id =>
          `<div class="history-item" data-id="${id}"><div class="history-title">Conversation ${id}</div>` +
          `<div class="history-preview">${conversations[id][0]?.content.substring(0,50) || 'No messages'}...</div></div>`
        ).join('') : `<div class="no-history">No conversation history</div>`) +
      `</div></div><div class="modal-backdrop"></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.modal-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-backdrop')?.addEventListener('click', () => modal.remove());
    modal.querySelectorAll('.history-item').forEach(item =>
      item.addEventListener('click', () => { loadConversation(item.dataset.id); modal.remove(); })
    );
  }

  // Load a past conversation
  function loadConversation(id) {
    if (!conversations[id]) return;
    currentConversationId = id;
    const container = document.getElementById('chatMessages'); container.innerHTML = '';
    conversations[id].forEach(m => addMessage(m.sender, m.content, false));
    showTemporaryMessage(`Loaded conversation ${id}`);
  }

  // Temporary notifications
  function showTemporaryMessage(msg) {
    const n = document.createElement('div');
    n.style.cssText = 'position:fixed;top:2rem;right:2rem;padding:1rem;border-radius:8px;background:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);z-index:2000;';
    n.textContent = msg; document.body.appendChild(n);
    setTimeout(() => { n.remove(); }, 2000);
  }

  // Styling for notifications
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .chat-history-modal { /* minimal styles */ }

    /* Improved message bubble typography */
    .message.assistant .message-bubble {
      line-height: 1.55;
    }
    .chat-section-title {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--md-sys-color-primary);
    }
    .chat-subtitle {
      margin: 0.75rem 0 0.25rem 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface-variant);
    }
    .chat-list {
      padding-left: 1.25rem;
      margin: 0;
    }
    .chat-list li {
      margin-bottom: 0.25rem;
    }
    .chat-conclusion {
      margin-top: 1rem;
      font-style: italic;
    }
  `;
  document.head.appendChild(styleEl);

  // Attach DOM listeners
  function setupChat() {
    const input = document.querySelector('.chat-input');
    const sendBtn = document.getElementById('chatSendBtn');
    const histBtn = document.getElementById('chatHistoryBtn');
    if (input) {
      autoResize(input);
      input.addEventListener('input', () => { autoResize(input); updateChatSendButton(); });
      input.addEventListener('focus', () => input.closest('.chat-input-wrapper').classList.add('focused'));
      input.addEventListener('blur',  () => input.closest('.chat-input-wrapper').classList.remove('focused'));
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (sendBtn.classList.contains('active')) sendChatMessage(); else input.closest('.chat-input-wrapper').classList.add('shake') && setTimeout(() => input.closest('.chat-input-wrapper').classList.remove('shake'),400); }
      });
    }
    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);
    if (histBtn) histBtn.addEventListener('click', toggleChatHistory);
  }
  document.addEventListener('DOMContentLoaded', setupChat);

  // Expose API
  global.Chat = { startConversation };
})(window);
