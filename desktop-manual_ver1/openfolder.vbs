Set objArgs = WScript.Arguments
If objArgs.Count = 0 Then
    MsgBox "引数がありません"
    WScript.Quit
End If

raw = objArgs(0)

' デバッグ用：受け取った引数を表示
MsgBox "受け取った引数: " & raw

' openfolder: の接頭辞を削除
If Left(raw, 12) = "openfolder://" Then
    raw = Mid(raw, 13)
ElseIf Left(raw, 11) = "openfolder:" Then
    raw = Mid(raw, 12)
End If

' UTF-8デコード関数（ADODBを使用）
Function DecodeURIComponent(str)
    Dim stream, result
    Set stream = CreateObject("ADODB.Stream")
    
    ' パーセントエンコードされた文字列をバイト配列に変換
    Dim bytes()
    Dim byteCount, i, hex
    byteCount = 0
    i = 1
    
    ' まずバイト数をカウント
    Do While i <= Len(str)
        If Mid(str, i, 1) = "%" Then
            byteCount = byteCount + 1
            i = i + 3
        Else
            byteCount = byteCount + 1
            i = i + 1
        End If
    Loop
    
    ' バイト配列を準備
    ReDim bytes(byteCount - 1)
    byteCount = 0
    i = 1
    
    ' 実際にバイト配列に変換
    Do While i <= Len(str)
        If Mid(str, i, 1) = "%" Then
            hex = Mid(str, i + 1, 2)
            bytes(byteCount) = CLng("&H" & hex)
            byteCount = byteCount + 1
            i = i + 3
        Else
            bytes(byteCount) = Asc(Mid(str, i, 1))
            byteCount = byteCount + 1
            i = i + 1
        End If
    Loop
    
    ' ADODBストリームでUTF-8デコード
    stream.Type = 1 ' Binary
    stream.Open
    stream.Write bytes
    stream.Position = 0
    stream.Type = 2 ' Text
    stream.Charset = "UTF-8"
    result = stream.ReadText
    stream.Close
    
    DecodeURIComponent = result
End Function

' 簡易版デコード関数（ADODBが使えない場合のフォールバック）
Function SimpleDecodeURIComponent(str)
    Dim result, i, char, hex
    result = ""
    i = 1
    
    Do While i <= Len(str)
        char = Mid(str, i, 1)
        If char = "%" Then
            If i + 2 <= Len(str) Then
                hex = Mid(str, i + 1, 2)
                result = result & Chr(CLng("&H" & hex))
                i = i + 3
            Else
                result = result & char
                i = i + 1
            End If
        Else
            result = result & char
            i = i + 1
        End If
    Loop
    
    SimpleDecodeURIComponent = result
End Function

' メインのデコード処理
On Error Resume Next
decodedPath = DecodeURIComponent(raw)
If Err.Number <> 0 Then
    ' ADODBが使えない場合は簡易版を使用
    Err.Clear
    decodedPath = SimpleDecodeURIComponent(raw)
End If
On Error GoTo 0

decodedPath = Replace(decodedPath, "/", "\") ' UNIXスラッシュ → Windows用バックスラッシュ

' デバッグ用：デコードされたパスを表示
MsgBox "デコードされたパス: " & decodedPath

' フォルダの存在確認
Set fso = CreateObject("Scripting.FileSystemObject")
If Not fso.FolderExists(decodedPath) Then
    MsgBox "フォルダが見つかりません: " & decodedPath
    ' 親フォルダの存在も確認
    Dim parentPath
    parentPath = fso.GetParentFolderName(decodedPath)
    If parentPath <> "" Then
        If fso.FolderExists(parentPath) Then
            MsgBox "親フォルダは存在します: " & parentPath
        Else
            MsgBox "親フォルダも見つかりません: " & parentPath
        End If
    End If
    WScript.Quit
End If

' explorer 実行
Set shell = CreateObject("WScript.Shell")
shell.Run "explorer.exe """ & decodedPath & """", 1, False