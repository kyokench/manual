Option Explicit

Dim shell, rawArg, decodedArg, finalPath, command
Set shell = CreateObject("WScript.Shell")

If WScript.Arguments.Count = 0 Then
    MsgBox "����������܂���B", 48, "�G���["
    WScript.Quit
End If

' note: �Ŏn�܂���������o��
rawArg = WScript.Arguments(0)
If Left(rawArg, 5) = "note:" Then
    rawArg = Mid(rawArg, 6)
End If

' URL�f�R�[�h�֐��i%xx�`�� �� �����j
Function UrlDecode(str)
    Dim i, ch, code
    i = 1
    Do While i <= Len(str)
        ch = Mid(str, i, 1)
        If ch = "%" Then
            code = Mid(str, i + 1, 2)
            UrlDecode = UrlDecode & Chr(CLng("&H" & code))
            i = i + 3
        Else
            UrlDecode = UrlDecode & ch
            i = i + 1
        End If
    Loop
End Function

decodedArg = UrlDecode(rawArg)
decodedArg = Replace(decodedArg, "/", "\")

' �_�u���N�H�[�g�ň͂�Ŏ��s
finalPath = Chr(34) & decodedArg & Chr(34)
command = "notepad.exe " & finalPath
shell.Run command, 1, False