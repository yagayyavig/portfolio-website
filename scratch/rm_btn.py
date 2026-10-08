import re
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('index.html', 'w', encoding='utf-8') as f:
    for line in lines:
        if 'btn-secondary interactive' in line and 'fa-download' in line:
            continue
        f.write(line)
