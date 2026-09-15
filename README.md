# Malte Gündisch — One-Pager

Persönliche Vorstellungsseite: Online-Marketing & CRM, Webdesign, Salesforce.
Statisches HTML/CSS/JS ohne Build-Schritt, ausgeliefert über GitHub Pages.

**Live:** https://mgue95.github.io/personal-onepager/

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | Gesamte Seite, alle Sektionen, zweisprachig über `data-de` / `data-en` |
| `style.css` | Design-Tokens, Layout und Komponenten der Hauptseite |
| `script.js` | Sprachumschaltung, Scroll-Spy, Slider, Reveal-Animationen, Kontaktformular |
| `terminal.css` | Styles der Terminal-Sektion und des ⌘K-Overlays |
| `terminal.js` | Befehlslogik der Shell — eigenständig, greift nicht in `script.js` ein |
| `print.css` | Druck-Layout (`media="print"`): aus der Website wird ein Lebenslauf |
| `og.jpg` | Vorschaubild für Social-Media-Links (1200 × 630) |

## Terminal-Sektion

Die Sektion `#terminal` ist eine kleine interaktive Shell. Sie startet, sobald sie
ins Bild scrollt, und versteht unter anderem:

```
help   whoami   about    experience  stack   ai      projects
focus  certs    contact  neofetch    ls      open <sektion>
cv     share <befehl>     keys        history date    theme
clear  echo     sudo
```

Bedienung: `Tab` vervollständigt, `→` übernimmt den Vorschlag, `↑`/`↓` blättern
durch die History, `Ctrl`+`L` leert die Konsole. Alle Befehle sind auch als Chips
klickbar.

### ⌘K — dieselbe Shell über jeder Stelle der Seite

`⌘K` (bzw. `Ctrl`+`K`) oder der `>_`-Knopf im Kopfbereich öffnet die Shell als
Overlay, ohne zur Sektion zu scrollen. `Esc` schließt sie wieder. Technisch ist
das eine zweite Instanz derselben Factory (`createShell`) — geteilt wird nur das
`COMMANDS`-Objekt, History und Zustand gehören jeder Instanz für sich.

### Teilbare Befehls-Links

`?cmd=<befehl>` (alternativ `#cmd=<befehl>`) öffnet die Seite direkt auf der
Ausgabe dieses Befehls:

```
https://mgue95.github.io/personal-onepager/?cmd=certs
```

Der Befehl `share <befehl>` baut so einen Link und legt ihn in die Zwischenablage.

### Lebenslauf drucken

`cv` öffnet den Druckdialog. `print.css` blendet Navigation, Slider, Terminal und
Formular aus, löst die Karten-Mindesthöhen des Bildschirm-Layouts auf und setzt
eine Kontaktzeile unter den Kopf — Ergebnis sind rund fünf A4-Seiten in
Schwarz-Weiß.

Neue Befehle kommen als Eintrag in das `COMMANDS`-Objekt in `terminal.js`;
jeder Eintrag liefert eine Liste von Ausgabezeilen und erscheint automatisch
in `help` und in der Tab-Vervollständigung.

## Lokal ansehen

Die Seite braucht keinen Server — `index.html` im Browser öffnen genügt.
