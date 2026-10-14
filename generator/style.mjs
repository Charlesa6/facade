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
