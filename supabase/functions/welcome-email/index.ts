// Supabase Edge Function — Welcome Email via n8n
// Deploy: supabase functions deploy welcome-email
// Secret: supabase secrets set N8N_WEBHOOK_URL=https://your-n8n.com/webhook/colorplay-welcome
//
// Trigger: Database Webhook on INSERT on public.profiles
// (Supabase Dashboard → Database → Webhooks → New webhook)
// Table: profiles, Events: INSERT
// URL: https://<project>.supabase.co/functions/v1/welcome-email
// HTTP Method: POST
// HTTP Headers: Authorization: Bearer <anon_key>

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()

    // Supabase DB webhook payload structure
    const record = payload.record || payload
    const email = record.email
    const userId = record.id
    const plan = record.plan || 'free'
    const credits = record.credits_remaining ?? 5

    if (!email) {
      return new Response(JSON.stringify({ error: 'No email in payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Forward to n8n webhook
    const n8nUrl = Deno.env.get('N8N_WEBHOOK_URL')
    if (!n8nUrl) {
      console.warn('N8N_WEBHOOK_URL not set, skipping email')
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'user_signup',
        email,
        userId,
        plan,
        credits,
        timestamp: new Date().toISOString(),
        appName: 'ColorPlay',
        appUrl: 'https://colorplay.app',
        generatorUrl: 'https://colorplay.app/generator',
        pricingUrl: 'https://colorplay.app/pricing',
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status}`)
    }

    return new Response(JSON.stringify({ success: true, email }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Welcome email error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
