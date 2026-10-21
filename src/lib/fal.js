import * as fal from '@fal-ai/serverless-client'

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
})

const LEVEL_PROMPTS = {
  child: 'extremely simple design, very large coloring areas, super bold thick outlines (3-4px), minimal details, designed for young children aged 3-8, no complex patterns',
  adult: 'highly detailed and intricate illustration, complex patterns, fine delicate lines, rich textures, suitable for adult coloring enthusiasts who enjoy a challenge',
  mandala: 'perfectly symmetrical mandala coloring page, circular geometric patterns, intricate zentangle-inspired design, radial symmetry, detailed ornamental motifs',
}

const STYLE_PROMPTS = {
  simple: 'simple clean cartoon style, rounded shapes, friendly and cheerful aesthetic, easy to color',
  detailed: 'highly detailed illustration, fine crosshatch-ready lines, rich textures, decorative patterns throughout',
  manga: 'manga and anime inspired illustration style, expressive Japanese comics aesthetic, dynamic expressive linework, characteristic manga proportions',
  minimal: 'minimalist modern design, elegant sparse clean lines, geometric simplicity, contemporary aesthetic, negative space',
}

export const generateColoring = async (prompt, style, level) => {
  const systemPrompt = `Coloring book page illustration: ${prompt}.
${STYLE_PROMPTS[style] || style}. ${LEVEL_PROMPTS[level] || level}.
ABSOLUTE REQUIREMENTS: pure black outlines on pure white background only, NO grey tones, NO shading, NO fills, NO gradients, NO color whatsoever, clean crisp printable lines, high contrast black ink on white paper, coloring book format, ready to print and color by hand.`

  const result = await fal.subscribe('fal-ai/flux/schnell', {
    input: {
      prompt: systemPrompt,
      image_size: 'portrait_4_3',
      num_inference_steps: 8,
      num_images: 1,
      guidance_scale: 3.5,
    },
  })

  return result.images[0].url
}

export const downloadImageAsPng = async (imageUrl, filename = 'colorplay') => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PNG download error:', err)
    // Fallback: open in new tab
    window.open(imageUrl, '_blank')
  }
}
