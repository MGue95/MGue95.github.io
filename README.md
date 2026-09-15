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
| `terminal.css` | Styles der Terminal-Sektion (`mg-shell`) |
| `terminal.js` | Befehlslogik der Terminal-Sektion — eigenständig, greift nicht in `script.js` ein |

## Terminal-Sektion

Die Sektion `#terminal` ist eine kleine interaktive Shell. Sie startet, sobald sie
ins Bild scrollt, und versteht unter anderem:

```
help  whoami  about  experience  stack  ai  projects  focus
certs  contact  neofetch  ls  open <sektion>  history  date
theme  clear  echo  sudo
```

Bedienung: `Tab` vervollständigt, `↑`/`↓` blättern durch die History,
`Ctrl`+`L` leert die Konsole. Alle Befehle sind auch als Chips klickbar.

Neue Befehle kommen als Eintrag in das `COMMANDS`-Objekt in `terminal.js`;
jeder Eintrag liefert eine Liste von Ausgabezeilen und erscheint automatisch
in `help` und in der Tab-Vervollständigung.

## Lokal ansehen

Die Seite braucht keinen Server — `index.html` im Browser öffnen genügt.
