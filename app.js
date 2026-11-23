(async function () {
  const root = document.getElementById('episodes-root');
  try {
    const res = await fetch('episodes.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load episodes.json');
    const episodes = await res.json();
    root.innerHTML = '';

    for (const ep of episodes) {
      const card = document.createElement('article');
      card.className = 'episode-card';
      card.id = ep.id;

      const filesHtml = ep.files.map((f) => `
        <a class="file-btn" href="${f.path}" download="${f.filename}">
          <div>
            <span class="file-name">${f.label}</span>
            <span class="file-sub">${f.filename} · ${f.size} · SHA-256 ${f.sha256}</span>
          </div>
          <span class="dl-tag">⬇ .xlsx</span>
        </a>
      `).join('');

      card.innerHTML = `
        <div class="ep-top">
          <a class="ep-thumb-link" href="${ep.youtubeUrl}" target="_blank" rel="noopener">
            <img src="${ep.thumb}" alt="${ep.number}: ${ep.title}">
            <span class="ep-duration">${ep.duration}</span>
          </a>
          <div class="ep-info">
            <div class="ep-meta">
              <span class="badge">${ep.number}</span>
              <span class="badge neutral">${ep.category}</span>
              <span class="badge neutral">${ep.date}</span>
            </div>
            <h2>${ep.title}</h2>
            <p>${ep.summary}</p>
            <div class="ep-result">✓ ${ep.keyResult}</div>
          </div>
        </div>
        <div class="ep-body">
          <div>
            <h3 class="section-title">1. Download Synthetic Practice Workbooks</h3>
            <div class="files-grid">${filesHtml}</div>
          </div>
          <div>
            <div class="prompt-head">
              <h3 class="section-title" style="margin:0;">2. Copy-Paste AI Prompt (ChatGPT / Claude / Gemini)</h3>
              <button class="copy-btn" type="button">Copy Prompt</button>
            </div>
            <pre class="prompt-box"></pre>
          </div>
        </div>
      `;

      const pre = card.querySelector('.prompt-box');
      pre.textContent = ep.prompt;

      const btn = card.querySelector('.copy-btn');
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(ep.prompt);
          btn.textContent = '✓ Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy Prompt';
            btn.classList.remove('copied');
          }, 2200);
        } catch {
          const range = document.createRange();
          range.selectNodeContents(pre);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          btn.textContent = 'Selected — Press Ctrl/Cmd+C';
        }
      });

      root.appendChild(card);
    }
  } catch (err) {
    root.innerHTML = `<p style="color:#fca5a5;">Unable to load episodes: ${err.message}</p>`;
  }
})();
