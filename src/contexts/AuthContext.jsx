import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CognitoAccessToken, CognitoIdToken, CognitoUserSession } from 'amazon-cognito-identity-js'

const STORAGE_KEY = 'cloud-portfolio-cognito-session'
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID
const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI || `${window.location.origin}/admin/callback`
const COGNITO_SIGN_OUT_URI = import.meta.env.VITE_COGNITO_SIGN_OUT_URI || window.location.origin
const COGNITO_SCOPE = 'openid profile email'
const COGNITO_RESPONSE_TYPE = 'token'

const AuthContext = createContext(null)

const parseJwtPayload = (token) => {
  try {
    const [, payload] = token.split('.')
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch (error) {
    console.error('Unable to parse JWT payload:', error)
    return null
  }
}

const getExpiresAt = (payload) => {
  if (!payload?.exp) return null
  return payload.exp * 1000
}

const buildSessionObject = ({ accessToken, idToken, expiresAt }) => {
  const idTokenPayload = parseJwtPayload(idToken)
  const cognitoUserSession = new CognitoUserSession({
    IdToken: new CognitoIdToken({ IdToken: idToken }),
    AccessToken: new CognitoAccessToken({ AccessToken: accessToken }),
  })

  return {
    accessToken,
    idToken,
    expiresAt,
    idTokenPayload,
    cognitoUserSession,
  }
}

const getStoredSession = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.accessToken || !parsed.idToken || !parsed.expiresAt) return null
    if (parsed.expiresAt <= Date.now()) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return buildSessionObject(parsed)
  } catch (error) {
    console.error('Failed to restore auth session:', error)
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const saveSession = (sessionData) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
}

const clearStoredSession = () => {
  sessionStorage.removeItem(STORAGE_KEY)
}

const buildCognitoAuthUrl = () => {
  if (!COGNITO_DOMAIN || !COGNITO_CLIENT_ID) {
    throw new Error('Cognito domain and client ID must be configured in VITE_COGNITO_DOMAIN and VITE_COGNITO_CLIENT_ID.')
  }

  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    response_type: COGNITO_RESPONSE_TYPE,
    scope: COGNITO_SCOPE,
    redirect_uri: COGNITO_REDIRECT_URI,
  })

  return `https://${COGNITO_DOMAIN}/oauth2/authorize?${params}`
}

export const AuthProvider = ({ children }) => {
  const [session, setRawSession] = useState(getStoredSession())
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (session) {
      saveSession({
        accessToken: session.accessToken,
        idToken: session.idToken,
        expiresAt: session.expiresAt,
      })
    }
  }, [session])

  const setSession = (tokens) => {
    try {
      const expiresIn = Number(tokens.expiresIn || tokens.expires_at || 3600)
      const expiresAt = Date.now() + expiresIn * 1000
      const nextSession = buildSessionObject({
        accessToken: tokens.accessToken,
        idToken: tokens.idToken,
        expiresAt,
      })
      setRawSession(nextSession)
      return nextSession
    } catch (error) {
      console.error('Failed to build Cognito session:', error)
      setAuthError('Unable to save authentication session. Please try again.')
      return null
    }
  }

  const signIn = () => {
    const authUrl = buildCognitoAuthUrl()
    window.location.assign(authUrl)
  }

  const signOut = () => {
    clearStoredSession()
    setRawSession(null)
    if (COGNITO_DOMAIN && COGNITO_CLIENT_ID) {
      const url = new URL(`https://${COGNITO_DOMAIN}/logout`)
      url.searchParams.set('client_id', COGNITO_CLIENT_ID)
      url.searchParams.set('logout_uri', COGNITO_SIGN_OUT_URI)
      window.location.assign(url.toString())
      return
    }
    window.location.assign('/')
  }

  const refreshSession = async () => {
    throw new Error(
      'Token refresh is not implemented in this client. Use Authorization Code Grant with PKCE or re-authenticate after token expiry.',
    )
  }

  const authContextValue = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session && session.expiresAt > Date.now()),
      user: session?.idTokenPayload || null,
      authError,
      signIn,
      signOut,
      setSession,
      refreshSession,
    }),
    [session, authError],
  )

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
