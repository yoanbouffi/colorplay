import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization header')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (userError || !user) throw new Error('Unauthorized')

    // Check credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits_remaining')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) throw new Error('Profile not found')
    if (profile.credits_remaining <= 0) throw new Error('No credits remaining')

    // Parse body
    const { prompt, style = 'simple' } = await req.json()
    if (!prompt) throw new Error('Prompt is required')

    // Build fal.ai prompt
    const styleGuide = {
      simple: 'simple thick outlines, minimal details, suitable for young children coloring book',
      detailed: 'detailed fine lines, intricate patterns, adult coloring book style',
      mandala: 'mandala style, geometric patterns, radial symmetry, zentangle inspired',
    }[style] ?? 'simple thick outlines'

    const falPrompt = `Black and white coloring page illustration of: ${prompt}. ${styleGuide}. Pure white background, clean black outlines only, no gray fills, no shading, no color, printable coloring book page, vector art style.`

    // Call fal.ai
    const falKey = Deno.env.get('FAL_KEY')
    if (!falKey) throw new Error('FAL_KEY not configured')

    const falRes = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: falPrompt,
        image_size: 'square_hd',
        num_images: 1,
        num_inference_steps: 4,
        enable_safety_checker: true,
      }),
    })

    if (!falRes.ok) {
      const err = await falRes.text()
      throw new Error(`fal.ai error: ${err}`)
    }

    const falData = await falRes.json()
    const imageUrl = falData?.images?.[0]?.url
    if (!imageUrl) throw new Error('No image returned from fal.ai')

    // Deduct 1 credit
    const { error: creditError } = await supabase.rpc('deduct_credit', { user_id: user.id })
    if (creditError) {
      // fallback: manual deduct
      await supabase
        .from('profiles')
        .update({ credits_remaining: profile.credits_remaining - 1 })
        .eq('id', user.id)
    }

    // Save to colorings table
    const { error: insertError } = await supabase
      .from('colorings')
      .insert({
        user_id: user.id,
        prompt,
        style,
        image_url: imageUrl,
      })
    // Non-fatal if insert fails

    // Get updated credits
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('credits_remaining')
      .eq('id', user.id)
      .single()

    return new Response(
      JSON.stringify({
        svg_url: imageUrl,
        credits_remaining: updatedProfile?.credits_remaining ?? profile.credits_remaining - 1,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('generate-coloring error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
