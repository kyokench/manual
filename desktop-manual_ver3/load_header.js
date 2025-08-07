document.addEventListener('DOMContentLoaded', function () {
  /*───────────────────────────────────────────────
    1. ヘッダーナビのリンク先を決定
  ───────────────────────────────────────────────*/
  const currentPathname = window.location.pathname;
  const pathSegments = currentPathname.split('/');
  const currentDir = pathSegments[pathSegments.length - 2]; // 現在のディレクトリ名
  const currentFilePath = window.location.pathname;

  let homeLink, blogLink, sonotaLink, gijyutuLink;

  if (currentDir === 'blog') {
    homeLink     = '../index.html';
    blogLink     = 'blog.html';
    sonotaLink   = '../sonota/sonota.html';
    gijyutuLink   = '../gijyutu/gijyutu.html';   
  } else if (currentDir === 'kihon') {
    homeLink     = '../index.html';
    blogLink     = '../blog/blog.html';
    sonotaLink   = '../sonota/sonota.html';
    gijyutuLink   = '../gijyutu/gijyutu.html';   
  } else if (currentDir === 'sonota') {
    homeLink     = '../index.html';
    blogLink     = '../blog/blog.html';
    sonotaLink   = 'sonota.html';
    gijyutuLink   = '../gijyutu/gijyutu.html';   
  } else if (currentDir === 'gijyutu') {
    homeLink     = '../index.html';
    blogLink     = '../blog/blog.html';
    sonotaLink   = '../sonota/sonota.html';
    gijyutuLink   = 'gijyutu.html';   
  } else if (currentDir === 'zakki') {
    homeLink     = '../index.html';
    blogLink     = '../blog/blog.html';
    sonotaLink   = '../sonota/sonota.html';
    gijyutuLink   = '../gijyutu/gijyutu.html';   
  } else {
    homeLink     = 'index.html';
    blogLink     = 'blog/blog.html';
    sonotaLink   = 'sonota/sonota.html';
    gijyutuLink   = 'gijyutu/gijyutu.html';   
  }

  /*───────────────────────────────────────────────
    2. Windows パスを取得（UNC 対応）
       ‑ file:///D:/foo/bar.html  →  D:\foo\bar.html
       ‑ file://server/share/foo →  \\server\share\foo\bar.html
  ───────────────────────────────────────────────*/
  function getWindowsFullPath () {
    const url = new URL(window.location.href);
    if (url.protocol !== 'file:') return '';

    // UNC (file://server/share/...)
    if (url.host) {
      return '\\\\' + url.host + decodeURIComponent(url.pathname).replace(/\//g, '\\');
    }
    // ローカルドライブ (file:///D:/...)
    return decodeURIComponent(url.pathname)
      .replace(/\//g, '\\')   // / → \
      .replace(/^\\/, '');     // 先頭の \ を除去
  }

  const fullPathWin = getWindowsFullPath();                      // 例: D:\work\index.html or \\server\share\index.html
  const dirPathWin  = fullPathWin.substring(0, fullPathWin.lastIndexOf('\\'));
  const VsPathWin = `vscode://file${currentFilePath}`;
  const VsDirPathWin = `vscode://file${currentFilePath.substring(0, currentFilePath.lastIndexOf('/'))}`;

  /*───────────────────────────────────────────────
    3. VS Code / メモ帳 / Explorer 用 URI を生成
  ───────────────────────────────────────────────*/
  const toPosix = p => p.replace(/\\/g, '/');

  const vscodeFileUri   = `vscode://file${toPosix(currentFilePath)}`;
  const vscodeFolderUri = `vscode://file${toPosix(currentFilePath.substring(0, currentFilePath.lastIndexOf('/')))}`;

  const notepadFileUri  = `note:${fullPathWin}`;
  const notepadFolderUri= `note:${dirPathWin}`;

  const explorerFolderUri = dirPathWin.toLowerCase().startsWith('explorer:')
    ? dirPathWin
    : `explorer:${dirPathWin}`;

  /*───────────────────────────────────────────────
    4. ヘッダとサイドバーを描画
  ───────────────────────────────────────────────*/
  const headerContent = `
  <header class="main-header">
    <div class="container">
      <div class="header-left">
        <button class="hamburger-menu" aria-label="メニューを開く">
          <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
        <div class="logo"><a href="${homeLink}">manual</a></div>
      </div>
      <nav class="main-nav" id="main-nav-menu">
        <ul>
          <li><a href="${sonotaLink}">その他</a></li>
          <li><a href="${blogLink}">ブログ</a></li>
          <li><a href="${gijyutuLink}">技術</a></li>
        </ul>
      </nav>

      <div class="header-right" style="margin-left:auto; display:flex; align-items:center; gap:6px;">
      <div class="header-icons">

        <a data-path="\\\\◯◯◯◯◯\\◯◯◯◯◯\\◯◯◯◯◯" class="openfolder icon-btn" title="フォルダを開く" style="color: #ecf0f1; margin-right:7px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6C3 4.89543 3.89543 4 5 4H9L11 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" />
          </svg>
        </a>

        <a href="https://www.google.co.jp" target="_blank" class="icon-btn" title="Google">
          <img src="https://www.google.com/favicon.ico" alt="Google" style="width:18px; height:18px; margin-right:9px;">
        </a>
        <a href="https://chat.openai.com/" target="_blank" class="icon-btn" title="ChatGPT">
          <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" style="width:18px; height:18px;">
        </a>
      </div>
        <button class="memo-toggle" aria-label="メモを開く" title="メモ">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 4h8a2 2 0 0 1 2 2v7.17a2 2 0 0 1-.59 1.41l-3.83 3.83A2 2 0 0 1 12.17 19H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="currentColor"/>
            <path d="M13 19v-3a2 2 0 0 1 2-2h3" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>

    </div>
  </header>`;
  document.getElementById('header-placeholder').innerHTML = headerContent;

  const sidebarContent = `
  <ul>
    <!-- <li><a href="${vscodeFolderUri}">VS Codeでフォルダを開く</a></li> -->
    <li><a href="${notepadFileUri}">メモ帳で開く</a></li>
    <li><a href="${explorerFolderUri}">フォルダを開く</a></li>
    <li><a href="/◯◯◯◯◯/00.manyual/kihon/todo.html">TODOリスト</a></li>
    <!--<li><a href="◯◯◯">カレンダー</a></li> -->
    <li><a href="/◯◯◯◯◯/00.manyual/kihon/4masu-memo2.html">４マスメモ</a></li>
    <li><a href="/◯◯◯◯◯/00.manyual/kihon/calc.html">計算支援アプリ</a></li>
    <!-- <li><a href="${vscodeFileUri}">VS Code</a></li> -->
    <li><a href="/◯◯◯◯◯/00.manyual/zakki/zakki.html">雑記</a></li>
    <li><a href="https://google.com" target="_blank">Google検索</a></li>
  </ul>`;
  document.getElementById('sidebar').innerHTML = sidebarContent;

  /*───────────────────────────────────────────────
    5. sidebar に未完了 TODO を表示
  ───────────────────────────────────────────────*/

  const sidebarElement = document.getElementById('sidebar');
  const sidebarTodoContainer = document.createElement('div');
  sidebarTodoContainer.style.padding = '10px 15px';
  sidebarTodoContainer.style.borderTop = '1px solid #777';
  sidebarTodoContainer.style.marginTop = '15px';
  sidebarTodoContainer.style.color = '#ccc';
  sidebarTodoContainer.innerHTML = `
    <div style="font-size:13px;">TODOリストの未完項目</div>
    <ul id="sidebar-todo-list" style="
      list-style-type: disc;
      list-style-position: outside;
      margin-left: 16px;
      padding-left: 0;
      margin-top: 8px;
    "></ul>
  `;
  sidebarElement.appendChild(sidebarTodoContainer);

  const sidebarTodoList = document.getElementById('sidebar-todo-list');
  const allTodos = JSON.parse(localStorage.getItem('todos')) || [];
  const sidebarTodos = allTodos.filter(todo => !todo.completed).slice(0, 5); // 最大5件まで表示

  // ───────────────────────────────────────────────
  // 5.5. サイドバー末尾に検索欄・検索結果表示を追加
  // ───────────────────────────────────────────────
  const searchContainer = document.createElement('div');
  // デザインはお好みで調整を
  searchContainer.style.padding     = '10px 15px';
  searchContainer.style.borderTop   = '1px solid #777';
  searchContainer.style.marginTop   = '15px';
  searchContainer.innerHTML = `
    <div class="search-wrapper">
      <span class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round">
          <!-- レンズ部分 -->
          <circle cx="11" cy="11" r="8"></circle>
          <!-- 持ち手を長く：開始点を (23,23) に -->
          <line x1="23" y1="23" x2="16.65" y2="16.65"></line>
        </svg>
      </span>
      <input
        type="text"
        id="sidebar-search-box"
        placeholder="検索…"
      >
    </div>
    <ul id="sidebar-search-results"></ul>
  `;
  sidebarElement.appendChild(searchContainer);

  // 検索処理
  const searchBox     = document.getElementById('sidebar-search-box');
  const searchResults = document.getElementById('sidebar-search-results');

  searchBox.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!q) return;  // 空入力時は何も表示しない

    window.manualData.forEach(item => {
      // タイトルまたは URL にクエリ文字列が含まれる場合にマッチ
      if (
        (item.title  && item.title.toLowerCase().includes(q)) ||
        (item.url    && item.url.toLowerCase().includes(q))
      ) {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href        = item.url;
        a.textContent = item.title || item.url;
        a.style.display = 'block';
        a.style.padding = '4px 0';
        li.appendChild(a);
        searchResults.appendChild(li);
      }
    });
  });

  /*───────────────────────────────────────────────
    6. クイックメモの表示
  ───────────────────────────────────────────────*/

  // ヘッダー/サイドバー挿入の直後あたりに追記
  const memoPanel = document.createElement('aside');
  memoPanel.id = 'memo-panel';
  memoPanel.innerHTML = `
    <div class="memo-header">
      <span>クイックメモ</span>
      <div class="memo-actions">
      <button id="memo-expand" class="icon-btn" aria-label="メモを広くする" title="メモを広くする" aria-pressed="false">
      <!-- 拡張アイコン（左右に伸びる） -->
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12h18" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M7 8l-4 4 4 4M17 8l4 4-4 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </button>
      <button id="memo-close" class="icon-btn" aria-label="メモを閉じる" title="閉じる">×</button>
      </div>
    </div>
    <textarea id="memo-text" placeholder="ここにメモを書けます（自動保存）"></textarea>
  `;
  document.body.appendChild(memoPanel);

  // ===== Memo panel state & content =====
  const MEMO_OPEN_KEY = 'memoOpen';
  const MEMO_TEXT_KEY = 'memoText';
  const MEMO_WIDE_KEY = 'memoWide';

  // 要素取得
  const memoToggleBtn = document.querySelector('.memo-toggle');
  const memoPanelEl   = document.getElementById('memo-panel');
  const memoTextEl    = document.getElementById('memo-text');
  const memoCloseBtn  = document.getElementById('memo-close');
  const memoExpandBtn = document.getElementById('memo-expand');

  // 初期復元（開閉状態のチラつき防止）
  (function restoreMemoState() {
    if (!memoPanelEl) return;
    const savedOpen  = localStorage.getItem(MEMO_OPEN_KEY) === 'true';
    const savedText  = localStorage.getItem(MEMO_TEXT_KEY) || '';
    const savedWide  = localStorage.getItem(MEMO_WIDE_KEY) === 'true';

  // 初回はアニメーション無効にしてから状態反映
  const prev = memoPanelEl.style.transition;
  memoPanelEl.style.transition = 'none';
  memoPanelEl.classList.toggle('active', savedOpen);
  memoPanelEl.style.transition = prev || '';

  memoTextEl.value = savedText;
  document.body.classList.toggle('memo-wide', savedWide);
  if (memoExpandBtn) memoExpandBtn.setAttribute('aria-pressed', String(savedWide));
  })();

  // トグル（ボタン／クローズ×）
  function setMemoOpen(next) {
    memoPanelEl.classList.toggle('active', next);
    localStorage.setItem(MEMO_OPEN_KEY, String(next));
  }
  if (memoToggleBtn && memoPanelEl) {
    memoToggleBtn.addEventListener('click', () => {
      const willOpen = !memoPanelEl.classList.contains('active');
      setMemoOpen(willOpen);
    });
  }
  if (memoCloseBtn) {
    memoCloseBtn.addEventListener('click', () => setMemoOpen(false));
  }

  // ワイド切替
  function setMemoWide(next) {
    document.body.classList.toggle('memo-wide', next);
    localStorage.setItem(MEMO_WIDE_KEY, String(next));
    if (memoExpandBtn) memoExpandBtn.setAttribute('aria-pressed', String(next));
  }
  if (memoExpandBtn) {
    memoExpandBtn.addEventListener('click', () => {
      const willWide = !document.body.classList.contains('memo-wide');
      setMemoWide(willWide);
    });
  }

  // 入力の自動保存（300ms デバウンス）
  let memoSaveTimer = null;
  if (memoTextEl) {
    memoTextEl.addEventListener('input', () => {
      clearTimeout(memoSaveTimer);
      memoSaveTimer = setTimeout(() => {
        localStorage.setItem(MEMO_TEXT_KEY, memoTextEl.value || '');
      }, 300);
    });
  }

  // 複数タブ同期（開閉のみ同期。本文は最後の入力が勝つ想定）
  window.addEventListener('storage', (ev) => {
    if (!memoPanelEl) return;
    if (ev.key === MEMO_OPEN_KEY) {
      const open = ev.newValue === 'true';
      memoPanelEl.classList.toggle('active', open);
    } else if (ev.key === MEMO_TEXT_KEY && memoTextEl) {
      memoTextEl.value = ev.newValue || '';
    } else if (ev.key === MEMO_WIDE_KEY) {
      const wide = ev.newValue === 'true';
      document.body.classList.toggle('memo-wide', wide);
      if (memoExpandBtn) memoExpandBtn.setAttribute('aria-pressed', String(wide));
    }
  });

  if (sidebarTodos.length > 0) {
    sidebarTodos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = todo.text;
      li.style.fontSize = '12px';
      sidebarTodoList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = '未完了なし';
    li.style.fontSize = '12px';
    sidebarTodoList.appendChild(li);
  }

  const SIDEBAR_STORAGE_KEY = 'sidebarOpen'; // "true" / "false"

  // 初期状態を localStorage から復元（初回描画のチラつき防止つき）
  (function restoreSidebarState() {
  const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  const shouldOpen = saved === 'true'; // 未保存なら false（閉）
  const hamburger = document.querySelector('.hamburger-menu');
  const sidebar   = document.getElementById('sidebar');
  const contentWrapper = document.querySelector('.content-wrapper');
  if (!hamburger || !sidebar || !contentWrapper) return;

  // ★ 初期復元時のアニメーション無効化
  const sidebarPrev = sidebar.style.transition;
  const contentPrev = contentWrapper.style.transition;
  sidebar.style.transition = 'none';
  contentWrapper.style.transition = 'none';

  // クラス付与で見た目を復元（ここでは一切アニメーションしない）
  hamburger.classList.toggle('active', shouldOpen);
  sidebar.classList.toggle('active', shouldOpen);
  contentWrapper.classList.toggle('sidebar-active', shouldOpen);
  document.body.classList.toggle('sidebar-open', shouldOpen);
  hamburger.setAttribute('aria-expanded', String(shouldOpen));

  // ★ 次フレームで transition を元に戻す（以降の操作は通常どおりアニメーション）
  requestAnimationFrame(() => {
    sidebar.style.transition = sidebarPrev || '';
    contentWrapper.style.transition = contentPrev || '';
  });
  })();

  /*───────────────────────────────────────────────
    7. ハンバーガーメニュー制御
  ───────────────────────────────────────────────*/
  const hamburger = document.querySelector('.hamburger-menu');
  const sidebar   = document.getElementById('sidebar');
  const contentWrapper = document.querySelector('.content-wrapper');

  if (hamburger && sidebar && contentWrapper) {
    hamburger.addEventListener('click', () => {
      const nowOpen = !sidebar.classList.contains('active');

      hamburger.classList.toggle('active', nowOpen);
      sidebar.classList.toggle('active', nowOpen);
      contentWrapper.classList.toggle('sidebar-active', nowOpen);
      document.body.classList.toggle('sidebar-open', nowOpen);

      // 状態を保存
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nowOpen));
      // ARIA 更新
      hamburger.setAttribute('aria-expanded', String(nowOpen));
    });
  }

  /*───────────────────────────────────────────────
    8. サイドバー開閉状態の管理
  ───────────────────────────────────────────────*/

  window.addEventListener('storage', (ev) => {
    if (ev.key !== SIDEBAR_STORAGE_KEY) return;
    const shouldOpen = ev.newValue === 'true';
    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar   = document.getElementById('sidebar');
    const contentWrapper = document.querySelector('.content-wrapper');
    if (!hamburger || !sidebar || !contentWrapper) return;

    hamburger.classList.toggle('active', shouldOpen);
    sidebar.classList.toggle('active', shouldOpen);
    contentWrapper.classList.toggle('sidebar-active', shouldOpen);
    document.body.classList.toggle('sidebar-open', shouldOpen);
    hamburger.setAttribute('aria-expanded', String(shouldOpen));
  });

});

