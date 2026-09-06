
Add-Type @"
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public static class WinEnum {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);

    public static List<IntPtr> GetWindowsForPid(uint targetPid) {
        var list = new List<IntPtr>();
        EnumWindows((hWnd, lParam) => {
            uint procId;
            GetWindowThreadProcessId(hWnd, out procId);
            if (procId == targetPid && IsWindowVisible(hWnd)) {
                list.Add(hWnd);
            }
            return true;
        }, IntPtr.Zero);
        return list;
    }
}
"@

$procList = Get-Process -Name 'Antigravity IDE' | Select-Object -ExpandProperty Id
foreach ($p in $procList) {
    $hwnds = [WinEnum]::GetWindowsForPid([uint32]$p)
    if ($hwnds.Count -gt 0) {
        Write-Output ("PID " + $p + " has " + $hwnds.Count + " visible windows: " + ($hwnds -join ", "))
        foreach ($h in $hwnds) {
            $sb = New-Object System.Text.StringBuilder 256
            [WinEnum]::GetWindowText($h, $sb, 256) | Out-Null
            Write-Output ("  HWND " + $h + " Title: '" + $sb.ToString() + "'")
        }
    }
}
