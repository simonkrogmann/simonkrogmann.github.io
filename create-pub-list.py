import bibtexparser
from bibtexparser.bibdatabase import BibDatabase
from bibtexparser.bwriter import BibTexWriter
import os.path
from pathlib import Path


def parse():
    with open('mine.bib', 'r') as bibtex_file:
        bib_database = bibtexparser.load(bibtex_file)

    return bib_database


def create_html(bib_database):

    for entry in bib_database.entries:
        url = ''
        if 'doi' in entry:
            url = 'https://doi.org/' + entry['doi']
        elif 'url' in entry:
            url = entry['url']
        title = entry['title']
        if url:
            title = f'<a href="{url}">{title}</a>'
        
        if entry['ENTRYTYPE'] == 'inproceedings':
            venue = entry['booktitle']
        elif entry['ENTRYTYPE'] == 'article':
            venue = entry['journal']
        else:
            raise Error
        links = f'<a href="bib/{entry["ID"]}.bib">cite</a>'
        if 'arxiv' in entry:
            links += f'<a href="{entry["arxiv"]}">arxiv</a>'
        if os.path.isfile(f'poster/{entry["ID"]}.pdf'):
            links += f'<a href="poster/{entry["ID"]}.pdf">poster</a>'
        if 'code' in entry:
            links += f'<a href="{entry["code"]}">code</a>'
        if 'data' in entry:
            links += f'<a href="{entry["data"]}">data</a>'

        print(f"""\
    <div class="paper">
        <p class="title">{title}</a></p>
        <p class="authors">{entry["author"]}</p>
        <p class="conf">{venue} {entry["year"]}</p>
        {links}
    </div>""")


def create_bib_files(bib_database):
    Path("bib").mkdir(parents=True, exist_ok=True)
    writer = BibTexWriter()
    for entry in bib_database.entries:
        single_entry_db = BibDatabase()
        single_entry_db.entries = [entry]
        with open(f'bib/{entry["ID"]}.bib', 'w') as write_file:
            write_file.write(writer.write(single_entry_db))


def main():
    database = parse()
    create_bib_files(database)
    create_html(database)


if __name__ == '__main__':
    main()
