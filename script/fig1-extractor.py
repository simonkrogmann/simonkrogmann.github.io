import re
from pathlib import Path

def find_name():
    for name in ["journal", "arxiv", "main", "paper"]:
        p = Path(name).with_suffix(".tex")
        if p.exists():
            return p
    tex_files = list(Path(".").glob("*.tex"))
    return Path(tex_files[0])


def change_class(content):
    print(re.findall(r'\\documentclass.*', content)[0])
    return re.sub(r'\\documentclass.*', r'\\documentclass{standalone}', content)

def isolate_first_image(content):
    image = re.findall(r'\\begin{tikzpicture}.*?\\end{tikzpicture}', content,re.DOTALL)[0]
    print(image)
    content = re.sub(r'\\begin{document}.*?\\end{document}', r'\\begin{document}____placeholder\\end{document}', content,flags=re.DOTALL)
    return content.replace("____placeholder", image)

def main():
    name = find_name()
    with open(name, "r") as f:
        content = f.read()
    content = change_class(content)
    content = isolate_first_image(content)
    with open("icon.tex", "w") as f:
        f.write(content)


if __name__ == '__main__':
    main()
