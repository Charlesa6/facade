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
