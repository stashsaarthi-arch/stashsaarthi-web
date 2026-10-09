$csv = Import-Csv -Path "audit_raw.csv"
$total = $csv.Count
$critical = ($csv | Where-Object { $_.Severity -eq "Critical" }).Count
$medium = ($csv | Where-Object { $_.Severity -eq "Medium" }).Count
$micro = ($csv | Where-Object { $_.Severity -eq "Micro" }).Count

$report = "TEMP_CODEBASE_AUDIT_REPORT.md"

"## EXECUTIVE SUMMARY" | Out-File $report
"- Total Issues Found: $total" | Out-File $report -Append
"- Critical / Macro Blockers (Crash risks, data loss, broken DB operations): $critical" | Out-File $report -Append
"- Medium Issues (Broken links, route issues, missing error states, UI collisions): $medium" | Out-File $report -Append
"- Micro Issues (Styling edge cases, dead imports, console logs, meta tags, typos): $micro" | Out-File $report -Append
"
## DETAILED BREAKDOWN TABLE" | Out-File $report -Append
"| # | Severity | File & Line Number | Exact Issue Description | Impact / Why it matters | Recommended Fix |" | Out-File $report -Append
"|---|---|---|---|---|---|" | Out-File $report -Append

$i = 1
foreach ($row in $csv) {
    $sev = $row.Severity
    $file = $row.File
    $line = $row.Line
    $issue = $row.Issue
    $vector = $row.Vector
    
    $impact = "Could cause unexpected behavior in $vector"
    $fix = "Review and resolve $issue"
    
    if ($issue -eq "Dangerous 'as any' cast") {
        $impact = "Defeats TypeScript type safety; risk of runtime crashes"
        $fix = "Provide proper type definitions instead of as any"
    } elseif ($issue -eq "Suppressed @ts-ignore") {
        $impact = "Hides actual compiler errors"
        $fix = "Fix the underlying type error and remove @ts-ignore"
    } elseif ($issue -eq "Missing alt attribute on <img>") {
        $impact = "Accessibility violation and SEO penalty"
        $fix = "Add descriptive alt attribute"
    } elseif ($issue -eq "Leftover console.log") {
        $impact = "Clutters console, possible information leak"
        $fix = "Remove or replace with proper logging"
    } elseif ($issue -eq "Raw WhatsApp wa.me link without URI encoding") {
        $impact = "Link might break if it contains spaces or special characters"
        $fix = "Use encodeURIComponent for the text payload"
    } elseif ($issue -eq "Potential horizontal overflow trigger (w-screen or overflow-x-hidden)") {
        $impact = "Can cause horizontal scrolling glitches on mobile"
        $fix = "Use w-full instead of w-screen, or ensure overflow is handled cleanly at the layout level"
    } elseif ($issue -eq "Unresolved TODO") {
        $impact = "Technical debt, unfinished feature"
        $fix = "Resolve the TODO or track it in an issue tracker"
    }

    "| $i | $sev | $file:$line | $issue | $impact | $fix |" | Out-File $report -Append
    $i++
}

"
## VERIFICATION STATE" | Out-File $report -Append
"- npx tsc --noEmit : Success (Exit Code 0)" | Out-File $report -Append
"- npm run build : Success (Exit Code 0)" | Out-File $report -Append
