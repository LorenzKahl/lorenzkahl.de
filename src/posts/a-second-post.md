---
title: Ein zweiter Post
date: 2026-08-27
description: Ein zweites Beispiel mit Code, Zitaten, Bildplatzhaltern und Callouts, um das Layout gegen echte Inhalte zu testen.
layout: layouts/post.njk
---

Der erste Post war bewusst kurz. Dieser hier ist das Gegenstück: ein
Platzhalter-Artikel, der möglichst viele der HTML-Elemente durchspielt, die
ein echter Blogpost irgendwann braucht — Code, Zitate, Bilder und Kästen
inklusive.

## Ein erstes Codebeispiel

Zum Aufwärmen ein kurzer JavaScript-Schnipsel, um Syntax-Highlighting zu
testen:

```js
const greet = (name) => `Hallo, ${name}!`;

console.log(greet("Welt"));
```

Sobald Syntax-Highlighting eingerichtet ist, sollte der Codeblock oben
farbig dargestellt werden — Schlüsselwörter, Strings und Funktionsnamen
jeweils in einer eigenen Akzentfarbe aus der warmen Palette.

### Ein CSS-Beispiel

Auch CSS soll sich lesbar highlighten lassen, inklusive nativem Nesting
und Custom Properties, wie sie in diesem Projekt selbst zum Einsatz
kommen:

```css
.callout {
  --callout-color: var(--color-accent);

  padding: var(--space-s) var(--space-m);
  border-inline-start: 0.25rem solid var(--callout-color);

  & > :last-child {
    margin-block-end: 0;
  }
}
```

<blockquote>
  <p>Zeig mir deinen Code, und ich sage dir, ob du deine Werkzeuge magst
  oder nur erträgst.</p>
  <cite>Alte Entwicklerweisheit</cite>
</blockquote>

## Bilder und Diagramme

Auch wenn dieser Blog bewusst ohne Bildoptimierungs-Pipeline auskommt,
sollen sich Diagramme, Screenshots oder Illustrationen später sauber
einfügen lassen — inklusive Bildunterschrift.

<figure>
  <img
    src="/assets/images/placeholder-content.svg"
    alt="Platzhalterbild in Inhaltsbreite für ein Diagramm oder einen Screenshot"
    width="1200"
    height="675"
  >
  <figcaption>
    Ein einfaches Diagramm-Platzhalterbild in Standardbreite, mittig im
    Textfluss.
  </figcaption>
</figure>

{% callout "warning" "Achtung" %}
Syntax-Highlighting funktioniert nur für Sprachen, die Prism kennt und die
im Codeblock korrekt als Info-String angegeben sind (z. B. ` ```js ` statt
` ```javascript `, falls die Kurzform fehlschlägt). Bei Unsicherheit lohnt
ein Blick in die gerenderte Ausgabe.
{% endcallout %}

### Ein Breakout in die andere Richtung

Der erste Post zeigte ein Breakout-Bild nach links — hier eines nach
rechts, damit beide Richtungen einmal zu sehen sind:

<figure class="breakout-end">
  <img
    src="/assets/images/placeholder-breakout.svg"
    alt="Breites Platzhalterbild, das rechts über die Textspalte hinausragt"
    width="1600"
    height="700"
    loading="lazy"
  >
  <figcaption>
    Breakout nach rechts: die Textspalte bleibt links bündig, das Bild
    wächst nur nach rechts über sie hinaus.
  </figcaption>
</figure>

Und ein Zitat, das in beide Richtungen zugleich ausbricht — als
Pull-Quote, um eine Kernaussage optisch hervorzuheben:

<blockquote class="breakout">
  <p>Ein Layout, das nur eine feste Spaltenbreite kennt, ist kein
  Redaktionssystem — es ist ein Textfeld mit Anspruch.</p>
  <cite>Aus den Notizen zu diesem Relaunch</cite>
</blockquote>

<figure class="full-bleed">
  <img
    src="/assets/images/placeholder-full-bleed.svg"
    alt="Randloses Panorama-Platzhalterbild als Abschluss des Artikels"
    width="2400"
    height="900"
    loading="lazy"
  >
  <figcaption>
    Und noch einmal randlos, diesmal als ruhiger Abschluss vor dem letzten
    Abschnitt.
  </figcaption>
</figure>

#### Kurz notiert

Wer bis hierhin gelesen hat: Dieser Artikel ist reiner Platzhaltertext,
gedacht um Typografie, Breakouts, Zitate, Bilder und Callouts gegeneinander
zu testen — nicht um inhaltlich etwas zu vermitteln.

```bash
npm run dev
```

---

Sobald echte Themen anstehen, ersetzen sie diese beiden Platzhalter-Posts —
das Layout darunter sollte dafür jetzt tragfähig genug sein.
