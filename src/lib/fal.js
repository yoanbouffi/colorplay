import * as fal from '@fal-ai/serverless-client'

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
})

const LEVEL_PROMPTS = {
  child: 'very simple design, large areas to color, bold thick outlines, easy for young children aged 3-8',
  adult: 'highly detailed and intricate, complex patterns, fine lines, suitable for adult coloring enthusiasts',
  mandala: 'mandala style, perfectly circular and symmetrical geometric patterns, intricate zentangle-inspired design',
}

const STYLE_PROMPTS = {
  simple: 'simple cartoon style, clean minimal lines, cheerful and fun',
  detailed: 'highly detailed illustration, fine lines, rich with textures and patterns',
  manga: 'manga and anime style, expressive Japanese comics aesthetic, dynamic linework',
  minimal: 'minimalist modern style, elegant sparse lines, contemporary design',
}

export const generateColoring = async (prompt, style, level) => {
  const systemPrompt = `Create a black and white coloring page illustration.
Style: ${STYLE_PROMPTS[style] || style}.
Complexity: ${LEVEL_PROMPTS[level] || level}.
Subject: ${prompt}.
CRITICAL REQUIREMENTS: pure black outlines ONLY on pure white background, absolutely NO shading, NO grey tones, NO fills, NO gradients, NO color, clean crisp lines suitable for coloring by hand, printable coloring page format, high contrast black on white.`

  const result = await fal.subscribe('fal-ai/flux/schnell', {
    input: {
      prompt: systemPrompt,
      image_size: 'portrait_4_3',
      num_inference_steps: 4,
      num_images: 1,
    },
  })

  return result.images[0].url
}
