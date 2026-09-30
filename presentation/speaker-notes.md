# NURT C2 — notatki prezentera

Polska prezentacja konkursowa, 10 slajdów. Scenariusz i dane demonstracyjne są syntetyczne.

## Slajd 1

Podczas powodzi problemem nie jest tylko brak obrazu. Sztab musi ustalić, który obraz wymaga działania teraz. NURT pomaga dyżurnemu uporządkować obserwacje z drona i zachować ich dalszy ciąg aż do ponownego sprawdzenia. Pokazujemy prototyp na całkowicie syntetycznym scenariuszu. Zrzut pochodzi z aplikacji dostarczonej w repozytorium.
Źródło koncepcji: BRZEG-Dual-Use-Hackathon-brief.md, sekcje „Rekomendowany projekt” i „Użytkownik i scenariusz demonstracyjny”.

## Slajd 2

Problem nie polega na braku kamer. Dron szybko dociera nad trudno dostępne miejsce, ale pojedynczy kadr nie odpowiada jeszcze na pytanie operacyjne. Sztab potrzebuje informacji o czasie, miejscu i źródle. Musi zapisać decyzję i sprawdzić, czy po kilkunastu minutach nadal jest aktualna. Scenariusz i dane w demonstracji są syntetyczne.

## Slajd 3

NURT nie zastępuje operatora drona ani dyżurnego. Dron pełni rolę dynamicznego sensora. NURT porządkuje obserwację w kartę sprawy i zachowuje jej historię. Człowiek zatwierdza następny krok. Drugi lot aktualizuje status, dzięki czemu sztab nie opiera się wyłącznie na starym obrazie.

## Slajd 4

Proces zaczyna pytanie sztabu. Operator wykonuje LOT-01, a dron dostarcza aktualny obraz z lokalizacją. NURT tworzy kartę sprawy z dowodem, zmianą i priorytetem. Dyżurny zatwierdza działanie. LOT-02 ponownie obserwuje ten sam odcinek i aktualizuje status. Demo nie steruje dronem ani nie wysyła poleceń do służb.

## Slajd 5

POKAZ OKOŁO 2 MINUT. Uruchom START DEMO i przechodź kolejno przez osiem kroków. W kroku drugim pokaż zadanie LOT-01 dla operatora. W kroku trzecim wskaż czas, lokalizację i źródło materiału z drona. W kroku szóstym pokaż jawny priorytet. W kroku siódmym podkreśl decyzję człowieka. W kroku ósmym pokaż LOT-02 i nowy czas obserwacji.

## Slajd 6

Innowacją prototypu jest zamknięty obieg sprawy. Z pojedynczego kadru powstaje śledzona obserwacja. Dyżurny widzi priorytet i podejmuje decyzję. Kolejna obserwacja potwierdza zmianę albo ponawia potrzebę sprawdzenia. Źródło, czas, lokalizacja i niepewność pozostają z kartą. To mechanizm, który ma ograniczyć pracę na starym lub źle zrozumianym obrazie. Jego wpływ trzeba dopiero zmierzyć.
Źródło: brief, „Innowacja do wyeksponowania”.

## Slajd 7

Nie pokazujemy fikcyjnych wyników. Podczas ćwiczenia porównamy dotychczasową pracę sztabu z tym samym scenariuszem obsługiwanym w NURT. Zmierzymy czas od przekazania obserwacji do karty, kompletność źródła i czasu, czas do decyzji oraz odsetek spraw sprawdzonych ponownie. Progi sukcesu i okno weryfikacji ustalimy z partnerem przed pilotażem. To proponowane wskaźniki, a nie osiągnięty efekt.
Źródło: brief, „Wartość operacyjna, którą można zmierzyć”.

## Slajd 8

Wykorzystujemy istniejący dron i operatora, bez budowy sprzętu ani własnego modelu AI. Prototyp ma syntetyczną mapę, przygotowany import obserwacji, karty i lokalny zapis decyzji. Źródła publiczne z materiałów wydarzenia to kandydaci do kolejnego etapu, a nie zintegrowane usługi demo. Przed użyciem trzeba wybrać potrzebne warstwy, sprawdzić licencję, dostęp, datę i aktualność. Mapa terenu nie potwierdza bieżącej przejezdności drogi. Nie ma integracji ze służbami ani sterowania dronem.
Źródła: brief, „Dane kontekstowe” i „Wykonalność”. Baza danych publicznych.pdf, lista źródeł organizatora.

## Slajd 9

Zakres jest ratowniczy, defensywny i organizacyjny. Decyzję podejmuje człowiek. Demo używa danych syntetycznych i jawnie pokazuje niepewność oraz czas. Pilotaż wymaga odrębnego wdrożenia ról i kontroli dostępu, zasad przechowywania oraz minimalizacji danych. Misję realizuje uprawniony operator w dopuszczonych warunkach. Plan zaczyna się od demo, następnie wspólnego ćwiczenia, a dopiero później pilotażu ze sztabem. Prototyp nie jest systemem do prowadzenia realnej akcji.
Źródło: brief, „Wykonalność, ryzyka i odpowiedzialność”.

## Slajd 10

NURT łączy obserwację z drona z udokumentowaną decyzją człowieka i ponownym sprawdzeniem przez LOT-02. Szukamy partnera operacyjnego do ćwiczenia, które pozwoli zmierzyć przydatność tego przepływu. Repozytorium projektu: https://github.com/Danie11o/Nurt.
Zespół Uszatki: Daniel Prajsnar, Bartosz Orzechowski, Fabian Drapak, Jan Bysiewicz.
Ujawnienie użycia AI: prototyp, dokumentację i prezentację przygotowano z pomocą Codex; syntetyczny obraz scenariusza powstał przy użyciu generatora obrazu OpenAI. Zespół odpowiada za sprawdzenie materiałów i ostateczne zgłoszenie.
