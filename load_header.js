/* --------------------------------------------------
   load_header.js (v2025‑07‑15)
   ‑ UNC ネットワークパス (file://server/...) とローカルパス (file:///D:/...) の両方で
     VS Code/メモ帳/Explorer リンクが正しく動作するように改良しました。
   -------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  /*───────────────────────────────────────────────
    1. ヘッダーナビのリンク先を決定
  ───────────────────────────────────────────────*/
  const currentPathname = window.location.pathname;
  const pathSegments = currentPathname.split('/');
  const currentDir = pathSegments[pathSegments.length - 2]; // 現在のディレクトリ名
  const currentFilePath = window.location.pathname;


  let homeLink, blogLink, sonotaLink, todoLink, calendarLink;

  if (currentDir === 'blog') {
    homeLink     = '../index.html';
    blogLink     = 'blog.html';
    sonotaLink   = '../sonota/sonota.html';
    todoLink     = '../kihon/todo.html';
    calendarLink = '../kihon/calendar.html';
  } else if (currentDir === 'kihon') {
    homeLink     = '../index.html';
    blogLink     = '../blog/blog.html';
    sonotaLink   = '../sonota/sonota.html';
    todoLink     = 'todo.html';
    calendarLink = 'calendar.html';
  } else if (currentDir === 'sonota') {
    homeLink     = '../index.html';
    blogLink     = '../blog/blog.html';
    sonotaLink   = 'sonota.html';
    todoLink     = '../kihon/todo.html';
    calendarLink = '../kihon/calendar.html';
  } else {
    homeLink     = 'index.html';
    blogLink     = 'blog/blog.html';
    sonotaLink   = 'sonota/sonota.html';
    todoLink     = 'kihon/todo.html';
    calendarLink = 'kihon/calendar.html';
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
        <li><a href="${homeLink}">ホーム</a></li>
        <li><a href="${blogLink}">ブログ</a></li>
        <li><a href="${sonotaLink}">その他</a></li>
      </ul>
    </nav>
  </div>
</header>`;
  document.getElementById('header-placeholder').innerHTML = headerContent;

  const sidebarContent = `
<ul>
  <li><a href="${vscodeFileUri}">VS Codeで開く</a></li>
  <li><a href="${vscodeFolderUri}">フォルダを開く</a></li>
  <li><a href="${notepadFileUri}">メモ帳で開く</a></li>
  <li><a href="${explorerFolderUri}">エクスプローラーで開く</a></li>
  <li><a href="${todoLink}">TODOリスト</a></li>
  <li><a href="${calendarLink}">カレンダー</a></li>
</ul>`;
  document.getElementById('sidebar').innerHTML = sidebarContent;

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
        indexTodoList.appendChild(li);
      });
      if (noTodoMessage) noTodoMessage.style.display = 'none';
    } else if (noTodoMessage) {
      noTodoMessage.style.display = 'block';
    }
  }
});