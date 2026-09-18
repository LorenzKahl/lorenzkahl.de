---
title: Sieve King
layout: layouts/base.njk
description: Support und Kontakt für Sieve King, den nativen Editor für Sieve-Mailfilter (ManageSieve) unter iOS und macOS.
---

<div class="app-header">
  <img src="/apps/sieve-king/icon.png" alt="" width="120" height="120" class="app-header__icon">
  <div>

# Sieve King

Nativer Editor für Sieve-Mailfilter

  </div>
</div>

Sieve King ist ein nativer Editor für Sieve-Mailfilter – die Regeln, mit
denen dein Mail-Provider eingehende E-Mails automatisch sortiert,
weiterleitet oder markiert. Statt umständlich über eine
Webmail-Oberfläche zu arbeiten, verbindest du dich direkt über das
offene ManageSieve-Protokoll ([RFC 5804](https://www.rfc-editor.org/rfc/rfc5804))
mit deinem Mailserver.

## Funktionen

- **Skriptverwaltung:** Filter anzeigen, erstellen, umbenennen,
  duplizieren, löschen und aktivieren/deaktivieren – direkt auf deinem
  Mailserver.
- **Editor** mit Syntax-Highlighting, Zeilennummern, Auto-Einrückung
  und einer Sonderzeichen-Leiste für geschweifte Klammern,
  Anführungszeichen & Co.
- **Undo/Redo** wie in jedem richtigen Texteditor.
- **Validierung vor jedem Speichern** (CHECKSCRIPT) – Tippfehler in der
  Filterlogik fallen auf, bevor sie live gehen.
- **Zugangsdaten sicher im iOS-Schlüsselbund gespeichert**,
  verschlüsselte Verbindung per STARTTLS.
- **Optionaler automatischer Verbindungsaufbau** beim App-Start.
- **iCloud-Dateikopplung:** Verknüpfe einzelne Skripte mit einer Datei
  in einem iCloud-Drive-Ordner deiner Wahl, um sie bequem am Mac zu
  bearbeiten. Sieve King zeigt den Dateiinhalt schreibgeschützt an und
  lädt ihn per Fingertipp validiert auf den Server hoch.

Getestet gegen Dovecot/Pigeonhole (u. a. bei Mailbox.org); dank offenem
Standard grundsätzlich mit jedem ManageSieve-fähigen Mailserver
kompatibel.

{% callout "tip" "Datenschutz" %}
Keine Werbung, kein Tracking, keine Server von Drittanbietern – Sieve
King spricht ausschließlich direkt mit dem Mailserver, den du selbst
angibst.
{% endcallout %}

## Support

Fragen, Probleme oder Feedback zu Sieve King? Das Formular öffnet dein
Mail-Programm mit einer vorausgefüllten Nachricht an mich. Die
[Datenschutzerklärung](/apps/sieve-king/privacy-policy/) findest du
separat.

<form class="contact-form" id="sieve-king-contact-form">
  <wa-input id="sieve-king-contact-subject" label="Betreff" value="Support-Anfrage: Sieve King"></wa-input>
  <wa-textarea id="sieve-king-contact-message" label="Nachricht" rows="6" placeholder="Beschreibe dein Anliegen …" required></wa-textarea>
  <wa-button type="submit" variant="brand">E-Mail öffnen</wa-button>
</form>

<script>
  (() => {
    const user = "app-sieveking";
    const domain = "truck-turner.de";
    const form = document.getElementById("sieve-king-contact-form");
    const subjectField = document.getElementById("sieve-king-contact-subject");
    const messageField = document.getElementById("sieve-king-contact-message");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const subject = subjectField.value.trim();
      const message = messageField.value.trim();
      const params = new URLSearchParams();
      if (subject) params.set("subject", subject);
      if (message) params.set("body", message);
      const query = params.toString();
      window.location.href = `mailto:${user}@${domain}${query ? `?${query}` : ""}`;
    });
  })();
</script>
