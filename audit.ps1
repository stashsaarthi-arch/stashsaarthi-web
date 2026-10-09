$results = @()
$files = Get-ChildItem -Path "src" -Recurse -Include *.ts,*.tsx,*.html,*.css
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName
    $lineNum = 1
    foreach ($line in $content) {
        if ($line -match "as any") { $results += [PSCustomObject]@{ File = $file.Name; Line = $lineNum; Issue = "Dangerous 'as any' cast"; Severity = "Critical"; Vector = "Compilation" } }
        if ($line -match "@ts-ignore") { $results += [PSCustomObject]@{ File = $file.Name; Line = $lineNum; Issue = "Suppressed @ts-ignore"; Severity = "Critical"; Vector = "Compilation" } }
        if ($line -match "@ts-expect-error") { $results += [PSCustomObject]@{ File = $file.Name; Line = $lineNum; Issue = "Suppressed @ts-expect-error"; Severity = "Critical"; Vector = "Compilation" } }
        if ($line -match "console\.log") { $results += [PSCustomObject]@{ File = $file.Name; Line = $lineNum; Issue = "Leftover console.log"; Severity = "Micro"; Vector = "Typography" } }
        if ($line -match "TODO") { $results += [PSCustomObject]@{ File = $file.Name; Line = $lineNum; Issue = "Unresolved TODO"; Severity = "Micro"; Vector = "Typography" } }
        if ($line -match "<img" -and $line -notmatch "alt=") { $results += [PSCustomObject]@{ File = $file.Name; Line = $lineNum; Issue = "Missing alt attribute on <img>"; Severity = "Medium"; Vector = "Assets" } }
        if ($line -match "wa\.me" -and $line -notmatch "encodeURIComponent") { $results += [PSCustomObject]@{ File = $file.Name; Line = $lineNum; Issue = "Raw WhatsApp wa.me link without URI encoding"; Severity = "Medium"; Vector = "Assets" } }
        if ($line -match "overflow-x-hidden" -or $line -match "w-screen") { $results += [PSCustomObject]@{ File = $file.Name; Line = $lineNum; Issue = "Potential horizontal overflow trigger (w-screen or overflow-x-hidden)"; Severity = "Medium"; Vector = "UI/UX" } }
        
        $lineNum++
    }
}
$results | Export-Csv -Path "audit_raw.csv" -NoTypeInformation
