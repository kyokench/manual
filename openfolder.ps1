param(
    [string]$Path
)

# デバッグ用：受け取った引数を表示
[System.Windows.Forms.MessageBox]Show(受け取った引数 $Path, デバッグ)

# openfolder の接頭辞を削除
if ($Path.StartsWith(openfolder)) {
    $Path = $Path.Substring(13)
} elseif ($Path.StartsWith(openfolder)) {
    $Path = $Path.Substring(11)
}

# URLデコード
Add-Type -AssemblyName System.Web
$decodedPath = [System.Web.HttpUtility]UrlDecode($Path)

# スラッシュをバックスラッシュに変換
$decodedPath = $decodedPath.Replace(, )

# デバッグ用：デコードされたパスを表示
[System.Windows.Forms.MessageBox]Show(デコードされたパス $decodedPath, デバッグ)

# フォルダの存在確認
if (Test-Path $decodedPath -PathType Container) {
    # Explorer でフォルダを開く
    Start-Process explorer.exe -ArgumentList $decodedPath
} else {
    [System.Windows.Forms.MessageBox]Show(フォルダが見つかりません $decodedPath, エラー)
    
    # 親フォルダの確認
    $parentPath = Split-Path $decodedPath -Parent
    if ($parentPath -and (Test-Path $parentPath -PathType Container)) {
        [System.Windows.Forms.MessageBox]Show(親フォルダは存在します $parentPath, 情報)
    } else {
        [System.Windows.Forms.MessageBox]Show(親フォルダも見つかりません $parentPath, エラー)
    }
}

# Windows.Forms を読み込み
Add-Type -AssemblyName System.Windows.Forms