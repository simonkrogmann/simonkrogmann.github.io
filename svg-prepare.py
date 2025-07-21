from pathlib import Path


def change_colors(content):
    content = content.replace(r'rgb(0%, 0%, 0%)', r'var(--main-color)')
    return content.replace(r'rgb(100%, 100%, 100%)', r'var(--bg-color)')


def add_id(content):
    return content.replace(r'xmlns:xlink="http://www.w3.org/1999/xlink" width', r'xmlns:xlink="http://www.w3.org/1999/xlink" id="img" width')
    

def main():
    for p in Path("docs/paper-icon").glob("*.svg"):
        with open(p, "r") as f:
            content = f.read()
        content = change_colors(content)
        content = add_id(content)
        with open(p, "w") as f:
            f.write(content)


if __name__ == '__main__':
    main()
