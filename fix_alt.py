import os, re
count = 0
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            # Add alt to <img if missing
            def replace_img(match):
                tag = match.group(0)
                if 'alt=' not in tag and 'alt {' not in tag and 'alt}' not in tag:
                    global count
                    count += 1
                    return tag.replace('<img ', '<img alt="StashSaarthi Visual" ')
                return tag
            
            new_content = re.sub(r'<img [^>]*>', replace_img, new_content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
print(f'Fixed {count} images')
