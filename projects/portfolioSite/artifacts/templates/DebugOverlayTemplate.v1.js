// Debug overlay template (no console logging, DOM-only updates).
// Shortcuts: Alt+O toggle visibility, Alt+M toggle minimize, Alt+C clear messages.
(function () {
  const overlayId = 'debug-overlay-v1';
  const maxMessages = 50;
  const levels = {
    info: { color: '#1d4ed8', label: 'INFO' },
    warn: { color: '#d97706', label: 'WARN' },
    error: { color: '#b91c1c', label: 'ERROR' },
  };

  const state = {
    visible: true,
    minimized: false,
    messages: [],
  };

  const root = document.createElement('div');
  root.id = overlayId;
  root.setAttribute(
    'style',
    [
      'position:fixed',
      'bottom:12px',
      'right:12px',
      'z-index:9999',
      'width:320px',
      'max-height:40vh',
      'font-family:Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'color:#0f172a',
      'pointer-events:none',
    ].join(';'),
  );

  const style = document.createElement('style');
  style.textContent = `
    #${overlayId}.hidden { display: none; }
    #${overlayId} .panel {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 12px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.2);
      overflow: hidden;
      pointer-events: auto;
    }
    #${overlayId} .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: linear-gradient(135deg, #e0f2fe, #eef2ff);
      border-bottom: 1px solid rgba(0,0,0,0.05);
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.02em;
    }
    #${overlayId} .actions { display: flex; gap: 6px; }
    #${overlayId} button {
      border: 1px solid rgba(0,0,0,0.08);
      background: white;
      color: #0f172a;
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    #${overlayId} button:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
    #${overlayId} button:active { transform: translateY(0); box-shadow: none; }
    #${overlayId} .body { max-height: 28vh; overflow-y: auto; padding: 8px 10px; background: white; }
    #${overlayId}.minimized .body { display: none; }
    #${overlayId} .item { display: grid; grid-template-columns: 60px 1fr; gap: 8px; padding: 8px; margin-bottom: 6px; border-radius: 10px; background: #f8fafc; border: 1px solid rgba(0,0,0,0.04); }
    #${overlayId} .level { font-weight: 800; font-size: 11px; letter-spacing: 0.04em; color: white; padding: 4px 6px; border-radius: 8px; text-align: center; }
    #${overlayId} .text { font-size: 12px; line-height: 1.4; color: #0f172a; word-break: break-word; }
    #${overlayId} .meta { font-size: 10px; color: #475569; margin-top: 4px; }
    #${overlayId}::-webkit-scrollbar { width: 6px; }
    #${overlayId}::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.15); border-radius: 999px; }
  `;

  const panel = document.createElement('div');
  panel.className = 'panel';

  const header = document.createElement('div');
  header.className = 'header';
  header.innerHTML = '<span>Debug Overlay</span>';

  const actions = document.createElement('div');
  actions.className = 'actions';

  const btnMin = document.createElement('button');
  btnMin.textContent = 'Min';
  btnMin.title = 'Alt+M';
  btnMin.onclick = function () {
    state.minimized = !state.minimized;
    render();
  };

  const btnClear = document.createElement('button');
  btnClear.textContent = 'Clear';
  btnClear.title = 'Alt+C';
  btnClear.onclick = function () {
    state.messages = [];
    render();
  };

  const btnHide = document.createElement('button');
  btnHide.textContent = 'Hide';
  btnHide.title = 'Alt+O';
  btnHide.onclick = function () {
    state.visible = false;
    render();
  };

  actions.append(btnMin, btnClear, btnHide);
  header.append(actions);

  const body = document.createElement('div');
  body.className = 'body';

  panel.append(header, body);
  root.append(style, panel);
  document.body.append(root);

  function renderMessages() {
    body.innerHTML = '';
    state.messages.forEach((msg) => {
      const item = document.createElement('div');
      item.className = 'item';

      const levelTag = document.createElement('div');
      levelTag.className = 'level';
      levelTag.textContent = levels[msg.level].label;
      levelTag.style.background = levels[msg.level].color;

      const textWrap = document.createElement('div');
      textWrap.innerHTML = `<div class="text">${msg.text}</div><div class="meta">${msg.time}</div>`;

      item.append(levelTag, textWrap);
      body.append(item);
    });
  }

  function render() {
    if (state.visible) {
      root.classList.remove('hidden');
    } else {
      root.classList.add('hidden');
    }
    if (state.minimized) {
      root.classList.add('minimized');
      btnMin.textContent = 'Expand';
    } else {
      root.classList.remove('minimized');
      btnMin.textContent = 'Min';
    }
    renderMessages();
  }

  function push(level, text) {
    const now = new Date();
    state.messages.unshift({
      level,
      text,
      time: now.toLocaleTimeString(),
    });
    if (state.messages.length > maxMessages) {
      state.messages.length = maxMessages;
    }
    render();
  }

  window.DebugOverlay = {
    info: function (text) {
      push('info', text);
    },
    warn: function (text) {
      push('warn', text);
    },
    error: function (text) {
      push('error', text);
    },
    show: function () {
      state.visible = true;
      render();
    },
    hide: function () {
      state.visible = false;
      render();
    },
    minimize: function () {
      state.minimized = true;
      render();
    },
    expand: function () {
      state.minimized = false;
      render();
    },
    clear: function () {
      state.messages = [];
      render();
    },
  };

  document.addEventListener('keydown', function (e) {
    if (!e.altKey) return;
    if (e.code === 'KeyO') {
      state.visible = !state.visible;
      render();
    } else if (e.code === 'KeyM') {
      state.minimized = !state.minimized;
      render();
    } else if (e.code === 'KeyC') {
      state.messages = [];
      render();
    }
  });

  render();
})();
