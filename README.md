# Valentin CMS próbaoldal

A szerkesztőben a mentés, az előnézet és a publikálás továbbra is a szokásos módon működik.

## Fejlesztés és CMS-piszkozatok

- A `cms/*` ágakat kizárólag a szerkesztő kezelje. Sablont, stílust, konfigurációt és workflow-t fejlesztői ágon módosítsunk, majd a `main` ágba egyesítsünk. Egy régi piszkozat előnézetének frissítéséhez se másoljunk sablont a CMS-ágra.
- A CMS content check a piszkozat változásait a közös őstől vizsgálja. Csak a CMS-ben kezelt Markdown-fájlok, a főoldali JSON és a feltöltések megengedettek. A szerkeszthető tartalomtípusok változásakor frissítsük az engedélyezett útvonalakat is.
- Hibás ellenőrzés vagy összevonási konfliktus esetén ne publikáljuk a régi piszkozatot. Mentsük ki a kívánt tartalmat és a képeket, majd a friss főágból készítsünk tiszta tartalmi piszkozatot. A régi verziót a tartalom ellenőrzéséig őrizzük meg.
- A Pages új kiadás előtt ellenőrzi a beérkező CMS-commitokat is. A hibás kiadásnál az előző telepítés marad elérhető. Ez a telepítést védi; a GitHub-ágvédelmet nem helyettesíti. Kézi újratelepítés előtt ellenőrizzük a főágat.