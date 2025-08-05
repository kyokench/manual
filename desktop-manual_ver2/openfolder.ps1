<#
  openfolder.ps1  –  ブラウザの openfolder: URI からフォルダを開く最終版
  2025‑07‑18
#>

param([string]$Path)

# ─ 1. 接頭辞 openfolder: を除去 ───────────────────────────
$Path = $Path -replace '^openfolder:(//)?', ''

# ─ 2. URL デコード → /→\ 変換 → トリム & 制御文字除去 ──────────
Add-Type -AssemblyName System.Web
$decodedPath = [System.Web.HttpUtility]::UrlDecode($Path)
$decodedPath = $decodedPath -replace '/', '\'
$decodedPath = $decodedPath.Trim(' "', "`t", "`r", "`n")
$decodedPath = [regex]::Replace($decodedPath, '\p{C}', '')   # 制御文字全除去

# ─ 3. UNC / ローカル判定 & 正規化 ─────────────────────────
if ($decodedPath -match '^[A-Za-z]:\\') {
    # ローカル (D:\…) はそのまま
}
else {
    # UNC：先頭 / \ を取り除き、\\ を付与
    $decodedPath = '\\\\' + ($decodedPath -replace '^[\\/]+', '')
}

# 先頭に \ が 3 本以上付いていないか最終チェック
while ($decodedPath.StartsWith('\\\')) { $decodedPath = $decodedPath.Substring(1) }

# ─ 4. デバッグログ（任意。不要ならコメントアウト） ──────────────
Add-Content -LiteralPath "$env:TEMP\openfolder_debug.txt" `
    -Value ("[{0}] <{1}>" -f (Get-Date -Format 'HH:mm:ss'), $decodedPath)

# ─ 5. エクスプローラーでフォルダを開く ─────────────────────
Start-Process -FilePath explorer.exe -ArgumentList $decodedPath
