"""Builds ../index.html from the source parts. Run: python3 build.py"""
import os
here=os.path.dirname(os.path.abspath(__file__));P=lambda *p:os.path.join(here,*p)
order=['part_data.js','part_state.js','part_compute.js','part_ill.js','part_db.js','part_views.js','part_supa.js','part_shell.js']
js='\n'.join(open(P(f),encoding='utf-8').read() for f in order)
page=open(P('part_head.html'),encoding='utf-8').read()+'\n<script>\n'+js+'\n</script>\n'
page=page.replace('__DATA__',open(P('..','data','vuelta2026.json'),encoding='utf-8').read())
head=('<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
 '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js"></script>\n'
 '<script src="config.js"></script>\n</head>\n<body>\n')
open(P('..','index.html'),'w',encoding='utf-8').write(head+page+'\n</body>\n</html>\n')
print('index.html built')
