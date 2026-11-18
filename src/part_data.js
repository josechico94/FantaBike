const VUELTA_DATA=__DATA__;

/* ---------- races ---------- */
const VST=[
 [1,"2026-08-22","Monaco","Monaco",9,"itt",0],[2,"2026-08-23","Monaco","Manosque",215.2,"hilly",0],[3,"2026-08-24","Gruissan","Font-Romeu",166.7,"medium",1],
 [4,"2026-08-25","Andorra la Vella","Andorra la Vella",104.9,"mountain",0],[5,"2026-08-26","Falset","Roquetes",171.1,"hilly",0],[6,"2026-08-27","Alcossebre","Castelló",176.8,"medium",0],
 [7,"2026-08-28","Vall d'Alba","Valdelinares",149.9,"mountain",1],[8,"2026-08-29","Puçol","Xeraco",176.4,"flat",0],[9,"2026-08-30","Villajoyosa","Alto de Aitana",179.8,"mountain",1],
 [10,"2026-09-01","Alcaraz","Elche de la Sierra",168.8,"hilly",0],[11,"2026-09-02","Cartagena","Lorca",170.2,"flat",0],[12,"2026-09-03","Vera","Calar Alto",166,"mountain",1],
 [13,"2026-09-04","Almuñécar","Loja",193,"medium",0],[14,"2026-09-05","Jaén","Sierra de la Pandera",167,"mountain",1],[15,"2026-09-06","Palma del Río","Córdoba",175,"medium",0],
 [16,"2026-09-08","Cortegana","Palos de la Frontera",162,"hilly",0],[17,"2026-09-09","Dos Hermanas","Sevilla",161,"flat",0],[18,"2026-09-10","El Puerto de Santa María","Jerez de la Frontera",32.5,"itt",0],
 [19,"2026-09-11","Vélez-Málaga","Peñas Blancas",174,"hilly",1],[20,"2026-09-12","La Calahorra","Collado del Alguacil",194,"mountain",1],[21,"2026-09-13","Granada","Granada",167,"flat",0]];
const TST=[
 [1,"2027-07-02","Edinburgh","Carlisle",184,"flat",0],[2,"2027-07-03","Keswick","Liverpool",223,"hilly",0],[3,"2027-07-04","Welshpool","Cardiff",223,"hilly",0],
 [4,"2027-07-06","Cherbourg","Cherbourg",171,"hilly",0],[5,"2027-07-07","Pontorson","Plumelec",178,"hilly",1],[6,"2027-07-08","Vannes","Angers",193,"hilly",0],
 [7,"2027-07-09","Blois","Chambord",38,"itt",0],[8,"2027-07-10","Bourges","Le Creusot",224,"hilly",0],[9,"2027-07-11","Villars-les-Dombes","Grand Colombier",162,"mountain",1],
 [10,"2027-07-13","Annecy","Sallanches",171,"mountain",0],[11,"2027-07-14","Cluses","Les Saisies",150,"mountain",1],[12,"2027-07-15","Chambéry","Valence",162,"flat",0],
 [13,"2027-07-16","Aubenas","Montpellier",164,"flat",0],[14,"2027-07-17","Montpellier","Mende",199,"mountain",1],[15,"2027-07-18","Rodez","Albi",169,"hilly",0],
 [16,"2027-07-20","Toulouse","Toulouse",33,"itt",0],[17,"2027-07-21","Muret","Pau",186,"flat",0],[18,"2027-07-22","Pau","Col du Portet",174,"mountain",1],
 [19,"2027-07-23","Hasparren","Laruns",160,"mountain",0],[20,"2027-07-24","Maubourguet","Libourne",198,"flat",0],[21,"2027-07-25","Saint-Quentin-en-Yvelines","Paris",116,"flat",0]];
const mk=a=>a.map(s=>({n:s[0],d:s[1],a:s[2],b:s[3],km:s[4],ty:s[5],top:!!s[6]}));
const RACES={
 vuelta:{id:"vuelta",name:"La Vuelta 2026",short:"Vuelta 26",sub:"22/08 – 13/09",lead:"rossa",stages:mk(VST),res:VUELTA_DATA.res,start:"2026-08-22",km:"3.275"},
 tour:{id:"tour",name:"Tour de France 2027",short:"Tour 27",sub:"02/07 – 25/07",lead:"gialla",stages:mk(TST),res:[],start:"2027-07-02",km:"3.479"}
};
const DTS=VUELTA_DATA.dts;

/* team jersey designs: [base, accent, pattern] */
const KIT={"Tommy":["#1f6feb","#ffffff","sash"],"Ricky":["#111827","#ff4d6d","band"],"Teo":["#7c3aed","#fde047","split"],"Tancredi":["#0f766e","#f97316","hoops"],
 "Ric Spada":["#ea580c","#1e293b","chev"],"Umbo":["#6b7280","#facc15","sleeves"],"Luca e Franci":["#e11d48","#ffffff","stripes"],"Giuanin":["#14532d","#a3e635","band"],
 "Ale Roc":["#0ea5e9","#0b1220","chev"],"Ale B.":["#f5f5f4","#2563eb","sash"]};

