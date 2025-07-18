' explorer_open.vbs
' �����œn���ꂽ�p�X���G�N�X�v���[���[�ŊJ��

Option Explicit

Dim shell, args, encodedPath, path

Set shell = CreateObject("WScript.Shell")
Set args = WScript.Arguments

If args.Count = 0 Then
    MsgBox "�p�X���w�肳��Ă��܂���B", vbExclamation, "�G�N�X�v���[���[���J���܂���"
    WScript.Quit
End If

' �������� explorer: �������i���[�v�h�~�j
encodedPath = args(0)
If LCase(Left(encodedPath, 9)) = "explorer:" Then
    encodedPath = Mid(encodedPath, 10)
End If

' �f�R�[�h�i�O�̂��� %20 �Ȃǂ��X�y�[�X�ɖ߂��j
encodedPath = Replace(encodedPath, "%20", " ")
encodedPath = Replace(encodedPath, "%5C", "\")
encodedPath = Replace(encodedPath, "%25", "%") ' %25 = %

' �Ō�� \index.html �Ȃǂ��폜���ăt�H���_�p�X�ɕϊ��i�����g���q�� .html �Ȃ�j
If LCase(Right(encodedPath, 5)) = ".html" Then
    path = Left(encodedPath, InStrRev(encodedPath, "\") - 1)
Else
    path = encodedPath
End If

' �p�X�����݂��邩�m�F
Dim fso
Set fso = CreateObject("Scripting.FileSystemObject")
If Not fso.FolderExists(path) Then
    MsgBox "�w�肳�ꂽ�p�X�����݂��܂���: " & vbCrLf & path, vbExclamation, "�G�N�X�v���[���[�ŊJ���܂���"
    WScript.Quit
End If

' �G�N�X�v���[���[�ŊJ��
shell.Run "explorer.exe """ & path & """", 1, False