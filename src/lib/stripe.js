import { loadStripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export const PLANS = {
  free: {
    id: 'free',
    name: 'Gratuit',
    nameEn: 'Free',
    price: 0,
    credits: 5,
    stripe_price_id: null,
    features: ['5 coloriages/mois', 'Résolution standard', 'Téléchargement PNG'],
    featuresEn: ['5 colorings/month', 'Standard resolution', 'PNG download'],
  },
  family: {
    id: 'family',
    name: 'Famille',
    nameEn: 'Family',
    price: 4.99,
    credits: 50,
    stripe_price_id: 'price_family_id',
    popular: true,
    features: ['50 coloriages/mois', 'Haute résolution', 'Téléchargement PDF', 'Impression optimisée', 'Historique complet'],
    featuresEn: ['50 colorings/month', 'High resolution', 'PDF download', 'Optimized printing', 'Full history'],
  },
  teacher: {
    id: 'teacher',
    name: 'Professeur',
    nameEn: 'Teacher',
    price: 9.99,
    credits: 9999,
    stripe_price_id: 'price_teacher_id',
    features: ['Coloriages illimités', 'Haute résolution', 'PDF + impression', 'Historique complet', 'Support prioritaire'],
    featuresEn: ['Unlimited colorings', 'High resolution', 'PDF + print', 'Full history', 'Priority support'],
  },
  school: {
    id: 'school',
    name: 'École',
    nameEn: 'School',
    price: 29.99,
    credits: 9999,
    stripe_price_id: 'price_school_id',
    features: ['Coloriages illimités', 'Haute résolution', 'PDF + impression', '5 comptes enseignants', 'Support dédié', 'Facturation établissement'],
    featuresEn: ['Unlimited colorings', 'High resolution', 'PDF + print', '5 teacher accounts', 'Dedicated support', 'Institutional billing'],
  },
}

export const createCheckoutSession = async (planId, userId) => {
  const plan = PLANS[planId]
  if (!plan || !plan.stripe_price_id) return

  try {
    // Calls a Supabase Edge Function to create the Stripe checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        price_id: plan.stripe_price_id,
        user_id: userId,
        success_url: `${window.location.origin}/success?plan=${planId}`,
        cancel_url: `${window.location.origin}/pricing`,
      },
    })

    if (error) throw error

    const stripe = await stripePromise
    const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
    if (stripeError) throw stripeError
  } catch (err) {
    console.error('Checkout error:', err)
    throw err
  }
}
