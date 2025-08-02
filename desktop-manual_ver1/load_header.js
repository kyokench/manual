/* --------------------------------------------------
   load_header.js (v2025‑07‑15)
   ‑ UNC ネットワークパス (file://server/...) とローカルパス (file:///D:/...) の両方で
     VS Code/メモ帳/Explorer リンクが正しく動作するように改良しました。
   -------------------------------------------------- */

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

  const pathForNotepad = window.location.pathname.substring(1);
  const notepadFileUri  = `note:${pathForNotepad}`;
  const notepadFolderUri= `note:${dirPathWin}`;

  const pathForExplorer = dirPathWin.replace(/\\/g, '/');
  const explorerFolderUri = `explorer:${pathForExplorer}`;

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
  </div>
</header>`;
  document.getElementById('header-placeholder').innerHTML = headerContent;

  const sidebarContent = `
<ul>
  <!-- <li><a href="${vscodeFolderUri}">VS Codeでフォルダを開く</a></li> -->
  <li><a href="${notepadFileUri}">メモ帳で開く</a></li>
  <li><a href="${explorerFolderUri}">フォルダを開く</a></li>
  <li><a href="/kyo◯◯◯◯◯/manual-black/kihon/todo.html">TODOリスト</a></li>
  <li><a href="/kyo◯◯◯◯◯/manual-black/kihon/calendar.html">カレンダー</a></li>
  <li><a href="https://◯◯◯◯◯.github.io/4masumemo/4masu-sumahotest_ver8.html">４マスメモ</a></li>
  <li><a href="${vscodeFileUri}">VS Code</a></li>
  <li><a href="/kyo◯◯◯◯◯/manual-black/zakki/zakki.html">雑記</a></li>
  <li><a href="https://google.com" target="_blank">Google検索</a></li>
</ul>`;
  document.getElementById('sidebar').innerHTML = sidebarContent;

// ▼ sidebar に未完了 TODO を表示 ▼
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
const sidebarTodos = allTodos.filter(todo => !todo.completed).slice(0, 10); // 最大5件まで表示

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


  /*───────────────────────────────────────────────
    5. ハンバーガーメニュー制御
  ───────────────────────────────────────────────*/
  const hamburger = document.querySelector('.hamburger-menu');
  const sidebar   = document.getElementById('sidebar');
  const contentWrapper = document.querySelector('.content-wrapper');

  if (hamburger && sidebar && contentWrapper) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      sidebar.classList.toggle('active');
      contentWrapper.classList.toggle('sidebar-active');
    });
  }

  /*───────────────────────────────────────────────
    6. index.html のみ TODO 概要を表示
  ───────────────────────────────────────────────*/
  if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/')) {
    const indexTodoList = document.getElementById('index-todo-list');
    const noTodoMessage = document.getElementById('no-todo-message');
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const incompleteTodos = todos.filter(todo => !todo.completed);

    if (incompleteTodos.length > 0) {
      incompleteTodos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        li.setAttribute('style', 'font-size:11px; color:#ccc;'); // ← ここでサイズも色も強制指定
        indexTodoList.appendChild(li);
      });
      if (noTodoMessage) noTodoMessage.style.display = 'none';
    } else if (noTodoMessage) {
      noTodoMessage.style.display = 'block';
    }
  }
});

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