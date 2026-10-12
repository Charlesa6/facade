# CLAUDE.md

Ce fichier guide Claude Code (claude.ai/code) dans ce dépôt.

## Ce que c'est

Offre **« sites internet BTP » de Konsilys** : des sites internet clés en main, sur abonnement, pour les PME du BTP qui n'ont pas de site ou dont le site est obsolète. Le modèle commercial : **on génère la maquette de leur site avant de les contacter**, et on leur envoie le lien. Business plan, offre et cadre légal : `docs/business-plan.md`.

**Marque : Konsilys** (société de conseil de Charles Allouard, qui édite aussi le SaaS Konsilys pour ESN — dépôt `esn-manager`). Cette offre « sites internet BTP » est une activité de Konsilys, mais **ses flux techniques restent séparés de ceux du SaaS** :
- prospection et site de l'offre sur **`konsilys.com`** (maquettes : `apercu.konsilys.com`) ; **jamais `konsilys.fr`** ni `contact@konsilys.fr`, réservés au SaaS (une plainte pour spam ne doit pas toucher les emails du produit) ;
- données dans le projet Supabase dédié `facade` (`hxxbhbfueqwsvwqrojea`), **jamais** dans la base du SaaS (`rwmstlesxnglpblrurqj`).

## Stack

- **Node 22, zéro dépendance, aucun build, pas de npm.** Modules ES (`.mjs`).
- Sites générés = HTML statique autonome (CSS inline, SVG inline) → hébergés sur Vercel.
- Données (prospects, clients) : **projet Supabase dédié `facade` (id `hxxbhbfueqwsvwqrojea`, Paris)** — jamais `rwmstlesxnglpblrurqj` (Konsilys). Migrations dans `supabase/migrations/` (déjà appliquées), via les outils MCP. Lien de désinscription des emails : `https://www.konsilys.com/desinscription?t=<unsub_token>` ; en-tête `List-Unsubscribe` (clic en un geste) : `https://hxxbhbfueqwsvwqrojea.supabase.co/functions/v1/unsubscribe?t=<unsub_token>`.
- Le résolveur DNS des conteneurs ne sert pas les MX : utiliser DNS-over-HTTPS (`dns.google/resolve`).
- Emails : Resend, domaine d'envoi `konsilys.com` (DNS chez OVH ; la messagerie OVH existante de konsilys.com reste en place).

## Arborescence

- `generator/` : `metiers.mjs` (préréglages par métier du BTP : palette, pictogramme, prestations types, codes NAF), `style.mjs` (CSS), `render.mjs` (profil → HTML), `build.mjs` (CLI).
- `prospection/` : `rge.mjs` (**source principale** : annuaire RGE de l'ADEME, email déclaré par l'entreprise, croisé avec SIRENE, MX vérifié via DNS-over-HTTPS), `sourcer.mjs` (SIRENE seul → recherche web), `trouver-site.mjs` (**obligatoire avant tout verdict « aucun site »** : recherche du nom + ville, ouverture des 5-6 premiers résultats, identité confirmée par téléphone/SIREN/code postal, puis audit), `audit.mjs` (verdict sur un site existant), `revue.mjs` (page de relecture maquettes + emails avant envoi), `appels.mjs` (fiche d'appels de Charles pour le canal téléphone, voir `docs/appels.md`), `noms.mjs` (casse/accents des registres, salutation).
- `previews/vercel.json` : configuration du domaine des maquettes (noindex sur tout le domaine).
- `supabase/` : schéma `fc_*` et deux fonctions, **toutes deux déployées avec `verify_jwt=false`** :
  - `apercu` : `?t=<preview_token>` → `{ html }` de la maquette, rendue à la volée depuis `profile`. **Déployer avec `generator/render.mjs`, `metiers.mjs` et `style.mjs` à côté de `index.ts`**, à chaque modification du générateur (sinon les maquettes en ligne divergent).
  - `unsubscribe` : JSON (GET = lecture, POST = désinscription, `List-Unsubscribe=One-Click` → 204).
  - Supabase sert le HTML des fonctions en `text/plain` : les pages publiques (`/apercu/<jeton>`, `/desinscription`, site de l'offre) sont donc dans le dépôt **`esn-manager`, dossier `com/`**, servies par Vercel sur konsilys.com, et appellent ces fonctions en JSON.
- `.claude/agents/` : `site-builder` (sourcing + maquettes + production) et `site-seller` (emails, réponses, closing).
- `emails/sequence.md` : modèles de la séquence de prospection.
- `profiles/exemples/` : profils **fictifs** uniquement.
- `data/` et `out/` : **ignorés par Git**. Aucune donnée de prospect ne doit être versionnée.

## Commandes

```bash
node tests/run.mjs                                                   # tests du générateur
FACADE_PREVIEW_SECRET=… node generator/build.mjs <profil.json> --preview --out out   # maquette (out/p/<jeton>/)
node generator/build.mjs <profil.json> --out out                      # site de production (out/sites/<slug>/)
node prospection/sourcer.mjs --departement 69 --metier maconnerie --page 1
node prospection/audit.mjs exemple.fr
```

Vérification visuelle : Chromium headless via Playwright (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`), à 1280 px et 390 px, sans débordement horizontal.

## Invariants (à ne pas casser)

- **Zéro invention dans un site** : pas d'avis, de chiffres, de certifications ou de photos non vérifiés. Les contenus génériques sont marqués `a_valider` et surlignés dans la maquette.
- **Maquettes privées** : `noindex` (meta + en-tête `X-Robots-Tag` + robots.txt), URL = HMAC du slug (non devinable), bandeau « Maquette ». Jamais publiées sous le domaine du prospect.
- **Prospection B2B** : adresse professionnelle publiée (source enregistrée), désinscription en un clic dans chaque email, `fc_suppression` prioritaire sur tout envoi.
- Tout champ de profil est échappé au rendu (le contenu vient du web).
