import os, re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    # 1. supabase.from as any -> supabase.from
    content = re.sub(r'\(supabase\.from as any\)', 'supabase.from', content)
    content = re.sub(r'\(supabase as any\)\.from', 'supabase.from', content)
    content = re.sub(r'\(supabase\.rpc as any\)', 'supabase.rpc', content)
    
    # 2. .from("table" as any) -> .from("table")
    content = re.sub(r'\.from\("([^"]+)" as any\)', r'.from("\1")', content)
    
    # 3. .insert(payload as any) -> .insert(payload)
    content = re.sub(r'\.insert\(([^)]+) as any\)', r'.insert(\1)', content)
    
    # 4. window as any
    content = re.sub(r'\(window as any\)', 'window', content)
    
    # 5. any[] -> unknown[]
    content = re.sub(r': any\[\]', ': unknown[]', content)
    
    # 6. : any -> : unknown (except where it's part of a word)
    content = re.sub(r'(?<!\w): any(?!\w)', ': unknown', content)
    
    # 7. as any -> as unknown
    content = re.sub(r'(?<!\w)as any(?!\w)', 'as unknown', content)
    
    # 8. eslint-disable.*no-explicit-any
    content = re.sub(r',\s*@typescript-eslint/no-explicit-any', '', content)
    content = re.sub(r'/\*\s*eslint-disable\s+@typescript-eslint/no-explicit-any\s*\*/\n', '', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Replaced all any occurrences")
