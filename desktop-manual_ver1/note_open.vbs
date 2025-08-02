Option Explicit

If WScript.Arguments.Count = 0 Then
    WScript.Quit
End If

Dim rawArg, finalPath
rawArg = WScript.Arguments(0)

If Left(rawArg, 5) = "note:" Then
    rawArg = Mid(rawArg, 6)
End If

finalPath = DecodeUrl(rawArg)
finalPath = Replace(finalPath, "/", "\")

Dim shell
Set shell = CreateObject("WScript.Shell")
shell.Run "notepad.exe " & Chr(34) & finalPath & Chr(34), 1, False

Function DecodeUrl(str)
    Dim i, result, char, c1, c2, c3, code
    i = 1
    Do While i <= Len(str)
        char = Mid(str, i, 1)
        If char = "%" Then
            If i + 2 <= Len(str) Then
                c1 = CLng("&H" & Mid(str, i + 1, 2))
                If (c1 And &H80) = 0 Then ' 1-byte sequence (ASCII)
                    result = result & Chr(c1)
                    i = i + 2
                ElseIf (c1 And &HE0) = &HC0 Then ' 2-byte sequence
                    If i + 5 <= Len(str) Then
                        c2 = CLng("&H" & Mid(str, i + 4, 2))
                        code = ((c1 And &H1F) * &H40) + (c2 And &H3F)
                        result = result & ChrW(code)
                        i = i + 5
                    End If
                ElseIf (c1 And &HF0) = &HE0 Then ' 3-byte sequence
                    If i + 8 <= Len(str) Then
                        c2 = CLng("&H" & Mid(str, i + 4, 2))
                        c3 = CLng("&H" & Mid(str, i + 7, 2))
                        code = ((c1 And &HF) * &H1000) + ((c2 And &H3F) * &H40) + (c3 And &H3F)
                        result = result & ChrW(code)
                        i = i + 8
                    End If
                End If
            End If
        Else
            result = result & char
        End If
        i = i + 1
    Loop
    DecodeUrl = result
End Function