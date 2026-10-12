# Konsilys — sites internet BTP

Offre de Konsilys : sites internet clés en main pour les PME du BTP, vendus avec la maquette déjà faite. (Le SaaS Konsilys pour ESN vit dans le dépôt `esn-manager`.)

1. `prospection/sourcer.mjs` trouve les entreprises (données publiques SIRENE).
2. `prospection/audit.mjs` garde celles sans site ou avec un site obsolète.
3. `generator/build.mjs --preview` génère leur maquette privée.
4. L'agent `site-seller` leur envoie le lien ; à la signature, `build.mjs` produit le site définitif.

Démarrage : `node tests/run.mjs`. Détails : `CLAUDE.md` et `docs/business-plan.md`.
