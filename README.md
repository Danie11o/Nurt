# NURT C2

**Od potrzeby rozpoznania do zweryfikowanej decyzji podczas powodzi.**

NURT C2 to demonstrator dla dyżurnego lokalnego sztabu zarządzania kryzysowego. Dron dostarcza świeżą obserwację trudno dostępnego odcinka drogi, system porządkuje ją w kartę sprawy, człowiek zatwierdza działanie, a ponowny lot aktualizuje status. Projekt łączy dopracowany interfejs operacyjny RESQGRID z bezpieczną, audytowalną pętlą decyzyjną NURT.

> Cały scenariusz, lokalizacje, odczyty, obrazy i wyniki analizy są syntetyczne. Demo nie steruje dronem, nie kontaktuje się ze służbami, nie korzysta z działającego modelu AI ani bieżących danych publicznych.

## Problem i użytkownik

Po intensywnych opadach dyżurny musi sprawdzić, czy jedyna droga do odciętej zabudowy nadal jest przejezdna. Sam materiał wideo nie odpowiada na pytania: gdzie powstał, kiedy, jak pewna jest obserwacja, kto podjął decyzję i czy ktoś sprawdził sytuację ponownie.

NURT C2 prowadzi jedną sprawę przez pełny obieg:

```text
potrzeba sztabu
  -> zadanie LOT-01 dla operatora
  -> obserwacja z czasem, lokalizacją i źródłem
  -> porównanie z poprzednim lotem
  -> jawny priorytet i uzasadnienie
  -> decyzja człowieka
  -> LOT-02
  -> zaktualizowany, zweryfikowany status
```

## Dlaczego dron jest niezbędny

Dron pełni rolę głównego dynamicznego sensora. Dostarcza aktualny obraz miejsca, do którego patrol nie może szybko lub bezpiecznie dotrzeć. Dane GUGiK, IMGW i Copernicus stanowią wyłącznie planowany kontekst dla pilotażu. Nie zastępują bieżącej obserwacji z lotu.

## Co działa w demonstratorze

- deterministyczny, ośmiostopniowy tryb prezentacyjny dla jury;
- mapa sytuacyjna z kolejnymi stanami 12:00, 12:15, 12:30 i 12:45;
- misja dronowa, materiał dowodowy, porównanie lotów i jawny scoring priorytetu;
- decyzja człowieka, przypisanie zasobu i ponowne zadaniowanie sensora;
- LOT-02, który zamyka pętlę i aktualizuje stan sprawy;
- raport SITREP oraz widok przepływu danych;
- wariant offline, który nie wymaga połączenia z usługami zewnętrznymi.

## Uruchomienie

Wymagane: Node.js 18+.

```bash
npm install
npm run dev
```

Build i kontrola jakości:

```bash
npm run build
npm run lint
```

## Scenariusz pokazu, 3 minuty

1. Powiedz: „Dyżurny nie potrzebuje kolejnego nagrania. Musi wiedzieć, czy ratownicy dojadą do mieszkańców”.
2. Kliknij `START DEMO` i pokaż pytanie operacyjne oraz LOT-01.
3. Na kroku 4 zaznacz, że analiza w demo jest symulacją, nie gotowym modelem AI.
4. Na kroku 6 pokaż jawne uzasadnienie priorytetu i źródła obserwacji.
5. Na kroku 7 podkreśl, że decyzję zatwierdza człowiek.
6. Na kroku 8 pokaż LOT-02 i nowy czas obserwacji: sprawa ma dalszy ciąg, a sztab nie pracuje na starym obrazie.

## Zgodność i bezpieczeństwo

Rozwiązanie ma charakter cywilny, ratowniczy, monitorujący i organizacyjny. Nie obejmuje uzbrojenia, działań ofensywnych, wskazywania celów, zakłócania łączności, przejmowania systemów ani nieuzasadnionej inwigilacji. W pilotażu potrzebne będą: uprawniony operator, zgodność operacji lotniczej, role i kontrola dostępu, minimalizacja danych, zasady retencji oraz procedura drugiej oceny obserwacji.

## Użycie AI i źródła

Kod, dokumentację i materiały prezentacyjne przygotowano z pomocą OpenAI Codex. Obraz scenariusza jest syntetyczny. Aplikacja demonstracyjna nie wywołuje modelu AI. Źródła publiczne wskazane przez organizatora są kandydatami do pilotażu, a nie źródłami bieżących danych w demo.

## Zespół

**Uszatki**: Daniel Prajsnar, Bartosz Orzechowski, Fabian Drapak, Jan Bysiewicz.

Repozytorium do zgłoszenia musi być publiczne i zawierać dokładnie zamrożoną wersję prezentowaną jury.
