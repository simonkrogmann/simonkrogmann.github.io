from pathlib import Path
import subprocess

for f in Path('.').iterdir():
    if f.suffix == ".pdf":
        subprocess.run(["gs", "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/default", "-dCompatibilityLevel=1.4", "-q", "-o", f"{f}.1", f])
        Path(f.name + ".1").rename(f)
