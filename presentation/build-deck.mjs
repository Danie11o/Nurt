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
tx('Dron dostarcza aktualny obraz.\nNURT prowadzi go do decyzji i weryfikacji.',66,394,700,96,28,C.light);
tx('Uszatki',66,592,670,42,28,C.teal,true);
await img('nurt-case.png',832,58,388,574,{fit:'cover',crop:{left:0.42,top:0.04,right:0,bottom:0.04}});
footer(1,true,'Prototyp demonstracyjny. Scenariusz i dane symulowane.');
notes('Podczas powodzi problemem nie jest tylko brak obrazu. Sztab musi ustalić, który obraz wymaga działania teraz. NURT pomaga dyżurnemu uporządkować obserwacje z drona i zachować ich dalszy ciąg aż do ponownego sprawdzenia. Pokazujemy prototyp na całkowicie syntetycznym scenariuszu. Zrzut pochodzi z aplikacji dostarczonej w repozytorium.\nŹródło koncepcji: BRZEG-Dual-Use-Hackathon-brief.md, sekcje „Rekomendowany projekt” i „Użytkownik i scenariusz demonstracyjny”.');

start();
tx('Problem operacyjny',64,48,1148,80,52,C.navy,true);
tx('„Czy ratownicy nadal\ndojadą do mieszkańców?”',64,205,575,170,48,C.navy,true);
tx('Dron może szybko sprawdzić teren.\nSam obraz nie wystarcza jednak\ndo bezpiecznej decyzji.',64,410,555,128,28,C.muted);
line(682,180,682,595,C.line,2);
tx('Obraz bez kontekstu',742,190,470,43,31,C.navy,true);
tx('Brakuje jednoznacznego czasu,\nmiejsca i źródła obserwacji.',742,239,470,62,23,C.muted);
tx('Decyzja bez zapisu',742,335,470,43,31,C.navy,true);
tx('Nie wiadomo, kto zatwierdził działanie\ni na jakiej podstawie.',742,384,470,62,23,C.muted);
tx('Brak ponownego sprawdzenia',742,480,470,43,31,C.navy,true);
tx('Sztab może pracować na obrazie,\nktóry stracił aktualność.',742,529,470,62,23,C.muted);
footer(2,false,'Problem: aktualny obraz z drona nie ma dalszego ciągu w procesie decyzyjnym.');
notes('Problem nie polega na braku kamer. Dron szybko dociera nad trudno dostępne miejsce, ale pojedynczy kadr nie odpowiada jeszcze na pytanie operacyjne. Sztab potrzebuje informacji o czasie, miejscu i źródle. Musi zapisać decyzję i sprawdzić, czy po kilkunastu minutach nadal jest aktualna. Scenariusz i dane w demonstracji są syntetyczne.');

start(C.navy);
tx('Rozwiązanie NURT C2',64,48,1152,80,52,C.paper,true);
tx('Dron dostarcza\nświeżą obserwację',64,187,520,94,36,C.paper,true);
tx('LOT-01 sprawdza wskazany odcinek.\nPrzekazuje obraz z czasem\ni lokalizacją.',64,300,520,105,25,C.light);
line(632,172,632,595,'#365057',2);
const solutions=[['NURT dodaje kontekst','Łączy materiał z lotem, miejscem,\nczasem i oceną pewności.'],['NURT tworzy sprawę','Pokazuje dowód, zmianę,\npriorytet i status.'],['Człowiek zatwierdza działanie','Dyżurny podejmuje decyzję.\nLOT-02 ponownie sprawdza sytuację.']];
solutions.forEach((q,i)=>{tx(q[0],700,175+i*135,500,42,29,C.teal,true);tx(q[1],700,224+i*135,500,72,22,C.light);});
tx('Efekt\nObraz z drona staje się\nudokumentowaną i aktualizowaną\nsprawą operacyjną.',64,475,520,132,28,C.teal,true);
footer(3,true,'Dron obserwuje. NURT porządkuje. Człowiek decyduje. LOT-02 weryfikuje.');
notes('NURT nie zastępuje operatora drona ani dyżurnego. Dron pełni rolę dynamicznego sensora. NURT porządkuje obserwację w kartę sprawy i zachowuje jej historię. Człowiek zatwierdza następny krok. Drugi lot aktualizuje status, dzięki czemu sztab nie opiera się wyłącznie na starym obrazie.');

