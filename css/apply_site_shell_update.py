from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    "index.html", "projects/index.html", "methods/index.html", "data/index.html",
    "resources/index.html", "about/index.html", "projects/_template/index.html",
    "projects/sel-001-ireland-quality-of-life/index.html",
    "projects/sel-002-bandon-public-transport/index.html",
    "projects/sel-003-west-cork-public-transport/index.html",
    "projects/sel-004-ireland-forestry-land-use/index.html",
    "projects/sel-005-greater-athens-heat-risk/index.html",
    "projects/sel-006-county-wicklow-wind-energy/index.html",
    "projects/sel-007-rondonia-deforestation/index.html",
]
NAV = {"Research":"/", "Projects":"/projects/", "Methods":"/methods/", "Data":"/data/", "Resources":"/resources/", "About":"/about/"}

def get_block(html, tag):
    m = re.search(rf"<({tag})\b[^>]*>.*?</{tag}>", html, re.I|re.S)
    if not m: raise RuntimeError(f"Canonical index.html has no <{tag}> block")
    return m.group(0)

def normalise_shell(s):
    for old,new in [('href="./"','href="/"'),('src="media/branding/logo.png"','src="/media/branding/logo.png"'),('href="projects/','href="/projects/'),('href="methods/','href="/methods/'),('href="data/','href="/data/'),('href="resources/','href="/resources/'),('href="about/','href="/about/')]: s=s.replace(old,new)
    return s

def active_shell(header, rel):
    section = "Research" if rel == "index.html" else (Path(rel).parts[0] if Path(rel).parts else "")
    active = {"projects":"Projects","methods":"Methods","data":"Data","resources":"Resources","about":"About"}.get(section,"Research")
    header = re.sub(r'\sclass="active"', '', header)
    href = NAV[active]
    pat = rf'(<a\s+)([^>]*href="{re.escape(href)}"[^>]*)>'
    return re.sub(pat, lambda m: m.group(1)+m.group(2)+' class="active">', header, count=1, flags=re.I)

def shared_links(html):
    for name in ('sel-theme','sel-components','sel-standards'):
        html = re.sub(rf'<link\s+[^>]*href=["\'][^"\']*{name}\.css[^>]*>\s*','',html,re.I)
    html = html.replace('../css/portfolio.css','/css/legacy/portfolio.css')
    links = ('    <link rel="stylesheet" href="/css/sel-theme.css">\n'
             '    <link rel="stylesheet" href="/css/sel-components.css">\n'
             '    <link rel="stylesheet" href="/css/sel-standards.css">\n')
    return re.sub(r'</head>', links+'</head>', html, count=1, flags=re.I)

def replace(html, tag, replacement):
    new,n = re.subn(rf'<{tag}\b[^>]*>.*?</{tag}>', replacement, html, count=1, flags=re.I|re.S)
    if n != 1: raise RuntimeError(f"Could not replace <{tag}>")
    return new

def main():
    index=(ROOT/'index.html').read_text(encoding='utf-8')
    header=normalise_shell(get_block(index,'header'))
    footer=normalise_shell(get_block(index,'footer'))
    for rel in TARGETS:
        p=ROOT/rel
        if not p.exists():
            print('SKIP missing:',rel); continue
        html=p.read_text(encoding='utf-8')
        html=replace(html,'header',active_shell(header,rel))
        html=replace(html,'footer',footer)
        html=shared_links(html)
        p.write_text(html,encoding='utf-8')
        print('UPDATED',rel)
if __name__=='__main__': main()
