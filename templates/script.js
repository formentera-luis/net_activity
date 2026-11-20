document.addEventListener('DOMContentLoaded', () => {
  // Lock both submit buttons while polling the EVE-NG router
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => {
      document.querySelectorAll('[data-run-btn]').forEach((btn) => {
        btn.disabled = true;
      });
      document.querySelectorAll('[data-run-label]').forEach((lbl) => {
        lbl.textContent = 'Polling IOS...';
      });
    });
  });

  // Packet Tracer Dialog Tabs (CLI / Config / Physical)
  const tabs = document.querySelectorAll('.pt-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panes.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const activePane = document.getElementById(`pane-${target}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // Toggle Light (classic PT) vs Dark CLI screen and remember preference
  const cliScreen = document.getElementById('cli-screen');
  const themeBtn = document.getElementById('toggle-theme-btn');
  const storageKey = 'netpilot_cli_dark';

  const applyCliTheme = (isDark) => {
    if (!cliScreen || !themeBtn) return;
    cliScreen.classList.toggle('dark-cli', isDark);
    themeBtn.textContent = isDark ? 'Light CLI' : 'Dark CLI';
  };

  if (cliScreen && themeBtn) {
    applyCliTheme(localStorage.getItem(storageKey) === 'true');
    themeBtn.addEventListener('click', () => {
      const nextDark = !cliScreen.classList.contains('dark-cli');
      localStorage.setItem(storageKey, String(nextDark));
      applyCliTheme(nextDark);
    });
  }

  // Copy CLI output (works on both HTTPS/localhost and plain LAN HTTP)
  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
  };

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const output = button.closest('.cmd-entry')?.querySelector('.cmd-output');
      if (!output) return;
      try {
        await copyText(output.textContent);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Failed';
      }
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 1400);
    });
  });
});