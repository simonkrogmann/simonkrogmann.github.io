from pathlib import Path
import bibtexparser
from bibtexparser.middlewares import SeparateCoAuthors, SplitNameParts


IDS = []

def parse(advanced=False):
    # parser.customization = getnames
    with open('mine.bib', 'r') as bibtex_file:
        bibtex_string = bibtex_file.read()
    if advanced:
        middleware = [SeparateCoAuthors(), SplitNameParts()]
    else:
        middleware = []
    bib_database = bibtexparser.parse_string(bibtex_string, append_middleware=middleware)
    return bib_database


def extract_url(entry):
    if 'doi' in entry:
        return 'https://doi.org/' + entry['doi']
    if 'url' in entry:
        return entry['url']
    return None


def extract_venue(entry):
    if entry['ENTRYTYPE'] == 'inproceedings':
        return entry['booktitle']
    if entry['ENTRYTYPE'] == 'article':
        return entry['journal']
    raise ValueError


def build_authors(entry):
    names = []
    for author in entry['author']:
        for i, name in enumerate(author.first):
            author.first[i] = name[0]
        names.append(author.merge_first_name_first)
    return ', '.join(names)


def create_html(bib_database):
    global iDS
    for entry in bib_database.entries:
        entry["url"] = extract_url(entry)
        entry["venue"] = extract_venue(entry) + " " + entry["year"]
        entry["authors"] = build_authors(entry)

    skip = []

    for i, entry in enumerate(bib_database.entries):
        if i in skip:
            continue
        IDS.append(entry["ID"])
        title = entry['title']
        if entry["url"]:
            title = f'<a class="title" href="{entry["url"]}">{title}</a>'
        else:
            title = f'<p class="title">{title}</p>'

        venue = entry["venue"]
        if i + 1 < len(bib_database.entries):
            next_entry = bib_database.entries[i+1]
            if next_entry["title"] == entry["title"]:
                skip.append(i+1)
                venue += ", " + next_entry["venue"]

        links = f'<a href="bib/{entry["ID"]}.bib">cite</a>'
        if 'arxiv' in entry:
            links += f'<a href="{entry["arxiv"]}">arxiv</a>'
        # print(f"poster/{entry["ID"]}.pdf")
        if Path(f'docs/poster/{entry["ID"]}.pdf').exists():
            links += f'<a href="poster/{entry["ID"]}.pdf">poster</a>'
        if 'code' in entry:
            links += f'<a href="{entry["code"]}">code</a>'
        if 'data' in entry:
            links += f'<a href="{entry["data"]}">data</a>'
        img = f'<svg></svg>'
        if Path(f'docs/paper-icon/{entry["ID"]}.svg').exists():
            img = f'<svg><use href="paper-icon/{entry["ID"]}.svg#img"></use></svg>'
        elif Path(f'docs/paper-icon/{entry["ID"]}.webp').exists():
            img = f'<img src="paper-icon/{entry["ID"]}.webp">'


        print(f"""\
    <a id="{entry["ID"]}"></a><div class="paper">
        {img}<div class="paper-text">
        {title}
        <p class="authors">{entry["authors"]}</p>
        <p class="conf">{venue}</p>
        {links}
    </div></div>""")


def create_bib_files(bib_database):
    Path("docs/bib").mkdir(parents=True, exist_ok=True)
    for entry in bib_database.entries:
        for tag in ['code', 'data', 'arxiv']:
            if tag in entry:
                del entry[tag]
        single_entry_db = bibtexparser.Library([entry])
        with open(f'docs/bib/{entry["ID"]}.bib', 'w') as write_file:
            write_file.write(bibtexparser.write_string(single_entry_db))


def main():
    global IDS
    advanced_database = parse(True)
    create_html(advanced_database)
    database = parse()
    create_bib_files(database)
    IDS = ['#' + x for x in IDS]
    print("\n\nIDs:", ", ".join(IDS))


if __name__ == '__main__':
    main()
