# Changelog

Všechny významné změny v rozšíření NalemiSchema jsou dokumentovány v tomto souboru.

## [0.1.4] - 2026-09-12

- **Podbarvení prvního řádku:** Pokud je `<?php` sám na řádku bez mezer před ním a bez `?>`, podbarví se celý řádek přes celou šířku editoru.
- **Podpora souborů bez `?>`:** V čistých PHP souborech bez uzavíracího tagu mají všechny řádky až do konce souboru plné podbarvení.

## [0.1.3] - 2026-09-10

- **Výběr textu:** Přidána automatická alfa-průhlednost podbarvení PHP bloků (`rgba`), aby nativní žluté označení výběru textu (`editor.selectionBackground`) plně prosvítalo a bylo zřetelně čitelné.
- **Odsazení `?>`:** Whitespace/odsazení před uzavíracím tagem `?>` má pozadí (patří do PHP bloku), prostor za ním zůstává na bílém podkladu.

## [0.1.2] - 2026-09-10

- Zpřesněno ohraničení tagu `?>` tak, aby podbarvení končilo přesně na znaku `>`.

## [0.1.1] - 2026-09-10

- Odsazení a whitespace před otevíracím tagem `<?php` na samostatném řádku zůstává bílé (podbarvení začíná až na `<`).

## [0.1.0] - 2026-09-10

- **Podbarvení PHP kódů:** Implementován modul `extension.js` s využitím VS Code Decoration API pro dynamické podbarvení PHP bloků (`#E9E9E9`), přičemž veškeré HTML zůstává na čistě bílém pozadí.
- Přidány uživatelské konfigurační volby `nalemischema.phpBackground.enabled` a `nalemischema.phpBackground.color`.

## [0.0.8] - 2026-09-10

- **JavaScript hodnoty:** Opravena barva číselných a literálových hodnot v JS (čísla, desetinná čísla, `null`, `undefined`) z červené na černou (`#000000`).

## [0.0.7] - 2026-09-10

- **JavaScript vestavěné objekty:** Přidána TextMate injekční gramatika pro vestavěné třídy (`Date`, `Math`, `Array` -> `#DA564A`) a globální DOM objekty (`window`, `document`, `console` -> `#990099`).
- **Tag `<script>`:** Opravena barva tagu `<script>` a jeho atributů na `#990000`.

## [0.0.6]

- Přepakováno rozšíření pro Antigravity IDE 2.5.5.

## [0.0.5]

- Přepakováno rozšíření pro Antigravity IDE 2.5.5.

## [0.0.4]

- Přidána kompatibilita pro Antigravity IDE (podpora VS Code 1.90+).
- Opraven manifest rozšíření `package.json`.