/*───────────────────────────────────────────────
  10. トーストを表示するヘルパー関数
───────────────────────────────────────────────*/
function showToast(message, duration = 2000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  
  // もし前回の hide クラスが残っていたらクリア
  toast.classList.remove('hide');
  // show クラスを付与してフェードイン
  toast.classList.add('show');

  // duration 経過後にフェードアウト
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    // フェードアウト終了後に要素を消したければ、以下も追加できます：
    toast.addEventListener('animationend', function onEnd(e) {
      if (e.animationName === 'toast-fade-out') {
        toast.removeEventListener('animationend', onEnd);
        toast.remove();
      }
    });
  }, duration);
}

// クリック時に呼び出し（変更不要）
document.querySelectorAll('a.openfolder').forEach(a => {
  a.addEventListener('click', () => {
    showToast('処理準備中', 2000);
  });
});

/*───────────────────────────────────────────────
  11. フォルダを開く処理
───────────────────────────────────────────────*/

document.addEventListener('DOMContentLoaded', () => {
  const debugDiv = document.getElementById('debug');

  document.querySelectorAll('a.openfolder').forEach(a => {
    const raw = a.dataset.path || '';

    // セグメントごとに encodeURIComponent して openfolder: URI を生成
    const uri = 'openfolder:' +
      raw.replace(/\\/g, '/')
         .split('/')
         .map(encodeURIComponent)
         .join('/');

    a.href = uri;

    // デバッグ出力（#debug があるときだけ）
    if (debugDiv) {
      debugDiv.innerHTML += `<p>元のパス: ${raw}<br>変換後URI: ${uri}</p>`;
    }

    // クリック時ログ（任意）
    a.addEventListener('click', () => console.log('クリック:', uri));
  });
});

