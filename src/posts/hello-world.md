---
title: Hello, World
date: 2026-08-20
description: Der erste Post nach dem Relaunch — warum dieser Blog neu aufgesetzt wurde und wie er gestaltet ist.
layout: layouts/post.njk
---

Willkommen auf der neu aufgebauten lorenzkahl.de. Dieser Blog läuft jetzt
auf [Eleventy](https://www.11ty.dev/) mit [Web Awesome](https://webawesome.com)
und einem warmen, fluiden Design-System. Bevor hier regelmäßig neue Inhalte
erscheinen, dient dieser Post als kleiner Rundgang durch das, was sich
technisch und gestalterisch geändert hat.

## Warum ein Neustart

Der alte Aufbau war über Jahre gewachsen — mit einem eigenen
Token-System, verschachtelten Cascade Layers und viel Konfiguration, die
kaum noch jemand außer mir verstanden hätte. Statt weiter zu flicken, habe
ich mich für einen bewussten Cut entschieden: neue Codebasis, neues
Design-System, ein einziges warmes Farbschema statt eines Theme-Switchers.

<blockquote>
  <p>Ein Blog, der nie fertig geschrieben wird, braucht kein perfektes
  Fundament — er braucht eines, das sich leicht wieder anfassen lässt.</p>
  <cite>Notiz an mich selbst, beim Aufsetzen dieses Relaunches</cite>
</blockquote>

Das ist auch der Grund, warum die Umsetzung bewusst schlank bleibt: reines
Markdown, eine Handvoll Nunjucks-Layouts, kein Build-Schritt für
JavaScript, keine Client-seitige Logik jenseits dessen, was Web Awesome als
Web Components ohnehin mitbringt.

### Das visuelle Grundgerüst

Farben, Schrift und Abstände kommen aus einem fluiden Utopia-Maßstab, der
sich zwischen Mobilgerät und großem Desktop-Fenster weich anpasst — keine
harten Breakpoints, sondern `clamp()`-Werte. Die Palette ist von
[warm-burnout](https://github.com/felipefdl/warm-burnout) inspiriert: ein
gedämpftes, warmes Beige als Hintergrund, gebranntes Orange als Akzent.

<figure>
  <img
    src="/assets/images/placeholder-content.svg"
    alt="Platzhalterbild im Standardformat, das die Inhaltsbreite dieses Blogs ausfüllt"
    width="1200"
    height="675"
  >
  <figcaption>
    Ein Platzhalterbild in Inhaltsbreite — so breit wie der Fließtext
    selbst, ohne über den Rand hinauszuragen.
  </figcaption>
</figure>

### Technik-Stack im Überblick

Kurz zusammengefasst, worauf dieser Blog aufbaut:

- **Eleventy (11ty) v3** als statischer Seitengenerator, ESM-first.
- **Web Awesome** als Komponenten-Bibliothek, geladen per CDN-Autoloader —
  kein npm-Paket, kein Bundling nötig.
- **Plain CSS** mit nativem Nesting statt Sass oder PostCSS, solange kein
  konkreter Bedarf dafür entsteht.
- **Utopia-Skalen** für Typografie und Abstände, damit sich beides fluid
  statt gestuft verhält.
- **Prism-basiertes Syntax-Highlighting** zur Build-Zeit, ganz ohne
  Client-JavaScript.

<figure class="breakout-start">
  <img
    src="/assets/images/placeholder-breakout.svg"
    alt="Breites Platzhalterbild, das links über die Textspalte hinausragt"
    width="1600"
    height="700"
    loading="lazy"
  >
  <figcaption>
    Ein Breakout-Element: dieses Bild ragt ein Stück nach links über die
    normale Textspalte hinaus, ohne bis zum Viewport-Rand zu reichen.
  </figcaption>
</figure>

<div class="callout callout--note">

<p class="callout__title">Hinweis</p>

Diese Seite befindet sich noch im Aufbau. RSS-Feed und About-Seite stehen
bereits, weitere Inhalte folgen nach und nach — Layout und Typografie
sollten aber schon jetzt für lange, reich formatierte Artikel tragen.

</div>

## Gestaltungsideen für künftige Artikel

Ein Blog lebt nicht nur von Fließtext. Damit spätere Artikel nicht immer
gleich aussehen, unterstützt das Layout inzwischen ein paar zusätzliche
Bausteine: Zitate mit Quellenangabe, Bildunterschriften, Hinweiskästen und
Bild-Elemente, die bewusst aus der Textspalte ausbrechen — nach links,
nach rechts, in beide Richtungen oder randlos über die volle Breite.

<figure class="full-bleed">
  <img
    src="/assets/images/placeholder-full-bleed.svg"
    alt="Randloses Panorama-Platzhalterbild über die volle Breite des Viewports"
    width="2400"
    height="900"
    loading="lazy"
  >
  <figcaption>
    Ein Full-Bleed-Bild: randlos bis zum Viewport-Rand, unabhängig von der
    Breite der Textspalte darüber und darunter.
  </figcaption>
</figure>

<div class="callout callout--tip">

<p class="callout__title">Tipp</p>

Breakout-Elemente sind bewusst sparsam einzusetzen — als Auflockerung an
ein bis zwei Stellen im Artikel, nicht als Standard für jedes Bild. Sonst
verliert der ruhige Lesefluss der Textspalte seine Wirkung.

</div>

#### Kleine Randnotiz

Auch eine vierte Überschriftenebene findet hier Platz, für kurze
Zwischenbemerkungen, die keinen eigenen Abschnitt rechtfertigen — wie
diese hier.

---

Mehr inhaltliche Beiträge folgen in Kürze. Bis dahin: viel Spaß beim
Stöbern durch das neue Layout.