start(C.navy);
await img('nurt-c2-jak-dziala.png',28,22,1224,688,{fit:'contain'});
footer(4,true,'Pełna pętla: potrzeba sztabu, LOT-01, decyzja człowieka i weryfikacja LOT-02.');
notes('Proces zaczyna pytanie sztabu. Operator wykonuje LOT-01, a dron dostarcza aktualny obraz z lokalizacją. NURT tworzy kartę sprawy z dowodem, zmianą i priorytetem. Dyżurny zatwierdza działanie. LOT-02 ponownie obserwuje ten sam odcinek i aktualizuje status. Demo nie steruje dronem ani nie wysyła poleceń do służb.');

start(C.navy);
tx('Demo prowadzi sprawę przez 8 kroków',64,33,1152,70,48,C.paper,true);
tx('Od zadania dla drona, przez decyzję dyżurnego, do ponownej obserwacji LOT-02.',64,112,1152,35,22,C.light);
await img('nurt-current-demo.png',62,171,1156,442,{fit:'contain'});
footer(5,true,'Zrzut działającego prototypu. Mapa i obserwacje są syntetyczne.');
notes('POKAZ OKOŁO 2 MINUT. Uruchom START DEMO i przechodź kolejno przez osiem kroków. W kroku drugim pokaż zadanie LOT-01 dla operatora. W kroku trzecim wskaż czas, lokalizację i źródło materiału z drona. W kroku szóstym pokaż jawny priorytet. W kroku siódmym podkreśl decyzję człowieka. W kroku ósmym pokaż LOT-02 i nowy czas obserwacji.');

start(C.navy);
tx('Pętla decyzji z udziałem drona',64,48,1152,80,51,C.paper,true);
tx('LOT-02 aktualizuje sprawę, zanim sztab zacznie pracować na nieaktualnym obrazie.',64,145,1152,48,27,C.light);
const q1=node('Obserwacja LOT-01',80,259,440,104,{fill:'#1B3940',color:C.paper,border:'#496269',size:29});
const q2=node('Priorytet NURT',756,259,440,104,{fill:'#1B3940',color:C.paper,border:'#496269',size:29});
const q3=node('Decyzja człowieka',756,445,440,104,{fill:C.teal,border:C.teal,size:31});
const q4=node('Weryfikacja LOT-02',80,445,440,104,{fill:'#1B3940',color:C.paper,border:'#496269',size:29});
arrow(q1,q2);arrow(q2,q3,'bottom','top');arrow(q3,q4,'left','right');arrow(q4,q1,'top','bottom');
tx('Źródło     Czas     Lokalizacja     Pewność     Status',128,595,1024,45,26,C.light,false,'center');
footer(6,true);
notes('Innowacją prototypu jest zamknięty obieg sprawy. Z pojedynczego kadru powstaje śledzona obserwacja. Dyżurny widzi priorytet i podejmuje decyzję. Kolejna obserwacja potwierdza zmianę albo ponawia potrzebę sprawdzenia. Źródło, czas, lokalizacja i niepewność pozostają z kartą. To mechanizm, który ma ograniczyć pracę na starym lub źle zrozumianym obrazie. Jego wpływ trzeba dopiero zmierzyć.\nŹródło: brief, „Innowacja do wyeksponowania”.');

