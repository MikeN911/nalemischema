# NalemiSchema

NalemiSchema je světlé barevné schéma a rozšíření pro Visual Studio Code a Antigravity IDE, optimalizované pro vývoj v PHP, HTML, JavaScriptu a CSS. Vychází z osvědčeného schématu ze Sublime Textu.

## Vlastnosti

- **Optimalizováno pro PHP & HTML šablony:**
  - Výchozí čistě bílé pozadí pro HTML kód.
  - **Dynamické podbarvení PHP bloků:** Kód uvnitř `<?php ... ?>` a `<?= ... ?>` je automaticky podbarven jemně šedým pozadím (`#E9E9E9`), což vizuálně odděluje serverový kód od šablony.
  - **Přesné ohraničení tagů:** Odsazení před otevíracím tagem `<?php` i za zavíracím `?>` zůstává bílé, odsazení před `?>` je součástí PHP bloku.
  - **Podpora výběru textu:** Podbarvení využívá alfa průhlednost, takže nativní výběr textu (`editor.selectionBackground`) zůstává zřetelný a jasně čitelný.
- **Vyladěné zvýraznění JavaScriptu:**
  - Tagy `<script>` a jejich atributy laděné do `#990000`.
  - Vestavěné třídy a objekty jako `new Date()`, `Math`, `Array` v barvě `#DA564A`.
  - Globální DOM objekty jako `window`, `document`, `console` ve fialové `#990099`.
  - Číselné a literálové hodnoty v JavaScriptu v černé barvě `#000000`.
- **HTML & CSS styling:**
  - Specifické odlišení tagů formulářů (`#FF6600`), tabulek (`#009999`) a odkazů (`#006600`).
  - Kompletní podpora CSS pravidel, `@media`, selektorů i `!important` (`#FF0000`).

## Konfigurace

V uživatelském nastavení (`settings.json`) lze chování podbarvení PHP bloků snadno upravit:

```json
{
  // Zapnutí / vypnutí podbarvení PHP bloků (výchozí: true)
  "nalemischema.phpBackground.enabled": true,

  // Barva podbarvení PHP bloků (výchozí: #E9E9E9)
  "nalemischema.phpBackground.color": "#E9E9E9"
}
```

## Instalace

1. Otevřete panel **Extensions** (`Ctrl+Shift+X`).
2. V pravém horním rohu klikněte na nabídku **`...`** (Více akcí).
3. Vyberte **Install from VSIX...**.
4. Zvolte soubor `nalemischema-x.x.x.vsix`.
5. V paletě témat (`Ctrl+K Ctrl+T`) vyberte **NalemiSchema**.

## Kompatibilita

Rozšíření vyžaduje editor založený na VS Code 1.90 nebo novější (včetně Antigravity IDE).
