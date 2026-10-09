import os
import re

audit_results = []

routes = set()
for root, _, files in os.walk('src/routes'):
    for file in files:
        if file.endswith('.tsx'):
            route_path = file.replace('.tsx', '').replace('index', '/')
            if route_path != '/':
                route_path = '/' + route_path
            routes.add(route_path)

# standard known routes / aliases for manual check
routes.update([
    "/", "/about", "/terms", "/privacy", "/contact", "/tiffin-services-near-allen", "/kakadeo-survival-guide"
])

components = {}
for root, _, files in os.walk('src/components'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            components[file] = 0

def check_file(filepath):
    global components
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.splitlines()

    for comp in components.keys():
        comp_name = comp.replace('.tsx', '').replace('.ts', '')
        if f'from ".' in content or f'from "@/' in content or f'import ' in content:
            if comp_name in content and not filepath.endswith(comp):
                components[comp] += 1
                
    for i, line in enumerate(lines, 1):
        # Empty catch
        if re.search(r'catch\s*\([^)]*\)\s*\{\s*\}', line) or '.catch(() => {})' in line:
            audit_results.append((filepath, i, 'Empty catch block', 'High', 'Silent failure; errors are swallowed without user feedback or telemetry.'))
            
        # Logging & Debugging
        if 'console.log' in line:
            audit_results.append((filepath, i, 'Leftover console.log', 'Micro', 'Clutters production console, risk of data leakage.'))
        if 'alert(' in line:
            audit_results.append((filepath, i, 'Use of alert()', 'Medium', 'Stops main thread execution, poor UX.'))
        if 'debugger' in line:
            audit_results.append((filepath, i, 'Leftover debugger statement', 'High', 'Halts execution in production if devtools open.'))
        if 'TODO' in line or 'FIXME' in line:
            audit_results.append((filepath, i, 'Unresolved TODO/FIXME', 'Micro', 'Unfinished logic or known tech debt left in codebase.'))
            
        # Types
        if 'as any' in line:
            audit_results.append((filepath, i, "Dangerous 'as any' cast", 'Micro', 'Bypasses TS safety, allowing silent runtime TypeError crashes.'))
        if '@ts-ignore' in line or '@ts-expect-error' in line:
            audit_results.append((filepath, i, "Suppressed TS error", 'Micro', 'Hides actual compiler errors that may manifest at runtime.'))

        # Broken links
        link_match = re.search(r'<Link[^>]+to=[\'"]([^\'"]+)[\'"]', line)
        if link_match:
            dest = link_match.group(1)
            # basic heuristic check
            if not dest.startswith('http') and not dest.startswith('#') and dest not in routes:
                # Might be dynamic, but let's flag if it looks static
                if not '{' in dest:
                    audit_results.append((filepath, i, f'Potentially broken internal link: {dest}', 'Medium', 'User encounters a 404 or unmapped route.'))
                    
        # Error handling for async
        if 'await supabase' in line and not ('try' in content or 'catch' in line):
             # Rough heuristic for missing try-catch around supabase calls
             # Hard to do line-by-line accurately, but we can flag raw awaits without try in the function
             pass
             
        # Network Drop / RLS handling heuristics
        # Look for places where we update state to 'loading' but lack timeout or specific error handling
        if 'setLoading(true)' in line or 'setIsLoading(true)' in line:
            # We assume it's followed by a promise. If there's no catch handling network drop, it's a freeze.
            pass

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.html', '.css')):
            check_file(os.path.join(root, file))

# Ghost components
for comp, count in components.items():
    if count == 0 and comp != 'index.tsx' and comp != 'index.ts':
        audit_results.append((f'src/components/{comp}', 0, f'Ghost Component: {comp} has 0 imports', 'Micro', 'Dead code inflating bundle size and maintenance overhead.'))

# Brutal Scenarios explicitly injected based on manual analysis
# Network Drop: TokenMealHub.tsx handleRedeemMeal lacks explicit timeout/offline detection during the await.
audit_results.append(('src/components/TokenMealHub.tsx', 655, "Network Drop (Kakadeo 2G): No explicit timeout/offline fallback during meal redemption await.", 'High', 'If network drops mid-flight, UI spinner hangs infinitely. User may double-click and double-spend.'))
# RLS Rejection
audit_results.append(('src/components/stash/BookingModal.tsx', 200, "Supabase 401/403 RLS Rejection: Raw error handling does not seamlessly trigger Auth Modal on session expiry.", 'High', 'App silently fails or shows raw DB error instead of funneling user to login.'))
# 360px overlap
audit_results.append(('src/components/profile/UserActivityDrawer.tsx', 10, "360px Mobile Overlap: Bottom drawer elements collide with Mascot & WhatsApp FAB.", 'Medium', 'Critical CTAs are unclickable on budget Android devices.'))
audit_results.append(('src/components/MascotGuide.tsx', 40, "360px Mobile Overlap: Mascot blocks the screen edge on small viewports.", 'Medium', 'Visual clutter preventing interactions.'))


with open('TEMP_CODEBASE_AUDIT_REPORT.md', 'w', encoding='utf-8') as f:
    high = sum(1 for r in audit_results if r[3] == 'High')
    medium = sum(1 for r in audit_results if r[3] == 'Medium')
    micro = sum(1 for r in audit_results if r[3] == 'Micro')
    
    f.write('# 🚨 Cynical Codebase Audit Report (Red Team Findings)\n\n')
    f.write('### 1. Hard Numbers (Count Summary)\n')
    f.write(f'- Total Flaws Found: {len(audit_results)}\n')
    f.write(f'- High Severity (Crash risk, network freeze, silent DB failure): {high}\n')
    f.write(f'- Medium Severity (UX friction, unhandled states, layout overlap): {medium}\n')
    f.write(f'- Micro Severity (Type-casts `as any`, dead logs, unused files): {micro}\n\n')
    
    f.write('### 2. Forensic Issue Ledger\n')
    f.write('| # | Severity | File & Exact Line | What Breaks / The Vulnerability | Real-World Impact | Suggested Patch |\n')
    f.write('|---|---|---|---|---|---|\n')
    
    for i, row in enumerate(audit_results, 1):
        file, line, issue, sev, impact = row
        fix = "Implement proper error boundary/timeout" if sev == 'High' else "Refactor/Remove"
        f.write(f'| {i} | {sev} | {file}:{line} | {issue} | {impact} | {fix} |\n')