/* ---------- i18n ---------- */
const T={
 it:{home:"Corsa",cls:"Classifiche",stg:"Tappe",teams:"Squadre",rules:"Regole",stage:"Tappa",after:"Dopo la tappa",next:"Prossima",
  rossa:"Maglia rossa",gialla:"Maglia gialla",verde:"Maglia verde",pois:"Maglia a pois",gen:"Generale",pts:"Punti",kom:"GPM",
  leader:"Leader",gap:"Distacco",dayWin:"Miglior DS di giornata",with:"con",podium:"Podio generale",road:"Il cammino",
  done:"tappe corse",left:"da correre",trend:"Andamento in classifica",trendSub:"Posizione in generale tappa per tappa",
  all:"Tutti",picks:"Scelte tappa per tappa",best:"Miglior tappa",pos:"Pos.",points:"punti",
  neutral:"Nessun tempo registrato in questa tappa: non cambia la classifica a tempi.",future:"Scelte e risultati non ancora caricati.",
  bonus:"abbuono",pen:"penalità",total:"Tempo",rider:"Corridore",ds:"Direttore sportivo",team:"Squadra",
  ty:{flat:"Pianura",hilly:"Mossa",medium:"Media montagna",mountain:"Montagna",itt:"Crono individuale"},
  top:"arrivo in salita",days:"giorni",hours:"ore",min:"min",startsIn:"Partenza tra",grand:"Grande Partenza",
  noRes:"La corsa non è ancora partita. Le classifiche si riempiono dopo la prima tappa.",
  tapTeam:"Tocca una squadra per vedere le sue scelte",pick:"Scegli",who:"Chi sei?",whoSub:"Scegli il tuo direttore sportivo. Resta legato al tuo account.",taken:"già preso",change:"Cambia DS",
  closesIn:"Chiusura scelte",yourPick:"Il tuo corridore",save:"Conferma",saved:"Scelta salvata",clear:"Rimuovi scelta",used:"Corridori già usati in questa corsa",
  usedErr:"Hai già usato {r} nella tappa {n}. Scegli un altro corridore.",empty:"Scrivi il nome di un corridore.",
  signin:"Per scegliere il tuo corridore devi aprire la pagina su claude.ai con un account che ha accesso. Le classifiche si vedono comunque.",
  readonly:"Puoi vedere la pagina ma non salvare scelte: chiedi all'organizzatore l'accesso da Collaboratore.",
  noOpen:"Nessuna tappa aperta in questa corsa: le scelte sono chiuse. Passa all'altra corsa per scegliere.",hidden:"nascosta",chose:"hanno già scelto",
  revealed:"Scelte svelate · risultati in arrivo",loading:"Caricamento delle scelte…",ph:"Nome del corridore",lockNote:"Le scelte degli altri si vedono solo dopo la chiusura, alle 12:00 del giorno di tappa.",
  saveErr:"Non è stato possibile salvare. Controlla la connessione e riprova.",none:"Nessuna scelta",goPick:"Scegli il corridore",takenErr:"Questo DS è già stato preso da un'altra persona.",nowPick:"Scelta attuale",noChoice:"senza scelta",retired:"ritirato",dupT:"Corridore ripetuto",editRes:"Modifica risultati",
  resT:"Risultati della tappa",resSub:"Inserisci i dati dei corridori scelti dall'ordine d'arrivo ufficiale. Tempo h:mm:ss; abbuoni e penalità in secondi.",tArr:"Tempo",rit:"Rit.",
  resSave:"Salva risultati",resSaved:"Risultati salvati: classifiche aggiornate.",fmtErr:"Tempo non valido per {r}: usa h:mm:ss oppure segna Rit.",
  r5h:"Senza scelta o ritirato",r5:"Se non scegli entro la chiusura o il tuo corridore non arriva, prendi il tempo del DS più lento della tappa e zero punti.",stageWin:"vittorie di tappa",
  rulesT:"Come funziona",
  r1h:"Un corridore per tappa",r1:"Ogni direttore sportivo sceglie un solo corridore prima di ogni tappa. Lo stesso corridore non si può scegliere due volte in tutta la corsa.",
  r2h:"Classifica generale",r2:"Il tempo d'arrivo del tuo corridore, meno gli abbuoni, più le eventuali penalità. Si sommano tutte le tappe: vince chi ha il tempo più basso.",
  r3h:"Maglia verde",r3:"Si sommano i punti della classifica a punti presi dal tuo corridore in ogni tappa. Vince chi ne ha di più.",
  r4h:"Maglia a pois",r4:"Si sommano i punti dei Gran Premi della Montagna presi dal tuo corridore. Vince chi ne ha di più.",
  src:"Dati: file FANTA Vuelta 2026 (aggiornato alla tappa 19). Percorsi da fonti di stampa.",
  of:"di",km:"km",leaderOf:"Leader",count:"Mancano",vs:"vs",noPick:"—"},
 es:{home:"Carrera",cls:"Clasificaciones",stg:"Etapas",teams:"Equipos",rules:"Reglas",stage:"Etapa",after:"Tras la etapa",next:"Próxima",
  rossa:"Maillot rojo",gialla:"Maillot amarillo",verde:"Maillot verde",pois:"Maillot de lunares",gen:"General",pts:"Puntos",kom:"Montaña",
  leader:"Líder",gap:"Diferencia",dayWin:"Mejor director del día",with:"con",podium:"Podio general",road:"El camino",
  done:"etapas corridas",left:"por correr",trend:"Evolución en la general",trendSub:"Posición en la general etapa por etapa",
  all:"Todos",picks:"Elecciones etapa por etapa",best:"Mejor etapa",pos:"Pos.",points:"puntos",
  neutral:"No hay tiempos registrados en esta etapa: no cambia la clasificación por tiempos.",future:"Elecciones y resultados aún no cargados.",
  bonus:"bonificación",pen:"penalización",total:"Tiempo",rider:"Corredor",ds:"Director deportivo",team:"Equipo",
  ty:{flat:"Llana",hilly:"Ondulada",medium:"Media montaña",mountain:"Montaña",itt:"Contrarreloj individual"},
  top:"final en alto",days:"días",hours:"horas",min:"min",startsIn:"Salida en",grand:"Gran Salida",
  noRes:"La carrera todavía no empezó. Las clasificaciones se llenan después de la primera etapa.",
  tapTeam:"Toca un equipo para ver sus elecciones",pick:"Elegir",who:"¿Quién eres?",whoSub:"Elige tu director deportivo. Queda ligado a tu cuenta.",taken:"ya elegido",change:"Cambiar DD",
  closesIn:"Cierre de elecciones",yourPick:"Tu corredor",save:"Confirmar",saved:"Elección guardada",clear:"Quitar elección",used:"Corredores ya usados en esta carrera",
  usedErr:"Ya usaste a {r} en la etapa {n}. Elige otro corredor.",empty:"Escribe el nombre de un corredor.",
  signin:"Para elegir tu corredor tienes que abrir la página en claude.ai con una cuenta que tenga acceso. Las clasificaciones se ven igual.",
  readonly:"Puedes ver la página pero no guardar elecciones: pide al organizador acceso de Colaborador.",
  noOpen:"No hay etapas abiertas en esta carrera: las elecciones están cerradas. Cambia a la otra carrera para elegir.",hidden:"oculta",chose:"ya eligieron",
  revealed:"Elecciones reveladas · resultados por llegar",loading:"Cargando elecciones…",ph:"Nombre del corredor",lockNote:"Las elecciones de los demás se ven recién después del cierre, a las 12:00 del día de la etapa.",
  saveErr:"No se pudo guardar. Revisa la conexión e inténtalo de nuevo.",none:"Sin elección",goPick:"Elegir corredor",takenErr:"Este DD ya lo eligió otra persona.",nowPick:"Elección actual",noChoice:"sin elección",retired:"retirado",dupT:"Corredor repetido",editRes:"Editar resultados",
  resT:"Resultados de la etapa",resSub:"Carga los datos de los corredores elegidos según la clasificación oficial. Tiempo h:mm:ss; bonificaciones y penalizaciones en segundos.",tArr:"Tiempo",rit:"Ret.",
  resSave:"Guardar resultados",resSaved:"Resultados guardados: clasificaciones actualizadas.",fmtErr:"Tiempo no válido para {r}: usa h:mm:ss o marca Ret.",
  r5h:"Sin elección o retirado",r5:"Si no eliges antes del cierre o tu corredor no llega, recibes el tiempo del director más lento de la etapa y cero puntos.",stageWin:"victorias de etapa",
  rulesT:"Cómo funciona",
  r1h:"Un corredor por etapa",r1:"Cada director deportivo elige un solo corredor antes de cada etapa. No se puede repetir el mismo corredor en toda la carrera.",
  r2h:"Clasificación general",r2:"El tiempo de llegada de tu corredor, menos las bonificaciones, más las penalizaciones. Se suman todas las etapas: gana el tiempo más bajo.",
  r3h:"Maillot verde",r3:"Se suman los puntos de la clasificación por puntos que consigue tu corredor en cada etapa. Gana quien tenga más.",
  r4h:"Maillot de lunares",r4:"Se suman los puntos de los premios de montaña que consigue tu corredor. Gana quien tenga más.",
  src:"Datos: archivo FANTA Vuelta 2026 (actualizado a la etapa 19). Recorridos de fuentes de prensa.",
  of:"de",km:"km",leaderOf:"Líder",count:"Faltan",vs:"vs",noPick:"—"}
};

