# FantaBike

Fanta-ciclismo per la lega: ogni direttore sportivo sceglie un corridore per tappa (mai lo stesso due volte), e l'app calcola maglia rossa/gialla (tempi − abbuoni + penalità), maglia verde e maglia a pois.

- **La Vuelta 2026** – risultati reali dal file Excel della lega (fino alla tappa 19).
- **Tour de France 2027** – percorso ufficiale, pronto per le scelte.
- Interfaccia in italiano e spagnolo, tema chiaro e scuro.

## Struttura

```
index.html            app completa in un solo file (generata)
data/vuelta2026.json  scelte e risultati estratti dall'Excel
src/                  sorgenti
  part_head.html      stili e struttura della pagina
  part_data.js        tappe, squadre, testi IT/ES
  part_state.js       stato e formattazione
  part_compute.js     calcolo classifiche
  part_ill.js         illustrazioni SVG (maglie, scene, altimetria)
  part_views.js       schermate
  part_shell.js       navigazione
  part_db.js, part_db2.js  scelte e risultati condivisi
  build.py            ricostruisce index.html
```

Per rigenerare `index.html` dopo una modifica: `cd src && python3 build.py`

## Nota sulle scelte condivise

Le scelte dei corridori e l'inserimento dei risultati usano il database condiviso di Claude: funzionano solo nella versione pubblicata su claude.ai. Aprendo `index.html` altrove (per esempio GitHub Pages) classifiche, tappe e squadre si vedono, ma la scheda **Scegli** mostra un avviso e non salva.
