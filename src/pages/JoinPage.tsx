import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { useParams } from 'react-router'
import { apiUrl, publicApi, type JoinResult, type PublicProgram } from '../api/client'

type Load = { state: 'loading' } | { state: 'error'; message: string } | { state: 'ready'; data: PublicProgram }

/** Página que abre el cliente al escanear el QR del mostrador. */
export function JoinPage() {
  const { slug = '' } = useParams()
  const [load, setLoad] = useState<Load>({ state: 'loading' })
  const [result, setResult] = useState<JoinResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    publicApi
      .getProgram(slug)
      .then((data) => alive && setLoad({ state: 'ready', data }))
      .catch((e: Error) => alive && setLoad({ state: 'error', message: e.message }))
    return () => {
      alive = false
    }
  }, [slug])

  if (load.state === 'loading') return <Shell>Cargando…</Shell>
  if (load.state === 'error') return <Shell>No encontramos este negocio.</Shell>

  const { business, program, consentText } = load.data
  const theme = {
    '--brand': business.colors?.background ?? '#c2185b',
    '--brand-text': business.colors?.foreground ?? '#ffffff',
  } as CSSProperties

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setSubmitting(true)
    setError(null)
    try {
      const res = await publicApi.join(slug, {
        name: String(form.get('name')).trim(),
        phone: String(form.get('phone')).replace(/[\s-]/g, ''),
        email: String(form.get('email') ?? '').trim() || undefined,
        birthDate: String(form.get('birthDate') ?? '') || undefined,
        consent: form.get('consent') === 'on',
      })
      setResult(res)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Shell style={theme}>
      <header className="hero">
        {business.logoUrl && <img src={business.logoUrl} alt="" className="logo" />}
        <h1>{business.name}</h1>
        <p>
          Junta {program.stampsRequired} sellos y llévate {program.rewardText.toLowerCase()}.
        </p>
      </header>

      {result ? (
        <section className="panel">
          <h2>¡Listo! Ya eres parte del club</h2>
          <p className="muted">Agrega tu tarjeta al celular para no perderla:</p>
          <a className="wallet apple" href={apiUrl(result.appleWalletUrl)}>
            Agregar a Apple Wallet
          </a>
          <a className="wallet google" href={apiUrl(result.googleWalletUrl)}>
            Agregar a Google Wallet
          </a>
          <p className="muted small">Tu código: {result.serialNumber}</p>
        </section>
      ) : (
        <form className="panel" onSubmit={onSubmit}>
          <label>
            Nombre
            <input name="name" required minLength={2} maxLength={80} autoComplete="name" />
          </label>
          <label>
            Celular
            <input name="phone" required inputMode="tel" autoComplete="tel" placeholder="0991234567" />
          </label>
          <label>
            <span>
              Correo <span className="muted">(opcional)</span>
            </span>
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label>
            <span>
              Cumpleaños <span className="muted">(opcional, para un regalo)</span>
            </span>
            <input name="birthDate" type="date" />
          </label>
          <label className="consent">
            <input name="consent" type="checkbox" required />
            <span>{consentText}</span>
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creando tu tarjeta…' : 'Obtener mi tarjeta'}
          </button>
        </form>
      )}
    </Shell>
  )
}

function Shell({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <main className="page" style={style}>
      {children}
      <footer className="footer">Tarjeta digital por Fidelify</footer>
    </main>
  )
}
