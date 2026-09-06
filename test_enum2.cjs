const fs = require('fs');

const psScript = `
Add-Type @"
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public static class WinEnum2 {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);
    [DllImport("user32.dll")] public static extern int GetClassName(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);

    public static List<string> GetAllForPid(uint targetPid) {
        var list = new List<string>();
        EnumWindows((hWnd, lParam) => {
            uint procId;
            GetWindowThreadProcessId(hWnd, out procId);
            if (procId == targetPid) {
                var sbTitle = new System.Text.StringBuilder(256);
                GetWindowText(hWnd, sbTitle, 256);
                var sbClass = new System.Text.StringBuilder(256);
                GetClassName(hWnd, sbClass, 256);
                list.Add(hWnd.ToString() + "|" + sbClass.ToString() + "|" + sbTitle.ToString());
            }
            return true;
        }, IntPtr.Zero);
        return list;
    }
}
"@

$procList = Get-Process -Name 'Antigravity IDE' | Select-Object -ExpandProperty Id
foreach ($p in $procList) {
    $res = [WinEnum2]::GetAllForPid([uint32]$p)
    if ($res.Count -gt 0) {
        Write-Output ("PID " + $p + ":")
        foreach ($r in $res) {
            Write-Output ("  " + $r)
        }
    }
}
`;

fs.writeFileSync('test_enum2.ps1', psScript);
