' openfolder.vbs
Set objShell = CreateObject("Wscript.Shell")
Set objArgs = WScript.Arguments

folderPath = objArgs(0)

' PowerShell を非表示で実行
objShell.Run "powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File """ & "C:\Scripts\openfolder.ps1" & """ """ & folderPath & """", 0, False
