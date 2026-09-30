import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Reproducible source for the editable deck. Requires @oai/artifact-tool.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const BUILD = process.env.NURT_DECK_BUILD || path.join(ROOT, 'tmp/presentation');
const SKILL = process.env.NURT_PRESENTATIONS_SKILL || 'C:/Users/daniel/.codex/plugins/cache/openai-primary-runtime/presentations/26.921.10847/skills/presentations';
const RUNTIME = process.env.NURT_RUNTIME || 'C:/Users/daniel/.cache/codex-runtimes/codex-primary-runtime/dependencies';
process.env.RUNTIME_NODE_MODULES ||= path.join(RUNTIME,'node/node_modules');
const { Presentation, PresentationFile } = await import(pathToFileURL(path.join(RUNTIME,'node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs')).href).catch(async () => await import('@oai/artifact-tool'));
const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')).href);
await fs.mkdir(BUILD,{recursive:true});
await fs.mkdir(path.join(HERE,'assets'),{recursive:true});

const C={navy:'#10272C',paper:'#F5F4ED',teal:'#33B6A5',amber:'#D8A449',muted:'#587078',light:'#B3C6C6',line:'#CDD8D4',white:'#FFFFFF'};
const W=1280,H=720,FONT='Segoe UI';
const deck=Presentation.create({slideSize:{width:W,height:H}});
const spec=[];
let page;
function tx(text,x,y,w,h,size=28,color=C.navy,bold=false,align='left'){
  const shape=page.slide.shapes.add({geometry:'textbox',name:`text-${page.items.length}`,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  shape.text=text;
  shape.text.style={typeface:FONT,fontSize:size,color,bold,alignment:align,verticalAlignment:'top',wrap:'none',autoFit:'none',insets:{left:0,right:0,top:0,bottom:0}};
  page.items.push({kind:'text',text,x,y,w,h,size,color,bold,align});
  return shape;
}
function rect(x,y,w,h,fill,line='none',width=0){
  const sh=page.slide.shapes.add({geometry:'rect',name:`rect-${page.items.length}`,position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width}});
  page.items.push({kind:'rect',x,y,w,h,fill,line,width});return sh;
}
function line(x,y,x2,y2,color=C.line,width=2,dashed=false){
  page.slide.shapes.add({geometry:'line',name:`line-${page.items.length}`,position:{left:x,top:y,width:x2-x,height:y2-y},fill:'none',line:{fill:color,width,style:dashed?'dashed':'solid'}});
  page.items.push({kind:'line',x,y,x2,y2,color,width,dashed});
}
function node(label,x,y,w,h,{fill=C.paper,color=C.navy,size=26,border=C.line}={}){
  const sh=rect(x,y,w,h,fill,border,2);tx(label,x+20,y+18,w-40,h-28,size,color,true);
  return {sh,x,y,w,h};
}
function arrow(a,b,from='right',to='left',color=C.teal){
  page.slide.shapes.connect(a.sh,b.sh,{kind:'elbow',fromSide:from,toSide:to,line:{fill:color,width:3},tail:{type:'triangle',width:'med',length:'med'}});
  const anchor=(n,side)=>side==='right'?[n.x+n.w,n.y+n.h/2]:side==='left'?[n.x,n.y+n.h/2]:side==='top'?[n.x+n.w/2,n.y]:[n.x+n.w/2,n.y+n.h];
  page.items.push({kind:'arrow',from:anchor(a,from),to:anchor(b,to),fromSide:from,toSide:to,color,width:3});
}
async function img(filename,x,y,w,h,{crop=null,fit='contain'}={}){
  const src=path.join(HERE,'assets',filename);
  try {const bytes=await fs.readFile(src);page.slide.images.add({blob:bytes,contentType:'image/png',alt:'Rzeczywisty zrzut prototypu NURT. Dane demonstracyjne.',fit,position:{left:x,top:y,width:w,height:h},...(crop?{crop}:{} )});page.items.push({kind:'image',src:`assets/${filename}`,x,y,w,h,crop,fit});}
  catch(err){if(process.env.NURT_ALLOW_DRAFT!=='1')throw new Error(`Missing final screenshot: ${src}`);rect(x,y,w,h,'#234348');tx('Zrzut prototypu w przygotowaniu',x+30,y+40,w-60,80,28,C.light);}
}
function start(bg=C.paper){
  const slide=deck.slides.add();slide.background.fill=bg;page={slide,background:bg,items:[],notes:''};spec.push(page);return page;
}
function footer(n,dark=false,label='NURT'){
  tx(label,64,668,1090,25,16,dark?C.light:C.muted);
  tx(String(n).padStart(2,'0'),1150,666,66,30,18,dark?C.light:C.muted,false,'right');
}
function notes(text){page.notes=text;page.slide.speakerNotes.textFrame.setText(text);}

start(C.navy);
tx('NURT C2',60,48,650,122,88,C.paper,true);
tx('Od obrazu z drona\ndo decyzji w powodzi',64,193,750,155,52,C.paper,true);
tx('LOT-01 daje decyzję.\nLOT-02 potwierdza jej aktualność.',66,394,650,96,30,C.light);
tx('Uszatki',66,592,670,42,28,C.teal,true);
await img('nurt-case.png',832,58,388,574,{fit:'cover',crop:{left:0.42,top:0.04,right:0,bottom:0.04}});
footer(1,true,'Prototyp demonstracyjny. Scenariusz i dane symulowane.');
notes('Podczas powodzi problemem nie jest tylko brak obrazu. Sztab musi ustalić, który obraz wymaga działania teraz. NURT pomaga dyżurnemu uporządkować obserwacje z drona i zachować ich dalszy ciąg aż do ponownego sprawdzenia. Pokazujemy prototyp na całkowicie syntetycznym scenariuszu. Zrzut pochodzi z aplikacji dostarczonej w repozytorium.\nŹródło koncepcji: BRZEG-Dual-Use-Hackathon-brief.md, sekcje „Rekomendowany projekt” i „Użytkownik i scenariusz demonstracyjny”.');

start();
tx('Droga może być zalana.\nDyżurny musi wiedzieć, co dalej.',64,48,1148,150,50,C.navy,true);
tx('„Czy dojedziemy\ndo odciętej\nzabudowy?”',64,274,580,245,55,C.navy,true);
tx('SYTUACJA DEMONSTRACYJNA',755,254,450,30,18,C.muted,true);
tx('Sygnał ze zgłoszenia',755,316,450,44,31,C.navy,true);
tx('Droga wymaga sprawdzenia.\nInformacja pozostaje niepewna.',755,366,450,83,25,C.muted);
tx('Dyżurny gminnego sztabu',755,487,450,44,29,C.navy,true);
tx('Wybiera odcinek do rozpoznania\ni potrzebuje aktualnego obrazu.',755,535,450,82,25,C.muted);
footer(2);
notes('Bohaterem jest dyżurny gminnego sztabu. Po intensywnych opadach otrzymuje sygnał, że odcinek drogi może być nieprzejezdny i część zabudowy może być odcięta. To realistyczny, ale fikcyjny przypadek. Dyżurny nie potrzebuje kolejnego złożonego panelu GIS. Musi wiedzieć, gdzie skierować rozpoznanie i co zrobić z jego wynikiem. Dokładny obszar zespół dostosuje do zadania wydarzenia.\nŹródło: brief, „Użytkownik i scenariusz demonstracyjny”.');

start(C.navy);
tx('Sam podgląd nie daje decyzji',64,48,1152,80,52,C.paper,true);
tx('Obraz z drona\nZgłoszenie\nMapa terenu',64,224,600,248,51,C.light);
line(688,204,688,590,'#365057',2);
const questions=[['Gdzie?','Dokładna lokalizacja'],['Kiedy?','Czas obserwacji'],['Z jaką pewnością?','Potwierdzenie albo weryfikacja'],['Co teraz?','Sprawa do decyzji dyżurnego']];
questions.forEach((q,i)=>{tx(q[0],757,203+i*99,451,41,29,C.teal,true);tx(q[1],757,248+i*99,451,35,22,C.light);});
footer(3,true,'NURT uzupełnia mapę i obraz o uporządkowany zapis sprawy.');
notes('Nagranie ma wartość operacyjną, gdy właściwa osoba dostaje aktualną i zrozumiałą informację. NURT uzupełnia dotychczasowe narzędzia, porządkując odpowiedzi na cztery pytania: gdzie, kiedy, z jaką pewnością i co dalej. Nie twierdzimy, że istniejące systemy tego nie potrafią. Nasz prototyp koncentruje się na niewielkim przepływie możliwym do pokazania i sprawdzenia z dyżurnym.\nŹródło: brief, „Innowacja do wyeksponowania”.');

start();
tx('Misja zaczyna się od potrzeby sztabu',64,48,1152,88,49,C.navy,true);
tx('Dron dostarcza świeżą obserwację trudno dostępnego miejsca.',64,153,1152,50,29,C.muted);
const n1=node('Potrzeba\nsztabu',64,267,245,108);
const n2=node('Zadanie lotu\ndla operatora',366,267,245,108);
const n3=node('Dron: obraz\ni lokalizacja',668,267,245,108,{fill:C.teal,border:C.teal});
const n4=node('Obserwacja',970,267,245,108);
const n5=node('Karta\ndziałania',970,466,245,108);
const n6=node('Decyzja\ndyżurnego',668,466,245,108,{fill:C.navy,color:C.paper,border:C.navy});
const n7=node('Ponowne\npotwierdzenie',366,466,245,108);
arrow(n1,n2);arrow(n2,n3);arrow(n3,n4);arrow(n4,n5,'bottom','top');arrow(n5,n6,'left','right');arrow(n6,n7,'left','right');
tx('Operator odpowiada za lot.\nCzłowiek zatwierdza działanie.',64,478,270,89,22,C.muted);
footer(4);
notes('Sztab zgłasza potrzebę. Uprawniony operator przygotowuje misję i wykonuje lot zgodnie z właściwymi procedurami. Dron dostarcza obraz z lokalizacją. Człowiek opisuje obserwację, a NURT pokazuje kartę. Dyżurny zatwierdza następny krok. Sprawdzenie w terenie albo ponowny lot zamyka obieg. Bez drona brakuje aktualnego rozpoznania trudno dostępnego miejsca. W demonstracji importujemy przygotowany scenariusz. Nie sterujemy sprzętem i nie wysyłamy rozkazów służbom.\nŹródło: brief, „Pętla dronowa”, „Innowacja do wyeksponowania”.');

start(C.navy);
tx('Zobacz NURT C2 w 60 sekund',64,33,1152,70,49,C.paper,true);
tx('Działające demo. Jawny priorytet, decyzja człowieka i LOT-02.',64,112,1152,35,22,C.light);
await img('nurt-overview.png',62,171,1156,442,{fit:'contain'});
footer(5,true,'Zrzut działającego prototypu. Mapa i obserwacje są syntetyczne.');
notes('POKAZ 60 SEKUND. 0–10 s: wybierz OBS-01 „Woda na dojeździe do mostu”, Most Zachodni, sektor B2. Powiedz, że dane i obszar są syntetyczne. 10–25 s: wskaż źródło, czas i pewność. Potwierdzona obserwacja wody nie jest potwierdzeniem bezpieczeństwa drogi. 25–40 s: wpisz decyzję i kliknij „Zapisz decyzję”, potem „Zleć ponowny lot”. 40–60 s: w zadaniach kliknij „Importuj LOT-02”. Raport potwierdza utrzymywanie się wody. Dyżurny zapisuje status „Nadal aktualna”. Nie twierdzimy, że droga została otwarta. Jeśli aplikacja jest niedostępna, pokaż zrzut i opowiedz ten sam przypadek jako pokaz statyczny.\nŹródło: dostarczony prototyp NURT, zestaw danych demonstracyjnych.');

start(C.navy);
tx('Każda obserwacja ma dalszy ciąg',64,48,1152,80,51,C.paper,true);
tx('Karta zachowuje źródło informacji i wynik sprawdzenia.',64,145,1152,48,29,C.light);
const q1=node('Obserwacja',80,259,440,104,{fill:'#1B3940',color:C.paper,border:'#496269',size:31});
const q2=node('Priorytet',756,259,440,104,{fill:'#1B3940',color:C.paper,border:'#496269',size:31});
const q3=node('Decyzja człowieka',756,445,440,104,{fill:C.teal,border:C.teal,size:31});
const q4=node('Ponowna weryfikacja',80,445,440,104,{fill:'#1B3940',color:C.paper,border:'#496269',size:31});
arrow(q1,q2);arrow(q2,q3,'bottom','top');arrow(q3,q4,'left','right');arrow(q4,q1,'top','bottom');
tx('Źródło     Czas     Lokalizacja     Pewność     Status',128,595,1024,45,26,C.light,false,'center');
footer(6,true);
notes('Innowacją prototypu jest zamknięty obieg sprawy. Z pojedynczego kadru powstaje śledzona obserwacja. Dyżurny widzi priorytet i podejmuje decyzję. Kolejna obserwacja potwierdza zmianę albo ponawia potrzebę sprawdzenia. Źródło, czas, lokalizacja i niepewność pozostają z kartą. To mechanizm, który ma ograniczyć pracę na starym lub źle zrozumianym obrazie. Jego wpływ trzeba dopiero zmierzyć.\nŹródło: brief, „Innowacja do wyeksponowania”.');

start();
tx('Wartość operacyjna\ndo sprawdzenia w pilotażu',64,48,1152,146,50,C.navy,true);
tx('CELE PILOTAŻU, DO POMIARU',64,215,1152,31,19,C.muted,true);
const ms=[['Czas do karty','Od przesłania obserwacji\ndo czytelnej karty działania.','sekundy / minuty'],['Kompletność','Odsetek kart z zapisanym\nźródłem i czasem.','procent kart'],['Czas do decyzji','Od karty do zatwierdzenia\nnastępnego kroku.','minuty'],['Weryfikacja','Odsetek spraw sprawdzonych\nponownie w ustalonym oknie.','procent spraw']];
ms.forEach((m,i)=>{const x=i%2?700:64;const y=i<2?286:475;tx(m[0],x,y,510,48,33,C.navy,true);tx(m[1],x,y+58,510,75,25,C.muted);tx(m[2],x,y+137,510,31,19,'#198B7D',true);});
footer(7,false,'Porównanie z dotychczasową pracą sztabu podczas tego samego ćwiczenia. Brak wyników pilotażu.');
notes('Nie pokazujemy fikcyjnych wyników. Podczas ćwiczenia porównamy dotychczasową pracę sztabu z tym samym scenariuszem obsługiwanym w NURT. Zmierzymy czas od przekazania obserwacji do karty, kompletność źródła i czasu, czas do decyzji oraz odsetek spraw sprawdzonych ponownie. Progi sukcesu i okno weryfikacji ustalimy z partnerem przed pilotażem. To proponowane wskaźniki, a nie osiągnięty efekt.\nŹródło: brief, „Wartość operacyjna, którą można zmierzyć”.');

start();
tx('Do zbudowania na istniejących zasobach',64,48,1152,85,46,C.navy,true);
const a1=node('Dron\ni operator',64,236,250,104,{size:29});
const a2=node('Import\nobserwacji',401,236,250,104,{fill:C.teal,border:C.teal,size:29});
const a3=node('Interfejs\nsztabu',738,236,250,104,{fill:C.navy,color:C.paper,border:C.navy,size:29});
arrow(a1,a2);arrow(a2,a3);
tx('Aktualne rozpoznanie miejsca',64,177,610,36,25,C.muted);
const a4=node('Warstwy kontekstowe',738,416,450,76,{size:28});
arrow(a4,a3,'top','bottom');
tx('Planowane źródła:\nGeoportal / GUGiK, IMGW, Copernicus',64,410,630,98,26,C.muted);
tx('Działa w demo',64,552,430,38,27,C.navy,true);
tx('Mapa syntetyczna, porównanie lotów,\npriorytety, decyzja i LOT-02.',64,597,575,64,23,C.muted);
tx('Następny etap',738,552,450,38,27,C.navy,true);
tx('Dane z lotu, role użytkowników\ni dobrane warstwy publiczne.',738,597,470,64,23,C.muted);
footer(8,false,'Dane publiczne są kontekstem. Obserwacja z lotu opisuje stan miejsca w konkretnym czasie.');
notes('Wykorzystujemy istniejący dron i operatora, bez budowy sprzętu ani własnego modelu AI. Prototyp ma syntetyczną mapę, przygotowany import obserwacji, karty i lokalny zapis decyzji. Źródła publiczne z materiałów wydarzenia to kandydaci do kolejnego etapu, a nie zintegrowane usługi demo. Przed użyciem trzeba wybrać potrzebne warstwy, sprawdzić licencję, dostęp, datę i aktualność. Mapa terenu nie potwierdza bieżącej przejezdności drogi. Nie ma integracji ze służbami ani sterowania dronem.\nŹródła: brief, „Dane kontekstowe” i „Wykonalność”. Baza danych publicznych.pdf, lista źródeł organizatora.');

start();
tx('Bezpieczne użycie dual-use',64,48,1152,82,51,C.navy,true);
tx('Już w demonstracji',64,198,530,46,32,C.navy,true);
tx('Decyzję zatwierdza człowiek\nŹródło, wiek i pewność informacji\nSyntetyczne dane bez danych osób',64,270,570,146,27,C.muted);
tx('Warunki pilotażu',710,198,500,46,32,C.navy,true);
tx('Role i ograniczony dostęp\nMinimalizacja danych o osobach\nUprawniony operator i procedury lotu',710,270,505,146,27,C.muted);
const p1=node('Demo',64,503,301,85,{fill:C.navy,color:C.paper,border:C.navy,size:30});
const p2=node('Ćwiczenie',489,503,301,85,{size:30});
const p3=node('Pilotaż ze sztabem',914,503,301,85,{fill:C.teal,border:C.teal,size:29});
arrow(p1,p2);arrow(p2,p3);
footer(9,false,'Zastosowanie ratownicze i defensywne. Loty i dostęp do danych podlegają procedurom.');
notes('Zakres jest ratowniczy, defensywny i organizacyjny. Decyzję podejmuje człowiek. Demo używa danych syntetycznych i jawnie pokazuje niepewność oraz czas. Pilotaż wymaga odrębnego wdrożenia ról i kontroli dostępu, zasad przechowywania oraz minimalizacji danych. Misję realizuje uprawniony operator w dopuszczonych warunkach. Plan zaczyna się od demo, następnie wspólnego ćwiczenia, a dopiero później pilotażu ze sztabem. Prototyp nie jest systemem do prowadzenia realnej akcji.\nŹródło: brief, „Wykonalność, ryzyka i odpowiedzialność”.');

start(C.navy);
tx('NURT C2',64,43,1152,110,72,C.paper,true);
tx('Najpierw rozpoznaj.\nPotem zdecyduj.\nNa końcu potwierdź.',64,202,725,255,57,C.paper,true);
tx('ZESPÓŁ USZATKI',848,205,368,30,21,C.teal,true);
tx('Daniel Prajsnar\nBartosz Orzechowski\nFabian Drapak\nJan Bysiewicz',848,253,368,151,25,C.paper);
tx('OTWARTE REPOZYTORIUM',848,433,368,30,18,C.light,true);
tx('github.com/Bysiu/Nurt',848,478,368,49,24,C.teal,true);
tx('Szukamy partnera do ćwiczenia\nz gminnym sztabem.',64,557,1146,85,33,C.teal,true);
footer(10,true,'Prototyp i materiały przygotowane z pomocą AI (Codex). Efekt operacyjny do pomiaru.');
notes('NURT porządkuje drogę od rozpoznania do działania, zachowując odpowiedzialność człowieka. Szukamy partnera operacyjnego do ćwiczenia, które zweryfikuje przydatność przepływu i pozwoli zmierzyć jego efekt. Najpierw rozpoznaj. Potem zdecyduj. Na końcu potwierdź.\nZespół: Uszatki. Daniel Prajsnar, Bartosz Orzechowki, Fabian Drapak, Jan Bysiewicz. Przed zgłoszeniem zespół uzupełnia rzeczywisty link do otwartego repozytorium. Placeholder nie jest adresem repozytorium.\nUjawnienie użycia AI: prototyp, dokumentację i prezentację przygotowano z pomocą Codex; syntetyczny obraz scenariusza powstał przy użyciu generatora obrazu OpenAI. Zespół odpowiada za sprawdzenie materiałów i ostateczne zgłoszenie. Źródło wymagania ujawnienia: ogólny regulamin wydarzenia, sekcja IX.\nŹródło koncepcji: brief, plan prezentacji, slajd 10.');

const serializedSpec=JSON.stringify({width:W,height:H,font:FONT,slides:spec.map(({slide,...s})=>s)},null,2);
await fs.writeFile(path.join(BUILD,'deck-spec.json'),serializedSpec);
if(process.env.NURT_ALLOW_DRAFT!=='1')await fs.writeFile(path.join(HERE,'deck-spec.json'),serializedSpec);
await fs.writeFile(path.join(HERE,'speaker-notes.md'),'# NURT - notatki prezentera\n\nPolska prezentacja, 10 slajdów. Czas wystąpienia: [CZAS PREZENTACJI]. Obszar docelowy: [OBSZAR / SCENARIUSZ].\n\n'+spec.map((s,i)=>`## Slajd ${i+1}\n\n${s.notes}\n`).join('\n'));
const candidate=path.join(BUILD,'nurt-c2-candidate.pptx');
await(await PresentationFile.exportPptx(deck)).save(candidate);
for(let i=0;i<spec.length;i++){
  const image=await deck.export({slide:spec[i].slide,format:'png',scale:2});
  await fs.writeFile(path.join(BUILD,`slide-${i+1}.png`),new Uint8Array(await image.arrayBuffer()));
  const layout=await spec[i].slide.export({format:'layout'});await fs.writeFile(path.join(BUILD,`slide-${i+1}.layout.json`),await layout.text());
}
if(process.env.NURT_ALLOW_DRAFT!=='1'){
  const result=await finalizePresentation({explicitTotalSlideCount:10,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(HERE,'NURT-C2-prezentacja.pptx'),pythonExecutable:path.join(RUNTIME,'python/python.exe'),integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],fontPolicy:{basis:'design',families:[FONT]},verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'nurt-c2.validation.json')});
  console.log(JSON.stringify(result));
}
console.log(`Deck has ${spec.length} slides. Spec: ${path.join(BUILD,'deck-spec.json')}`);