start();
tx('Efekt do zmierzenia w pilotażu',64,48,1152,100,50,C.navy,true);
tx('CELE PILOTAŻU, DO POMIARU',64,215,1152,31,19,C.muted,true);
const ms=[['Czas od lotu do karty','Od materiału z drona\ndo czytelnej karty działania.','sekundy / minuty'],['Kompletność obserwacji','Odsetek kart z lotem,\nźródłem i czasem.','procent kart'],['Czas do decyzji','Od karty NURT do zatwierdzenia\nnastępnego kroku.','minuty'],['Ponowna obserwacja','Odsetek spraw sprawdzonych\nprzez LOT-02 w ustalonym oknie.','procent spraw']];
ms.forEach((m,i)=>{const x=i%2?700:64;const y=i<2?286:475;tx(m[0],x,y,510,48,33,C.navy,true);tx(m[1],x,y+58,510,75,25,C.muted);tx(m[2],x,y+137,510,31,19,'#198B7D',true);});
footer(7,false,'Porównanie z dotychczasową pracą sztabu podczas tego samego ćwiczenia. Brak wyników pilotażu.');
notes('Nie pokazujemy fikcyjnych wyników. Podczas ćwiczenia porównamy dotychczasową pracę sztabu z tym samym scenariuszem obsługiwanym w NURT. Zmierzymy czas od przekazania obserwacji do karty, kompletność źródła i czasu, czas do decyzji oraz odsetek spraw sprawdzonych ponownie. Progi sukcesu i okno weryfikacji ustalimy z partnerem przed pilotażem. To proponowane wskaźniki, a nie osiągnięty efekt.\nŹródło: brief, „Wartość operacyjna, którą można zmierzyć”.');

start();
tx('Dron jest dynamicznym sensorem NURT',64,48,1152,85,46,C.navy,true);
const a1=node('Dron\ni operator',64,236,250,104,{size:29});
const a2=node('Pakiet\nz lotu',401,236,250,104,{fill:C.teal,border:C.teal,size:29});
const a3=node('NURT dla\nsztabu',738,236,250,104,{fill:C.navy,color:C.paper,border:C.navy,size:29});
arrow(a1,a2);arrow(a2,a3);
tx('Aktualne rozpoznanie miejsca',64,177,610,36,25,C.muted);
const a4=node('Warstwy kontekstowe',738,416,450,76,{size:28});
arrow(a4,a3,'top','bottom');
tx('Planowane źródła:\nGeoportal / GUGiK, IMGW, Copernicus',64,410,630,98,26,C.muted);
tx('Działa w demo',64,552,430,38,27,C.navy,true);
tx('Podkład satelitarny, syntetyczny scenariusz,\nporównanie LOT-01 i LOT-02.',64,597,575,64,23,C.muted);
tx('Następny etap',738,552,450,38,27,C.navy,true);
tx('Dane z lotu, role użytkowników\ni dobrane warstwy publiczne.',738,597,470,64,23,C.muted);
footer(8,false,'Dane publiczne są kontekstem. Obserwacja z lotu opisuje stan miejsca w konkretnym czasie.');
notes('Wykorzystujemy istniejący dron i operatora, bez budowy sprzętu ani własnego modelu AI. Prototyp ma syntetyczną mapę, przygotowany import obserwacji, karty i lokalny zapis decyzji. Źródła publiczne z materiałów wydarzenia to kandydaci do kolejnego etapu, a nie zintegrowane usługi demo. Przed użyciem trzeba wybrać potrzebne warstwy, sprawdzić licencję, dostęp, datę i aktualność. Mapa terenu nie potwierdza bieżącej przejezdności drogi. Nie ma integracji ze służbami ani sterowania dronem.\nŹródła: brief, „Dane kontekstowe” i „Wykonalność”. Baza danych publicznych.pdf, lista źródeł organizatora.');

start();
tx('Bezpieczne użycie drona i NURT',64,48,1152,82,51,C.navy,true);
tx('Już w demonstracji',64,198,530,46,32,C.navy,true);
tx('Dron zbiera obraz, nie podejmuje decyzji\nDyżurny zatwierdza następny krok\nSyntetyczne dane bez danych osób',64,270,570,146,27,C.muted);
tx('Warunki pilotażu',710,198,500,46,32,C.navy,true);
tx('Uprawniony operator odpowiada za lot\nRole, ograniczony dostęp i retencja danych\nWeryfikacja obserwacji przed działaniem',710,270,505,146,27,C.muted);
const p1=node('Demo',64,503,301,85,{fill:C.navy,color:C.paper,border:C.navy,size:30});
const p2=node('Ćwiczenie',489,503,301,85,{size:30});
const p3=node('Pilotaż ze sztabem',914,503,301,85,{fill:C.teal,border:C.teal,size:29});
arrow(p1,p2);arrow(p2,p3);
footer(9,false,'Zastosowanie ratownicze i defensywne. Loty i dostęp do danych podlegają procedurom.');
notes('Zakres jest ratowniczy, defensywny i organizacyjny. Decyzję podejmuje człowiek. Demo używa danych syntetycznych i jawnie pokazuje niepewność oraz czas. Pilotaż wymaga odrębnego wdrożenia ról i kontroli dostępu, zasad przechowywania oraz minimalizacji danych. Misję realizuje uprawniony operator w dopuszczonych warunkach. Plan zaczyna się od demo, następnie wspólnego ćwiczenia, a dopiero później pilotażu ze sztabem. Prototyp nie jest systemem do prowadzenia realnej akcji.\nŹródło: brief, „Wykonalność, ryzyka i odpowiedzialność”.');

