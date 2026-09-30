# NURT C2 - analiza konkursowa i plan wygranej

## Decyzja

Do zgłoszenia należy wystawić jeden projekt: **NURT C2**. Bazą techniczną jest interfejs RESQGRID z folderu `anti`, a osią historii pozostaje pętla NURT: potrzeba sztabu, lot, obserwacja, priorytet, decyzja człowieka i ponowny lot. Foldery `Rescue Edge` i poprzedni `Dual Use Nurt` traktujemy jako wcześniejsze eksperymenty, nie równoległe produkty.

## Zgodność z wyzwaniem

| Wymóg | Stan NURT C2 | Dowód w pokazie |
|---|---|---|
| Konkretny problem operacyjny | Spełniony | Przejezdność jedynej drogi do odciętej zabudowy |
| Konkretny użytkownik | Spełniony | Dyżurny lokalnego sztabu zarządzania kryzysowego |
| Dron jako główny element | Spełniony | LOT-01 dostarcza świeżą obserwację, LOT-02 aktualizuje stan |
| Droga od danych do decyzji | Spełniony | Ośmiostopniowe demo od potrzeby do ponownej weryfikacji |
| Human in the loop | Spełniony | Dyżurny zatwierdza działanie; system nie wysyła rozkazu |
| Ograniczenia prawne i etyczne | Spełniony koncepcyjnie | Dane syntetyczne, jawna niepewność, plan ról i minimalizacji danych |
| Bezpieczny dual-use | Spełniony | Zastosowanie ratownicze, monitorujące i defensywne |
| Prezentacja do 10 slajdów po polsku | Spełniony | 10 slajdów, PDF i PPTX |
| Otwarte repozytorium | Do potwierdzenia | Adres musi działać bez logowania i zawierać zamrożony commit |

## Ocena według kryteriów jury

| Kryterium | Ocena obecnej wersji | Jak zdobywać punkty w pitchu |
|---|---:|---|
| Użyteczność operacyjna | 17/20 | Zacząć od pytania dyżurnego, zakończyć statusem po LOT-02 |
| Rola technologii dronowych | 18/20 | Pokazać, że bez LOT-01 i LOT-02 nie ma aktualnej informacji |
| Innowacyjność | 16/20 | Sprzedawać zamkniętą pętlę i ochronę przed pracą na starym obrazie, nie sam dashboard |
| Realność i wykonalność | 17/20 | Uczciwie oddzielić działające demo od planu pilotażu i modelu AI |
| Prezentacja | 18/20 | 60 sekund live demo, jeden bohater, jedna decyzja, jeden finał |

Szacunek to narzędzie robocze, nie gwarancja wyniku. Największy potencjał podniesienia oceny daje pewny pokaz oraz krótka odpowiedź na pytania o dane, prawo lotnicze i walidację obserwacji.

## Najważniejsze ryzyka

1. **Nieudowodnione integracje.** Nie mówić, że aplikacja pobiera aktualne IMGW, GUGiK lub Copernicus. W demo są to źródła planowane.
2. **Nieudowodnione AI.** Nie deklarować działającego YOLO ani automatycznej identyfikacji osób. Obecna analiza jest deterministyczną symulacją przepływu.
3. **Za dużo militarnego języka.** Nie używać historii o celach, szlakach MSR, zakłócaniu GNSS ani „rekomendacjach taktycznych”. Projekt wygrywa zgodnością i użytecznością ratowniczą.
4. **Przeładowany ekran.** Podczas pokazu nie oprowadzać po wszystkich panelach. Prowadzić jury po krokach 1, 4, 6, 7 i 8.
5. **Repozytorium i deadline.** Link musi być publiczny przed terminem. Po terminie nie zmieniać wersji wskazanej jury.

## Pitch w 30 sekund

„Podczas powodzi dyżurny nie potrzebuje kolejnego nagrania z drona. Musi wiedzieć, czy ratownicy dojadą do mieszkańców i czy ta informacja jest nadal aktualna. NURT C2 zamienia LOT-01 w kartę sprawy z czasem, źródłem i jawnym priorytetem. Człowiek zatwierdza działanie, a LOT-02 aktualizuje status. Dzięki temu sztab nie podejmuje decyzji na podstawie starego obrazu. Demo jest syntetyczne i działa lokalnie; następnym krokiem jest ćwiczenie z gminnym sztabem i pomiar czasu do decyzji oraz odsetka spraw ponownie zweryfikowanych.”

## Checklista przed wysłaniem

- potwierdzić dokładny termin i link formularza u organizatora;
- opublikować właściwy folder jako publiczne repozytorium i sprawdzić dostęp bez logowania;
- uruchomić `npm run build` oraz `node scripts/browser-qa.cjs`;
- przejść demo na laptopie prezentacyjnym i przygotować hotspot tylko jako zapas;
- zapisać hash commitu, PDF i lokalną kopię repozytorium;
- sprawdzić nazwiska, nazwę zespołu i adres repozytorium na slajdzie 10;
- przećwiczyć wariant 3-minutowy oraz 60-sekundowy;
- przygotować odpowiedzi na pytania o loty, prywatność, odpowiedzialność człowieka i walidację danych;
- po terminie nie zmieniać zgłoszonej wersji.
