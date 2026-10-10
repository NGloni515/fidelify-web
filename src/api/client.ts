const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message
    throw new Error(message ?? 'No pudimos completar la solicitud')
  }
  return body as T
}

export interface PublicProgram {
  business: {
    name: string
    slug: string
    logoUrl: string | null
    colors: { background?: string; foreground?: string; label?: string } | null
  }
  program: { name: string; stampsRequired: number; rewardText: string }
  consentText: string
}

export interface JoinInput {
  name: string
  phone: string
  email?: string
  birthDate?: string
  consent: boolean
}

export interface JoinResult {
  serialNumber: string
  balance: number
  stampsRequired: number
  appleWalletUrl: string
  googleWalletUrl: string
}

export const publicApi = {
  getProgram: (slug: string) => api<PublicProgram>(`/public/businesses/${encodeURIComponent(slug)}`),
  join: (slug: string, input: JoinInput) =>
    api<JoinResult>(`/public/businesses/${encodeURIComponent(slug)}/join`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
}

/** Los links de Wallet vienen como rutas relativas de la API. */
export function apiUrl(path: string) {
  return `${BASE_URL}${path}`
}
