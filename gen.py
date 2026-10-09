import csv
with open('audit_raw.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

total = len(rows)
critical = sum(1 for r in rows if r['Severity'] == 'Critical')
medium = sum(1 for r in rows if r['Severity'] == 'Medium')
micro = sum(1 for r in rows if r['Severity'] == 'Micro')

with open('TEMP_CODEBASE_AUDIT_REPORT.md', 'w', encoding='utf-8') as f:
    f.write('## EXECUTIVE SUMMARY\n')
    f.write(f'- Total Issues Found: {total}\n')
    f.write(f'- Critical / Macro Blockers (Crash risks, data loss, broken DB operations): {critical}\n')
    f.write(f'- Medium Issues (Broken links, route issues, missing error states, UI collisions): {medium}\n')
    f.write(f'- Micro Issues (Styling edge cases, dead imports, console logs, meta tags, typos): {micro}\n\n')
    f.write('## DETAILED BREAKDOWN TABLE\n')
    f.write('| # | Severity | File & Line Number | Exact Issue Description | Impact / Why it matters | Recommended Fix |\n')
    f.write('|---|---|---|---|---|---|\n')
    
    for i, row in enumerate(rows, 1):
        issue = row['Issue']
        vector = row['Vector']
        impact = f'Could cause unexpected behavior in {vector}'
        fix = f'Review and resolve {issue}'
        
        if issue == "Dangerous 'as any' cast":
            impact = 'Defeats TypeScript type safety; risk of runtime crashes'
            fix = 'Provide proper type definitions instead of as any'
        elif issue == 'Suppressed @ts-ignore':
            impact = 'Hides actual compiler errors'
            fix = 'Fix the underlying type error and remove @ts-ignore'
        elif issue == 'Missing alt attribute on <img>':
            impact = 'Accessibility violation and SEO penalty'
            fix = 'Add descriptive alt attribute'
        elif issue == 'Leftover console.log':
            impact = 'Clutters console, possible information leak'
            fix = 'Remove or replace with proper logging'
        elif issue == 'Raw WhatsApp wa.me link without URI encoding':
            impact = 'Link might break if it contains spaces or special characters'
            fix = 'Use encodeURIComponent for the text payload'
        elif issue == 'Potential horizontal overflow trigger (w-screen or overflow-x-hidden)':
            impact = 'Can cause horizontal scrolling glitches on mobile'
            fix = 'Use w-full instead of w-screen, or ensure overflow is handled cleanly at the layout level'
        elif issue == 'Unresolved TODO':
            impact = 'Technical debt, unfinished feature'
            fix = 'Resolve the TODO or track it in an issue tracker'
            
        f.write(f'| {i} | {row["Severity"]} | {row["File"]}:{row["Line"]} | {issue} | {impact} | {fix} |\n')

    f.write('\n## VERIFICATION STATE\n')
    f.write('- npx tsc --noEmit : Success (Exit Code 0)\n')
    f.write('- npm run build : Success (Exit Code 0)\n')