start(C.navy);
tx('NURT C2',64,43,1152,110,72,C.paper,true);
tx('Dron dostarcza obraz.\nNURT tworzy sprawę.\nCzłowiek decyduje.',64,202,725,255,52,C.paper,true);
tx('ZESPÓŁ USZATKI',848,205,368,30,21,C.teal,true);
tx('Daniel Prajsnar\nBartosz Orzechowski\nFabian Drapak\nJan Bysiewicz',848,253,368,151,25,C.paper);
tx('OTWARTE REPOZYTORIUM',848,433,368,30,18,C.light,true);
tx('github.com/Danie11o/Nurt',848,478,368,49,24,C.teal,true);
tx('Szukamy partnera do ćwiczenia\nz gminnym sztabem.',64,557,1146,85,33,C.teal,true);
footer(10,true,'Prototyp i materiały przygotowane z pomocą AI (Codex). Efekt operacyjny do pomiaru.');
notes('NURT łączy obserwację z drona z udokumentowaną decyzją człowieka i ponownym sprawdzeniem przez LOT-02. Szukamy partnera operacyjnego do ćwiczenia, które pozwoli zmierzyć przydatność tego przepływu. Repozytorium projektu: https://github.com/Danie11o/Nurt.\nZespół Uszatki: Daniel Prajsnar, Bartosz Orzechowski, Fabian Drapak, Jan Bysiewicz.\nUjawnienie użycia AI: prototyp, dokumentację i prezentację przygotowano z pomocą Codex; syntetyczny obraz scenariusza powstał przy użyciu generatora obrazu OpenAI. Zespół odpowiada za sprawdzenie materiałów i ostateczne zgłoszenie.');

const serializedSpec=JSON.stringify({width:W,height:H,font:FONT,slides:spec.map(({slide,...s})=>s)},null,2);
await fs.writeFile(path.join(BUILD,'deck-spec.json'),serializedSpec);
if(process.env.NURT_ALLOW_DRAFT!=='1')await fs.writeFile(path.join(HERE,'deck-spec.json'),serializedSpec);
await fs.writeFile(path.join(HERE,'speaker-notes.md'),'# NURT C2 — notatki prezentera\n\nPolska prezentacja konkursowa, 10 slajdów. Scenariusz i dane demonstracyjne są syntetyczne.\n\n'+spec.map((s,i)=>`## Slajd ${i+1}\n\n${s.notes}\n`).join('\n'));
const candidate=path.join(BUILD,'nurt-c2-candidate.pptx');
await(await PresentationFile.exportPptx(deck)).save(candidate);
for(let i=0;i<spec.length;i++){
  const image=await deck.export({slide:spec[i].slide,format:'png',scale:2});
  await fs.writeFile(path.join(BUILD,`slide-${i+1}.png`),new Uint8Array(await image.arrayBuffer()));
  const layout=await spec[i].slide.export({format:'layout'});await fs.writeFile(path.join(BUILD,`slide-${i+1}.layout.json`),await layout.text());
}
if(process.env.NURT_ALLOW_DRAFT!=='1'){
  const result=await finalizePresentation({explicitTotalSlideCount:10,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(HERE,'NURT-C2-prezentacja-final.pptx'),pythonExecutable:path.join(RUNTIME,'python/python.exe'),integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],fontPolicy:{basis:'design',families:[FONT]},verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'nurt-c2-final.validation.json')});
  console.log(JSON.stringify(result));
}
console.log(`Deck has ${spec.length} slides. Spec: ${path.join(BUILD,'deck-spec.json')}`);
