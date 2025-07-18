' explorer_open.vbs
' 引数で渡されたパスをエクスプローラーで開く

Option Explicit

Dim shell, args, encodedPath, path

Set shell = CreateObject("WScript.Shell")
Set args = WScript.Arguments

If args.Count = 0 Then
    MsgBox "パスが指定されていません。", vbExclamation, "エクスプローラーを開けません"
    WScript.Quit
End If

' 引数から explorer: を除去（ループ防止）
encodedPath = args(0)
If LCase(Left(encodedPath, 9)) = "explorer:" Then
    encodedPath = Mid(encodedPath, 10)
End If

' デコード（念のため %20 などをスペースに戻す）
encodedPath = Replace(encodedPath, "%20", " ")
encodedPath = Replace(encodedPath, "%5C", "\")
encodedPath = Replace(encodedPath, "%25", "%") ' %25 = %

' 最後の \index.html などを削除してフォルダパスに変換（もし拡張子が .html なら）
If LCase(Right(encodedPath, 5)) = ".html" Then
    path = Left(encodedPath, InStrRev(encodedPath, "\") - 1)
Else
    path = encodedPath
End If

' パスが存在するか確認
Dim fso
Set fso = CreateObject("Scripting.FileSystemObject")
If Not fso.FolderExists(path) Then
    MsgBox "指定されたパスが存在しません: " & vbCrLf & path, vbExclamation, "エクスプローラーで開けません"
    WScript.Quit
End If

' エクスプローラーで開く
shell.Run "explorer.exe """ & path & """", 1, False