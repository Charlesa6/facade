// Feuille de style commune aux sites générés. Les couleurs viennent des variables
// --primary / --accent / --dark / --soft injectées par render.mjs selon le métier.
export const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
svg{display:inline-block;vertical-align:middle;flex-shrink:0}
.wrap{max-width:1140px;margin:0 auto;padding:0 20px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:10px;font-weight:700;font-size:15px;padding:12px 22px;border:2px solid transparent;transition:transform .15s,filter .15s;white-space:nowrap}
.btn:hover{transform:translateY(-1px);filter:brightness(1.05)}
.btn-lg{padding:15px 26px;font-size:16px}
.btn-accent{background:var(--accent);color:var(--dark)}
.btn-ghost{border-color:var(--primary);color:var(--primary);background:#fff}
.btn-ghost-w{border-color:rgba(255,255,255,.5);color:#fff}
.pv{background:#111827;color:#fff;font-size:13px;text-align:center;padding:8px 16px}
.pv b{color:#fde047}
.tbv-key,.is-preview .tbv{background:linear-gradient(transparent 60%,rgba(253,224,71,.55) 60%)}
.is-preview .card.tbv,.is-preview .lead.tbv{background:none;outline:2px dashed rgba(234,179,8,.6);outline-offset:6px}
.hdr{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);border-bottom:1px solid #eef0f3}
.hdr-in{display:flex;align-items:center;gap:24px;height:68px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;color:var(--dark);letter-spacing:-.3px;min-width:0}
.logo span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.logo-mark{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:var(--primary);color:#fff}
.nav{display:flex;gap:4px;margin-left:auto}
.nav a{padding:8px 12px;border-radius:8px;font-weight:600;font-size:15px;color:#374151}
.nav a:hover{background:var(--soft);color:var(--primary)}
.hero{background:linear-gradient(160deg,var(--soft),#fff 70%);padding:72px 0 40px}
.hero-in{display:grid;grid-template-columns:1.25fr .9fr;gap:48px;align-items:center}
.eyebrow{font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--primary);margin-bottom:12px}
h1{font-size:clamp(32px,4.6vw,52px);line-height:1.08;letter-spacing:-1.2px;color:var(--dark);font-weight:800;margin-bottom:18px}
h2{font-size:clamp(26px,3.2vw,36px);line-height:1.15;letter-spacing:-.6px;color:var(--dark);font-weight:800;margin-bottom:24px}
h3{font-size:18px;color:var(--dark);margin-bottom:8px}
.lead{font-size:18px;color:#4b5563;max-width:600px}
.hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.badges{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin-top:22px}
.badges li{display:flex;align-items:center;gap:6px;background:#fff;border:1px solid #e5e7eb;border-radius:999px;padding:6px 12px;font-size:13px;font-weight:700;color:var(--primary)}
.hero-art{position:relative;aspect-ratio:1;max-width:420px;justify-self:center;width:100%}
.art-card{position:absolute;inset:8% 8% 8% 8%;border-radius:28px;background:var(--primary);color:var(--accent);display:grid;place-items:center;box-shadow:0 30px 60px rgba(0,0,0,.18);transform:rotate(-3deg)}
.art-stripes{position:absolute;right:0;bottom:0;width:45%;height:30%;border-radius:18px;background:repeating-linear-gradient(-45deg,var(--accent) 0 14px,var(--dark) 14px 28px);opacity:.9}
.art-dots{background:radial-gradient(circle,var(--accent) 0 5px,transparent 6px) 0 0/22px 22px,var(--dark);opacity:1}
.hero-photo .art-stripes{z-index:0}
.hero-photo img{position:absolute;z-index:1;inset:4% 10% 10% 4%;width:86%;height:86%;object-fit:cover;border-radius:28px;box-shadow:0 30px 60px rgba(0,0,0,.18);transform:rotate(-2deg);background:var(--soft)}
.credit{position:absolute;z-index:2;left:8px;bottom:8px;font-size:11px;background:rgba(0,0,0,.55);color:#fff;padding:2px 8px;border-radius:999px}
.hero-photo .credit{left:8%;bottom:12%}
.gal-sec{padding-top:0}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.gal figure{position:relative;margin:0;border-radius:16px;overflow:hidden;background:var(--soft);aspect-ratio:4/3}
.gal img{width:100%;height:100%;object-fit:cover;display:block}
.gal figcaption{position:absolute;left:0;right:0;bottom:0;padding:18px 12px 8px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.6))}
.gal figcaption~.credit{bottom:auto;top:8px}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;list-style:none;margin-top:48px}
.facts li{background:#fff;border:1px solid #eef0f3;border-radius:16px;padding:18px 20px;box-shadow:0 6px 18px rgba(0,0,0,.04)}
.facts b{display:block;font-size:22px;color:var(--dark)}
.facts span{font-size:14px;color:#6b7280}
.sec{padding:80px 0}
.sec-soft{background:var(--soft)}
.sec-dark{background:var(--dark);color:#e5e7eb}
.sec-dark h2{color:#fff}.sec-dark .eyebrow{color:var(--accent)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.card{border:1px solid #eef0f3;border-radius:18px;padding:26px;background:#fff;transition:box-shadow .2s,transform .2s}
.card:hover{box-shadow:0 18px 40px rgba(0,0,0,.08);transform:translateY(-2px)}
.card p{color:#6b7280;font-size:15px}
.card-ic{display:grid;place-items:center;width:48px;height:48px;border-radius:12px;background:var(--soft);color:var(--primary);margin-bottom:16px}
.two{display:grid;grid-template-columns:1.2fr .8fr;gap:48px;align-items:start}
.checks{list-style:none;display:grid;gap:14px;margin-top:8px}
.checks li{display:flex;gap:12px;align-items:flex-start;font-weight:600}
.checks svg{color:var(--primary);margin-top:2px}
.panel{background:#fff;border-radius:18px;padding:26px;border:1px solid #eef0f3}
.panel dl,.legal dl{display:grid;grid-template-columns:auto 1fr;gap:10px 20px}
.panel dt,.legal dt{color:#6b7280;font-size:14px}.panel dd,.legal dd{font-weight:700;color:var(--dark)}
.zone{list-style:none;display:flex;flex-wrap:wrap;gap:10px}
.zone li{display:flex;align-items:center;gap:6px;background:var(--soft);color:var(--dark);border-radius:999px;padding:10px 16px;font-weight:600}
.zone svg{color:var(--primary)}
.coords{list-style:none;display:grid;gap:18px}
.coords li{display:flex;gap:14px;align-items:flex-start}
.coords svg{color:var(--accent);margin-top:2px}
.coords b{display:block;color:#fff;font-size:14px}
.coords a,.coords span{color:#d1d5db}
.coords-light b{color:var(--dark)}.coords-light a,.coords-light span{color:#4b5563}.coords-light svg{color:var(--primary)}
.ftr{background:#0b0f19;color:#9ca3af;font-size:14px;padding:22px 0}
.ftr-in{display:flex;flex-wrap:wrap;gap:8px 24px;align-items:center}
.ftr a:hover{color:#fff}.made{margin-left:auto;opacity:.6}
.legal{max-width:760px}.legal h1{font-size:36px}.legal h2{font-size:20px;margin:32px 0 12px}.legal p{color:#4b5563}
.link{color:var(--primary);font-weight:700}
/* ── Thème « terroir » (fromagerie) : serif brique, crème et sable, photo plein écran, liens soulignés ── */
.th-terroir{--sand:#E4E1D6;font-family:Mulish,-apple-system,'Segoe UI',Roboto,sans-serif;background:var(--soft);color:#4A2A18}
.th-terroir h1,.th-terroir h2,.th-terroir h3,.th-terroir .logo,.th-terroir .lien,.th-terroir .facts b{font-family:Merriweather,Georgia,serif;letter-spacing:0}
.th-terroir h1,.th-terroir h2,.th-terroir h3{color:var(--primary);font-weight:700}
.th-terroir h2{font-size:clamp(26px,3vw,34px)}
.th-terroir .eyebrow{color:var(--accent);letter-spacing:.14em}
.th-terroir .hdr{background:rgba(244,242,236,.96);border-bottom-color:var(--sand)}
.th-terroir .logo{color:var(--primary)}.th-terroir .logo-mark{border-radius:50%}
.th-terroir .btn{border-radius:2px}
.th-terroir .btn-accent{background:var(--primary);color:#fff}
.th-terroir .btn-ghost{background:transparent}
.th-terroir .lien{display:inline-block;color:var(--primary);font-weight:700;font-size:15px;border-bottom:1.5px solid currentColor;padding-bottom:2px}
.th-terroir .lien:hover{opacity:.75}
.hero-t{position:relative;overflow:hidden;background:var(--sand);padding:110px 0 96px;text-align:center}
.hero-t-photo{padding:150px 0 130px}
.hero-t-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-t-photo::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(rgba(30,16,8,.45),rgba(30,16,8,.62))}
.hero-t .credit{z-index:3;left:auto;right:12px;bottom:12px}
.hero-t-ic{position:absolute;right:-60px;bottom:-90px;color:var(--primary);opacity:.07;pointer-events:none}
.hero-t-in{position:relative;z-index:2;max-width:820px}
.hero-t .lead{margin:0 auto;font-size:18px}
.hero-t .hero-cta{justify-content:center;align-items:center;gap:26px}
.hero-t-photo h1,.hero-t-photo .lead{color:#fff}.hero-t-photo .eyebrow{color:#F3DDB0}
.hero-t-photo .lien{color:#fff}
.th-terroir .facts{margin-top:-40px;position:relative;z-index:3;display:flex;flex-wrap:wrap;justify-content:center}
.th-terroir .facts li{flex:0 1 300px}
.th-terroir .facts li{border-radius:2px;border-color:var(--sand);text-align:center}
.th-terroir .facts b{color:var(--primary)}
.intro-t{text-align:center;max-width:640px;margin:0 auto 40px}
.rang{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;margin:0 0 64px}
.rang-inv .rang-vis{order:2}
.rang-vis{position:relative;aspect-ratio:3/2;background:var(--sand);overflow:hidden}
.rang-vis img{width:100%;height:100%;object-fit:cover;display:block}
.blocs-t{display:grid;grid-template-columns:repeat(2,1fr);gap:28px 56px;max-width:980px;margin:0 auto}
.bloc-t{border-top:1px solid var(--sand);padding-top:22px}
.num-t{display:block;font-family:Merriweather,Georgia,serif;font-size:30px;color:var(--accent);margin-bottom:6px}
.bloc-t p{color:#6B4A36;margin:6px 0 16px}
.bloc-t.tbv{background:none;outline:none}.is-preview .bloc-t.tbv{outline:2px dashed rgba(234,179,8,.6);outline-offset:6px}
.rang-txt p{color:#6B4A36;margin:8px 0 20px;text-align:justify}
.rang.tbv{background:none;outline:none}.is-preview .rang.tbv .rang-txt{outline:2px dashed rgba(234,179,8,.6);outline-offset:8px}
.th-terroir .sec-soft{background:var(--sand);position:relative;overflow:hidden}
.th-terroir .sec-soft .wrap{position:relative;z-index:1}
.filigrane{position:absolute;right:-80px;top:-60px;color:var(--primary);opacity:.06;pointer-events:none}
.th-terroir .panel,.th-terroir .card{border-radius:2px;border-color:var(--sand)}
.th-terroir .checks svg,.th-terroir .coords-light svg,.th-terroir .zone svg{color:var(--primary)}
.th-terroir .sec-dark{background:var(--dark)}
.th-terroir .sec-dark h2{color:#F3DDB0}.th-terroir .sec-dark .eyebrow{color:var(--accent)}
.th-terroir .ftr{background:var(--sand);color:var(--primary)}
.th-terroir .ftr a:hover{color:var(--dark)}
.th-terroir .gal figure{border-radius:2px}
/* ── Thème « maison » (boucherie) : Playfair noir, or, crème, boutons pilule noirs, tuiles ── */
.th-maison{font-family:Jost,-apple-system,'Segoe UI',Roboto,sans-serif;color:#555;background:#fff}
.th-maison h1,.th-maison h2,.th-maison h3,.th-maison .logo,.th-maison .facts b,.th-maison .tuile b{font-family:'Playfair Display',Georgia,serif;letter-spacing:0;font-weight:400;color:#111}
.th-maison h1{font-size:clamp(34px,4.6vw,54px);line-height:1.12}
.th-maison h2{font-size:clamp(28px,3.4vw,40px)}
.th-maison h3{font-weight:600}
.th-maison .eyebrow{color:var(--accent);letter-spacing:.18em;font-weight:500;font-size:12px}
.bandeau{background:var(--accent);color:#fff;font-size:14px;font-weight:500;text-align:center;padding:9px 16px;display:flex;flex-wrap:wrap;justify-content:center;gap:4px 14px}
.bandeau a{color:#fff;text-decoration:underline}
.bandeau span+span::before{content:'·';margin-right:14px}
.th-maison .hdr{border-bottom-color:#ebebeb}
.th-maison .logo-mark{border-radius:50%;background:#111;color:var(--accent)}
.th-maison .btn{border-radius:999px;text-transform:uppercase;letter-spacing:.06em;font-size:13px;font-weight:600}
.th-maison .btn-lg{padding:15px 30px}
.th-maison .btn-accent{background:#111;color:#fff}
.th-maison .btn-ghost{background:transparent;border-color:#111;color:#111}
.hero-m{position:relative;overflow:hidden;background:#1b1714;padding:110px 0}
.hero-m-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-m .credit{z-index:3;left:auto;right:12px;bottom:12px}
.hero-m-ic{position:absolute;right:-40px;bottom:-110px;color:var(--accent);opacity:.12;pointer-events:none}
.hero-m-box{position:relative;z-index:2;max-width:640px;background:rgba(17,17,17,.62);backdrop-filter:blur(2px);border-radius:14px;padding:40px}
.hero-m h1,.hero-m .lead{color:#fff}.hero-m .lead{color:#eee;font-size:17px}
.hero-m .btn-accent{background:#fff;color:#111}
.th-maison .intro-t h2{margin-bottom:6px}
.tuiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.tuile{position:relative;display:block;aspect-ratio:4/5;border-radius:10px;overflow:hidden;background:#1b1714}
.tuile img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}
.tuile:hover img{transform:scale(1.04)}
.tuile::after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 35%,rgba(0,0,0,.72))}
.tuile .credit{z-index:3;top:8px;bottom:auto}
.tuile-ic{position:absolute;inset:0;display:grid;place-items:center;color:var(--accent);padding-bottom:30%}
.tuile-txt{position:absolute;z-index:2;left:0;right:0;bottom:0;padding:18px;color:#fff}
.th-maison .tuile b{display:block;color:#fff;font-size:24px;text-transform:uppercase;letter-spacing:.04em;line-height:1.15}
.tuile small{display:block;font-size:14px;color:#e8e2da;margin-top:6px;line-height:1.4}
.is-preview .tuile.tbv{background-image:none;outline:3px dashed rgba(234,179,8,.8);outline-offset:3px}
.centre{text-align:center;margin-top:36px}
.th-maison .sec-soft{background:var(--soft);position:relative;overflow:hidden}
.th-maison .sec-soft .wrap{position:relative;z-index:1}
.th-maison .filigrane{color:var(--accent);opacity:.1}
.th-maison .panel{border-radius:14px;border-color:#ebebeb;box-shadow:0 10px 30px rgba(0,0,0,.05)}
.th-maison .checks svg,.th-maison .coords-light svg,.th-maison .zone svg{color:var(--accent)}
.th-maison .sec-dark{background:#111}.th-maison .sec-dark h2{color:#fff}
.th-maison .ftr{background:#FFEFDC;color:#111}
.th-maison .ftr a:hover{color:var(--accent)}
.th-maison .gal figure{border-radius:10px}
/* ── Commun aux thèmes de commerces ── */
[class*="th-"] .sec-soft{position:relative;overflow:hidden}
[class*="th-"] .sec-soft .wrap{position:relative;z-index:1}
.note-g{display:flex;align-items:center;gap:6px;font-weight:600;font-size:14px;margin-top:14px}
.note-g svg{color:var(--accent)}
[class*="th-"] .sec-dark h2{color:#fff}
/* ── Thème « fournil » (boulangerie) : capitales espacées, or, encadré blanc, damier ── */
.th-fournil{font-family:Montserrat,-apple-system,'Segoe UI',Roboto,sans-serif;color:#424242;background:#fff}
.th-fournil h1,.th-fournil h2,.th-fournil h3{font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#111}
.th-fournil h1{font-size:clamp(22px,2.6vw,30px);line-height:1.35}
.th-fournil h2{font-size:clamp(20px,2.2vw,26px);letter-spacing:.16em}
.th-fournil h2::after{content:'';display:block;width:48px;height:2px;background:var(--accent);margin-top:14px}
.th-fournil h3{font-size:15px}
.th-fournil .eyebrow{color:var(--accent);letter-spacing:.2em}
.script{font-family:'Great Vibes',cursive;color:var(--accent);font-size:44px;line-height:1;margin-bottom:6px}
.th-fournil .logo{font-weight:600;text-transform:uppercase;letter-spacing:.12em;font-size:15px}
.th-fournil .logo-mark{border-radius:50%;background:#fff;color:#111;border:1.5px solid #111}
.th-fournil .nav a{text-transform:uppercase;font-size:12px;letter-spacing:.08em;font-weight:600}
.th-fournil .nav a:hover{background:none;color:var(--accent)}
.th-fournil .btn{border-radius:2px;text-transform:uppercase;letter-spacing:.12em;font-size:12px;font-weight:700}
.th-fournil .btn-accent{background:var(--accent);color:#fff}
.th-fournil .btn-ghost{border-color:#111;color:#111;background:#fff}
.hero-f{position:relative;overflow:hidden;background:var(--soft);padding:110px 0}
.hero-f-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-f .credit{z-index:3;left:auto;right:12px;bottom:12px}
.hero-f-box{position:relative;z-index:2;max-width:580px;margin:0 auto;background:rgba(255,255,255,.95);padding:46px 42px;text-align:center;outline:1px solid #d9d9d9;outline-offset:-12px;box-shadow:0 20px 50px rgba(0,0,0,.15)}
.hero-f-box h2::after,.hero-f-box h1::after{display:none}
.hero-f-box .lead{font-size:15px;margin:0 auto}
.hero-f .hero-cta,.hero-f .note-g{justify-content:center}
.damier{height:16px;background:conic-gradient(#111 25%,#fff 0 50%,#111 0 75%,#fff 0) 0 0/16px 16px}
.univers{background:#1d1a17}
.titre-f{text-align:center;color:#fff!important}.titre-f::after{margin:14px auto 0}
.univ-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}
.univ{position:relative;display:flex;flex-direction:column;justify-content:flex-end;aspect-ratio:3/4;overflow:hidden;background:#2b2621;padding:18px}
.univ img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.78;transition:transform .4s}
.univ:hover img{transform:scale(1.04)}
.univ::after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 45%,rgba(0,0,0,.7))}
.univ .credit{z-index:3;top:8px;bottom:auto}
.univ-ic{position:absolute;top:26px;left:50%;transform:translateX(-50%);z-index:2;display:grid;place-items:center;width:66px;height:66px;border-radius:50%;background:var(--accent);color:#fff}
.univ-txt{position:relative;z-index:2;text-align:center}
.univ-txt b{display:block;background:var(--accent);color:#fff;text-transform:uppercase;letter-spacing:.1em;font-size:13px;font-weight:600;padding:12px 8px}
.univ-txt small{display:block;color:#f1ece4;font-size:13px;margin-top:10px;line-height:1.45;text-shadow:0 1px 3px rgba(0,0,0,.7)}
.is-preview .univ.tbv{background:#2b2621;outline:3px dashed rgba(234,179,8,.8);outline-offset:3px}
.th-fournil .filigrane{color:var(--accent);opacity:.12}
.th-fournil .panel,.th-fournil .gal figure{border-radius:0}
.th-fournil .checks svg,.th-fournil .coords-light svg,.th-fournil .zone svg{color:var(--accent)}
.th-fournil .sec-dark{background:#161616}.th-fournil .sec-dark h2{color:#fff}
.th-fournil .ftr{background:#111;color:#bbb}.th-fournil .ftr a:hover{color:var(--accent)}
/* ── Thème « atelier » (fleuriste) : grand serif, pêche, vert olive, cartes portrait ── */
.th-atelier{font-family:Inter,-apple-system,'Segoe UI',Roboto,sans-serif;font-weight:300;color:#34352D;background:#fff}
.th-atelier h1,.th-atelier h2,.th-atelier h3,.th-atelier .logo,.prod b{font-family:Gloock,Georgia,serif;font-weight:400;letter-spacing:0;color:#34352D}
.th-atelier h1{font-size:clamp(38px,5vw,64px);line-height:1.08}
.th-atelier h2{font-size:clamp(28px,3.2vw,40px)}
.th-atelier .eyebrow{color:#7a7b70;font-weight:500;font-size:11px;letter-spacing:.3em}
.th-atelier .bandeau{color:#34352D;font-size:13px;font-weight:400}.th-atelier .bandeau a{color:#34352D}
.th-atelier .nav a{text-transform:uppercase;font-size:12px;font-weight:500;letter-spacing:.06em}
.th-atelier .nav a:hover{background:none;color:#000}
.th-atelier .logo-mark{border-radius:50%;background:none;color:#34352D;border:1.5px solid #34352D}
.th-atelier .btn{border-radius:999px;font-weight:500}
.th-atelier .btn-accent{background:#fff;color:#34352D;box-shadow:0 2px 12px rgba(0,0,0,.1)}
.th-atelier .hdr .btn-accent{background:var(--accent)}
.th-atelier .btn-ghost{border:1px solid #34352D;color:#34352D;background:#fff}
.btn-blanc{background:#fff;color:#34352D}
.hero-a{position:relative;overflow:hidden;background:#EEEFEC;min-height:560px;display:flex;align-items:center}
.hero-a-vis{position:absolute;top:0;right:0;bottom:0;width:64%}
.hero-a-vis img{width:100%;height:100%;object-fit:cover;-webkit-mask-image:linear-gradient(90deg,transparent,#000 40%);mask-image:linear-gradient(90deg,transparent,#000 40%)}
.hero-a .credit{left:auto;right:12px;bottom:12px}
.hero-a-ic{position:absolute;right:-20px;bottom:-70px;color:var(--accent);opacity:.55}
.hero-a .wrap{position:relative;z-index:2;width:100%}
.hero-a-txt{max-width:560px;padding:80px 0}
.hero-a-txt p{font-size:16px}
.band-a{background:var(--accent);text-align:center;padding:68px 0}
.band-a .wrap{max-width:820px}
.band-a .eyebrow{color:#fff}
.band-a p{font-size:16px;line-height:1.7;margin-bottom:24px;font-weight:400}
.band-a .note-g{justify-content:center;margin:-12px 0 24px}.band-a .note-g svg{color:#34352D}
.prods{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.prod{display:block}
.prod-vis{position:relative;display:grid;place-items:center;aspect-ratio:4/5;background:var(--soft);color:var(--accent);overflow:hidden;margin-bottom:12px}
.prod-vis img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .4s}
.prod:hover .prod-vis img{transform:scale(1.04)}
.prod b{display:block;font-size:20px}
.prod small{display:block;font-size:14px;color:#6b6c62;line-height:1.45;margin-top:4px}
.is-preview .prod.tbv{background:none;outline:2px dashed rgba(234,179,8,.6);outline-offset:6px}
.th-atelier .filigrane{color:var(--accent);opacity:.3}
.th-atelier .checks li{font-weight:400}
.th-atelier .checks svg,.th-atelier .coords-light svg,.th-atelier .zone svg{color:#34352D}
.th-atelier .panel,.th-atelier .gal figure{border-radius:0}
.th-atelier .sec-dark{background:#34352D}
.th-atelier .ftr{background:var(--soft);color:#34352D}.th-atelier .ftr a:hover{color:#000}
/* ── Thème « boucle » (coiffure) : crème et corail, grotesque, pilules, grande photo arrondie ── */
.th-boucle{font-family:'Bricolage Grotesque',-apple-system,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;background:var(--soft)}
.th-boucle h1,.th-boucle h2,.th-boucle h3{font-weight:600;letter-spacing:-.02em;color:#000}
.th-boucle h2{font-size:clamp(30px,3.6vw,44px)}
.th-boucle .eyebrow{color:var(--primary)}
.th-boucle .hdr{background:rgba(251,244,239,.96);border-bottom-color:#f0e2d8}
.th-boucle .nav a:hover{background:#fff;color:#000}
.th-boucle .logo-mark{border-radius:50%;background:var(--accent)}
.th-boucle .btn{border-radius:30px;font-weight:600}
.th-boucle .btn-accent{background:var(--accent);color:#fff}
.th-boucle .btn-ghost{background:#fff;border-color:#fff;color:#000}
.hero-c{padding:28px 0 8px}
.hero-c-box{position:relative;overflow:hidden;border-radius:24px;background:linear-gradient(135deg,#F6D6C8,#FBEDE5);min-height:500px;display:flex;align-items:flex-end;padding:48px}
.hero-c-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-c-photo .hero-c-box::after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 30%,rgba(0,0,0,.62))}
.hero-c .credit{z-index:3;left:auto;right:14px;top:14px;bottom:auto}
.hero-c-ic{position:absolute;right:-30px;top:-40px;color:#fff;opacity:.75}
.hero-c-txt{position:relative;z-index:2;max-width:640px}
.hero-c h1{font-size:clamp(36px,5vw,60px)}
.hero-c-photo h1,.hero-c-photo .lead,.hero-c-photo .eyebrow{color:#fff}
.hero-c .lead{color:#333}.hero-c-photo .lead{color:#f3f3f3}
.presta{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.presta-c{background:#fff;border-radius:16px;padding:22px 18px;text-align:center}
.presta-ic{display:grid;place-items:center;width:76px;height:76px;margin:0 auto 14px;border-radius:50%;background:var(--soft);color:var(--accent)}
.presta-vis{position:relative;display:block;aspect-ratio:1;border-radius:12px;overflow:hidden;margin-bottom:14px}
.presta-vis img{width:100%;height:100%;object-fit:cover;display:block}
.presta-c h3{font-size:17px}
.presta-c p{font-size:14px;color:#555}
.is-preview .presta-c.tbv{background:#fff;outline:2px dashed rgba(234,179,8,.7);outline-offset:3px}
.th-boucle .sec-soft{background:#F6E6DC}
.th-boucle .filigrane{color:var(--accent);opacity:.25}
.th-boucle .panel{border-radius:16px;border:0}
.th-boucle .gal figure{border-radius:16px}
.th-boucle .checks svg,.th-boucle .coords-light svg,.th-boucle .zone svg{color:var(--accent)}
.th-boucle .sec-dark{background:#1a1a1a}
.th-boucle .ftr{background:var(--accent);color:#fff}.th-boucle .ftr a:hover{color:#000}
/* ── Thème « trattoria » (restaurant) : crème et brun, nom en capitales italiques, cartes à bordure fine ── */
.th-trattoria{font-family:Lora,Georgia,serif;color:#321108;background:var(--soft)}
.th-trattoria h1,.th-trattoria h2,.th-trattoria h3{font-family:Lora,Georgia,serif;font-weight:400;letter-spacing:-.02em;color:#321108}
.th-trattoria h2{font-size:clamp(28px,3.2vw,40px)}
.th-trattoria .eyebrow,.th-trattoria .nav a,.th-trattoria .btn,.titre-r,.th-trattoria .gal figcaption{font-family:'Red Hat Display',sans-serif;text-transform:uppercase;letter-spacing:.04em}
.th-trattoria .eyebrow{color:#321108;font-weight:700;font-size:12px}
.th-trattoria .hdr{background:rgba(255,253,244,.96);border-bottom-color:#eadfcf}
.th-trattoria .logo{font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:#321108}
.th-trattoria .logo-mark{border-radius:4px;background:#321108;color:var(--soft)}
.th-trattoria .nav a{font-size:13px;font-weight:500;color:#321108}
.th-trattoria .nav a:hover{background:none;text-decoration:underline}
.th-trattoria .btn{border-radius:2px;font-size:13px;font-weight:500;padding:9px 14px}
.th-trattoria .btn-lg{padding:12px 20px}
.th-trattoria .btn-accent{background:#321108;color:var(--soft)}
.th-trattoria .btn-ghost{background:transparent;border:1px solid #321108;color:#321108}
.btn-clair{background:var(--soft);color:#321108}
.hero-r{position:relative;overflow:hidden;background:#321108;min-height:620px;display:flex;align-items:flex-end;padding:0 0 64px;text-align:center}
.hero-r-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-r-photo::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(rgba(20,6,2,.1) 30%,rgba(20,6,2,.6))}
.hero-r .credit{z-index:3;left:auto;right:12px;top:12px;bottom:auto}
.hero-r-ic{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);color:var(--soft);opacity:.07}
.hero-r-in{position:relative;z-index:2;width:100%}
.hero-r-nom{font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:var(--soft);font-size:clamp(40px,7vw,92px);line-height:1.05;text-shadow:0 2px 20px rgba(0,0,0,.35);overflow-wrap:anywhere}
.th-trattoria .hero-r h1{font-family:'Red Hat Display',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin:14px 0 20px}
.titre-r{font-size:16px!important;font-weight:700!important;margin-bottom:16px}
.intro-r p{font-size:17px;line-height:1.65;margin-bottom:14px}
.intro-r .wrap{max-width:760px}
.intro-r .intro-r-two{max-width:1140px;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.intro-r-vis{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:4/3}
.intro-r-vis img{width:100%;height:100%;object-fit:cover;display:block}
.cartes-sec{padding-top:0}
.cartes-r{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.carte-r{display:grid;grid-template-columns:.8fr 1.2fr;gap:18px;border:1px solid #d9cbb8;border-radius:16px;padding:24px}
.carte-r h3{font-size:24px;line-height:1.15}
.carte-r p{font-size:15px;margin-bottom:12px}
.is-preview .carte-r.tbv{background:none;outline:2px dashed rgba(234,179,8,.7);outline-offset:3px}
.th-trattoria .gal{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
.th-trattoria .gal figure{aspect-ratio:3/4;border-radius:4px}
.th-trattoria .sec-soft{background:#F6EFDC}
.th-trattoria .filigrane{color:#321108;opacity:.05}
.th-trattoria .panel{border-radius:16px;border-color:#d9cbb8;background:var(--soft)}
.th-trattoria .checks li{font-weight:400}
.th-trattoria .checks svg,.th-trattoria .coords-light svg,.th-trattoria .zone svg,.th-trattoria .note-g svg{color:#321108}
.th-trattoria .sec-dark{background:#321108;color:#efe6d6}.th-trattoria .sec-dark h2{color:var(--soft)}.th-trattoria .sec-dark .eyebrow{color:#e9c9a0}
.th-trattoria .sec-dark .btn-accent{background:var(--soft);color:#321108}
.th-trattoria .ftr{background:#321108;color:#d8c9b5}
/* ── Thème « marée » (poissonnerie) : en-tête saumon, capitales espacées, bleu nuit, cartes ombrées ── */
.th-maree{font-family:Lato,Arial,sans-serif;color:#333;background:#fff}
.th-maree h1,.th-maree h2,.th-maree h3{font-family:Lato,Arial,sans-serif;letter-spacing:0}
.th-maree h2{font-weight:300;color:var(--primary);font-size:clamp(30px,3.6vw,44px);line-height:1.15}
.th-maree h3{font-weight:900;text-transform:uppercase;letter-spacing:.1em;font-size:16px;color:var(--dark)}
.th-maree .eyebrow{color:var(--primary)}
.th-maree .hdr{background:var(--accent);border-bottom:0}
.th-maree .logo{color:#fff}.th-maree .logo-mark{border-radius:50%;background:#fff;color:var(--primary)}
.th-maree .nav a{color:#fff;text-transform:uppercase;font-size:13px;font-weight:700;letter-spacing:.08em}
.th-maree .nav a:hover{background:rgba(255,255,255,.18);color:#fff}
.th-maree .btn{border-radius:0;text-transform:uppercase;letter-spacing:.12em;font-size:13px;font-weight:900}
.th-maree .btn-accent{background:var(--accent);color:#fff}
.th-maree .hdr .btn-accent{background:#fff;color:var(--primary)}
.th-maree .btn-ghost{border-color:var(--accent);color:var(--primary);background:#fff}
.hero-o{position:relative;overflow:hidden;background:var(--dark);padding:150px 0 130px;text-align:center}
.hero-o-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-o-photo::before{content:'';position:absolute;inset:0;z-index:1;background:rgba(10,14,20,.42)}
.hero-o .credit{z-index:3;left:auto;right:12px;bottom:12px}
.hero-o-ic{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:#fff;opacity:.05}
.hero-o-in{position:relative;z-index:2}
.th-maree .hero-o h1{color:#fff;font-weight:400;text-transform:uppercase;letter-spacing:.1em;font-size:clamp(28px,5vw,60px);line-height:1.15;margin-bottom:30px;text-shadow:0 2px 16px rgba(0,0,0,.35)}
.intro-o .intro-o-two{display:grid;grid-template-columns:1.4fr 1fr;gap:48px;align-items:start}
.intro-o .lead{font-size:17px;color:#444}
.coords-o{list-style:none;border-left:1px solid #ddd;padding-left:32px;display:grid;gap:18px}
.coords-o li{display:flex;gap:14px;align-items:flex-start;font-size:15px}
.coords-o svg{color:var(--dark)}
.coords-o a{text-decoration:underline}
.titre-o{text-align:center}
.cartes-o{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px}
.carte-o{background:var(--soft);padding:28px 22px;text-align:center;box-shadow:0 6px 16px rgba(0,0,0,.12)}
.carte-o-photo{background:#fff;padding:12px 12px 22px}
.carte-o-vis{position:relative;display:block;aspect-ratio:1;overflow:hidden;margin-bottom:16px}
.carte-o-vis img{width:100%;height:100%;object-fit:cover;display:block}
.carte-o-ic{display:inline-grid;place-items:center;color:var(--dark);margin-bottom:12px}
.carte-o p{font-size:15px;color:#444}
.is-preview .carte-o.tbv{background:var(--soft);outline:2px dashed rgba(234,179,8,.7);outline-offset:3px}
.is-preview .carte-o-photo.tbv{background:#fff}
.th-maree .sec-soft{background:var(--dark);color:#d6dbe3}
.th-maree .sec-soft h2{color:#7C9BD0}.th-maree .sec-soft .eyebrow{color:var(--accent)}
.th-maree .sec-soft p{color:#d6dbe3}
.th-maree .sec-soft .checks li{font-weight:400}.th-maree .sec-soft .checks svg{color:var(--accent)}
.th-maree .sec-soft .panel{background:#1c2533;border-color:#2a3546}
.th-maree .sec-soft .panel h3,.th-maree .sec-soft .panel dd{color:#fff}.th-maree .sec-soft .panel dt{color:#9aa6b8}
.th-maree .filigrane{color:#fff;opacity:.04}
.th-maree .coords-light svg,.th-maree .zone svg{color:var(--primary)}
.th-maree .sec-dark{background:#0d131c}
.th-maree .gal figure{border-radius:0}
.th-maree .ftr{background:var(--accent);color:#fff}.th-maree .ftr a:hover{color:var(--dark)}
@media (max-width:860px){
  .hero-f{padding:56px 0}.hero-f-box{padding:34px 22px}.script{font-size:36px}
  .univ-grid{grid-template-columns:1fr 1fr;gap:10px}.univ{padding:10px}.univ small{display:none}.univ-ic{width:52px;height:52px;top:16px}.univ-txt b{font-size:11px;padding:10px 4px}
  .hero-a{min-height:0;display:block}.hero-a-vis{position:relative;width:100%;height:300px}
  .hero-a-vis img{-webkit-mask-image:linear-gradient(transparent,#000 30%);mask-image:linear-gradient(transparent,#000 30%)}
  .hero-a-txt{padding:56px 0}.hero-a-photo .hero-a-txt{padding:20px 0 48px}.hero-a-ic{right:-120px}
  .prods{grid-template-columns:1fr 1fr;gap:12px}.prod small{display:none}.prod b{font-size:17px}
  .band-a{padding:48px 0}
  .hero-c{padding-top:16px}.hero-c-box{min-height:440px;padding:26px 22px;border-radius:18px}
  .presta{grid-template-columns:1fr 1fr;gap:10px}.presta-c{padding:16px 12px}
  .hero-r{min-height:520px}
  .intro-r .intro-r-two{grid-template-columns:1fr;gap:28px}
  .cartes-r{grid-template-columns:1fr}.carte-r{grid-template-columns:1fr;gap:6px}
  .hero-o{padding:96px 0 84px}
  .intro-o .intro-o-two{grid-template-columns:1fr;gap:28px}.coords-o{border-left:0;border-top:1px solid #ddd;padding:24px 0 0}
}
/* ── Thème « énergie » (salle de sport) : noir, jaune fluo, titres condensés en capitales, cartes numérotées ── */
.th-energie{font-family:Inter,-apple-system,'Segoe UI',Roboto,sans-serif;color:#2a2a2a;background:var(--soft)}
.th-energie h1,.th-energie h2,.th-energie h3,.th-energie .logo,.num-e{font-family:Oswald,Impact,'Arial Narrow',sans-serif;text-transform:uppercase;letter-spacing:.01em;font-weight:700;color:#0E0E0E}
.th-energie h1{font-size:clamp(40px,6.4vw,84px);line-height:.98}
.th-energie h2{font-size:clamp(32px,4.4vw,56px);line-height:1}
.th-energie h3{font-size:22px;font-weight:600}
.th-energie .eyebrow{color:#0E0E0E;font-weight:700;letter-spacing:.16em}
.th-energie .bandeau{color:#0E0E0E;font-weight:600}.th-energie .bandeau a{color:#0E0E0E}
.th-energie .hdr{background:rgba(14,14,14,.97);border-bottom:0}
.th-energie .logo{color:#fff}.th-energie .logo-mark{border-radius:6px;background:var(--accent);color:#0E0E0E}
.th-energie .nav a{color:#ddd;text-transform:uppercase;font-size:13px;letter-spacing:.06em}
.th-energie .nav a:hover{background:none;color:var(--accent)}
.th-energie .btn{border-radius:4px;text-transform:uppercase;letter-spacing:.06em;font-size:14px;font-weight:700}
.th-energie .btn-accent{background:var(--accent);color:#0E0E0E}
.th-energie .btn-ghost{background:transparent;border-color:#0E0E0E;color:#0E0E0E}
.hero-e{position:relative;overflow:hidden;background:#0E0E0E;padding:120px 0 110px}
.hero-e-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-e-photo::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(0,0,0,.85),rgba(0,0,0,.35))}
.hero-e .credit{z-index:3;left:auto;right:12px;bottom:12px}
.hero-e-ic{position:absolute;right:-80px;top:50%;transform:translateY(-50%) rotate(-30deg);color:var(--accent);opacity:.14}
.hero-e-in{position:relative;z-index:2}
.hero-e h1{color:#fff;max-width:820px}
.hero-e h1::after{content:'';display:block;width:96px;height:8px;background:var(--accent);margin-top:22px}
.hero-e .eyebrow{color:var(--accent)}
.hero-e .lead{color:#d8d8d8}
.hero-e .note-g{color:#fff}
.sec-e{background:#0E0E0E}
.sec-e h2{color:#fff}.sec-e .eyebrow{color:var(--accent)}
.cartes-e{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-bottom:8px}
.carte-e{position:relative;overflow:hidden;min-height:300px;display:flex;flex-direction:column;justify-content:flex-end;background:#1a1a1a;border-radius:6px;padding:24px;border-top:4px solid var(--accent)}
.carte-e img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;transition:transform .4s}
.carte-e:hover img{transform:scale(1.04)}
.carte-e .credit{z-index:3;top:8px;bottom:auto}
.num-e{position:absolute;z-index:2;top:16px;left:22px;font-size:56px;line-height:1;color:var(--accent)!important}
.carte-e-txt{position:relative;z-index:2}
.carte-e h3{color:#fff}
.carte-e p{color:#cfcfcf;font-size:15px}
.is-preview .carte-e.tbv{background:#1a1a1a;outline:2px dashed rgba(234,179,8,.8);outline-offset:3px}
.th-energie .sec-soft{background:#fff}
.th-energie .filigrane{color:#0E0E0E;opacity:.05}
.th-energie .panel{border-radius:6px;border-left:4px solid var(--accent)}
.th-energie .checks svg,.th-energie .coords-light svg,.th-energie .zone svg,.th-energie .note-g svg{color:#0E0E0E}
.hero-e .note-g svg{color:var(--accent)}
.th-energie .sec-dark{background:#0E0E0E}.th-energie .sec-dark .eyebrow{color:var(--accent)}
.th-energie .gal figure{border-radius:6px}
.th-energie .ftr{background:var(--accent);color:#0E0E0E}.th-energie .ftr a:hover{color:#555}
@media (max-width:860px){
  .hero-e{padding:72px 0 64px}.hero-e-ic{right:-200px}
  .cartes-e{grid-template-columns:1fr 1fr;gap:10px}.carte-e{min-height:220px;padding:14px}.carte-e p{display:none}.num-e{font-size:40px;left:14px;top:10px}.carte-e h3{font-size:18px}
}
@media (max-width:860px){
  .hero-m{padding:48px 0}.hero-m-box{padding:26px 22px}
  .tuiles{grid-template-columns:1fr 1fr;gap:10px}
  .th-maison .tuile b{font-size:18px}.tuile small{display:none}.tuile-txt{padding:12px}
  .bandeau span+.bandeau-h{display:none}
}
@media (max-width:860px){
  .hero-t{padding:72px 0 80px}.hero-t-photo{padding:96px 0 104px}
  .rang{grid-template-columns:1fr;gap:18px;margin-bottom:44px}.rang-inv .rang-vis{order:0}
  .blocs-t{grid-template-columns:1fr;gap:22px}
  .rang-txt p{text-align:left}
  .th-terroir .facts{margin-top:-28px}
}
@media (max-width:860px){
  .nav{display:none}.hdr-cta{margin-left:auto}
  .hero{padding:40px 0 24px}.hero-in,.two{grid-template-columns:1fr;gap:28px}
  .hero-art{max-width:240px;order:-1}.hero-photo{max-width:320px}
  .gal{grid-template-columns:1fr 1fr;gap:10px}
  .facts{grid-template-columns:1fr;margin-top:28px}
  .sec{padding:56px 0}.made{margin-left:0}
}
@media (max-width:480px){
  .hdr-cta span{display:none}.hdr-cta{padding:10px 12px}
  .btn-lg{width:100%}
}
`;
