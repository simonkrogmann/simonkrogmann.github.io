from pathlib import Path
import bibtexparser
from bibtexparser.middlewares import SeparateCoAuthors, SplitNameParts


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
    for entry in bib_database.entries:
        url = extract_url(entry)
        venue = extract_venue(entry)
        authors = build_authors(entry)
        title = entry['title']
        if url:
            title = f'<a href="{url}">{title}</a>'

        links = f'<a href="bib/{entry["ID"]}.bib">cite</a>'
        if 'arxiv' in entry:
            links += f'<a href="{entry["arxiv"]}">arxiv</a>'
        if Path(f'poster/{entry["ID"]}.pdf').exists():
            links += f'<a href="poster/{entry["ID"]}.pdf">poster</a>'
        if 'code' in entry:
            links += f'<a href="{entry["code"]}">code</a>'
        if 'data' in entry:
            links += f'<a href="{entry["data"]}">data</a>'

        print(f"""\
    <div class="paper">
        <p class="title">{title}</a></p>
        <p class="authors">{authors}</p>
        <p class="conf">{venue} {entry["year"]}</p>
        {links}
    </div>""")


def create_bib_files(bib_database):
    Path("bib").mkdir(parents=True, exist_ok=True)
    for entry in bib_database.entries:
        for tag in ['code', 'data', 'arxiv']:
            if tag in entry:
                del entry[tag]
        single_entry_db = bibtexparser.Library([entry])
        with open(f'bib/{entry["ID"]}.bib', 'w') as write_file:
            write_file.write(bibtexparser.write_string(single_entry_db))


def main():
    advanced_database = parse(True)
    create_html(advanced_database)
    database = parse()
    create_bib_files(database)


if __name__ == '__main__':
    main()
