// Désinscription en un clic des emails de prospection Façade.
// GET  ?t=<unsub_token>  → page de confirmation
// POST ?t=<unsub_token>  → désinscription directe (en-tête List-Unsubscribe-Post, RFC 8058)
// ⚠ Déployer avec verify_jwt=false : le lien est cliqué depuis un email, sans session.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const page = (msg: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Désinscription — Façade</title><style>body{font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:0 20px;color:#1f2937;line-height:1.6}h1{font-size:22px}</style></head><body><h1>Façade</h1><p>${msg}</p></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8' } },
  );

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get('t') ?? '';
  if (!/^[a-f0-9]{36}$/.test(token)) return page('Lien de désinscription invalide.', 400);

  const { data: p } = await sb.from('fc_prospects').select('id,email').eq('unsub_token', token).maybeSingle();
  if (!p) return page('Lien de désinscription invalide ou expiré.', 404);

  await sb.from('fc_prospects').update({ status: 'desinscrit', next_action_at: null, updated_at: new Date().toISOString() }).eq('id', p.id);
  if (p.email) await sb.from('fc_suppression').upsert({ email: p.email.toLowerCase(), reason: 'lien de désinscription' });

  return req.method === 'POST'
    ? new Response(null, { status: 204 })
    : page('C\'est fait : vous ne recevrez plus aucun email de notre part. Votre maquette sera supprimée sous 7 jours.');
});
