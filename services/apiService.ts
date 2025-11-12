import { User, AuthTokens, PrevalidateResponse, VerificationPurpose } from '../types';

const API_BASE_URL = 'https://is-2-back-end.onrender.com/api/auth';


interface StoredTokens {
    accessToken: string;
    refreshToken: string;
}

export const setTokens = (tokens: AuthTokens) => {
    if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
        console.error("Intento de guardar tokens inválidos:", tokens);
        return;
    }
    localStorage.setItem('authTokens', JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    }));
};

export const getTokens = (): StoredTokens | null => {
    const tokenStr = localStorage.getItem('authTokens');
    return tokenStr ? JSON.parse(tokenStr) : null;
};

export const clearTokens = () => {
    localStorage.removeItem('authTokens');
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const tokens = getTokens();
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (tokens?.accessToken) {
        headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: 'Ocurrió un error desconocido' };
        }
        throw new Error(errorData.message || 'La solicitud a la API falló');
    }
    
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
        return null;
    }
    
    return response.json();
};

const decodeJwt = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token JWT:', e);
    return null;
  }
}

const mapJwtClaimsToUser = (claims: any): User | null => {
    if (!claims) return null;
    // Mapeo de claims estándar (sub, given_name, family_name) con respaldo a nombres personalizados
    const user: User = {
        id: parseInt(claims.id || claims.sub, 10),
        email: claims.email,
        nombre: claims.nombre || claims.given_name,
        apellido: claims.apellido || claims.family_name,
    };

    if (!user.id || !user.email || !user.nombre) {
        console.error("El token JWT no contiene los claims de usuario necesarios (id/sub, email, nombre/given_name).", claims);
        return null;
    }
    return user;
}

const createSessionFromTokens = (tokens: AuthTokens): { tokens: AuthTokens, user: User } => {
    if (!tokens?.accessToken) {
        throw new Error("La respuesta de la API no incluyó un token de acceso.");
    }
    
    const claims = decodeJwt(tokens.accessToken);
    const user = mapJwtClaimsToUser(claims);

    if (!user) {
        throw new Error("No se pudo extraer la información del usuario desde el token de acceso.");
    }

    return { tokens, user };
};

export const register = (data: any) => apiFetch('/register', { method: 'POST', body: JSON.stringify(data) });

export const prevalidate = (email: string): Promise<PrevalidateResponse> => apiFetch('/prevalidate', { method: 'POST', body: JSON.stringify({ email }) });

export const verifyToken = (email: string, token: string, purpose: VerificationPurpose) => apiFetch('/verify-token', { method: 'POST', body: JSON.stringify({ email, token, purpose }) });

export const resendVerification = (email: string) => apiFetch('/resend-verification', { method: 'POST', body: JSON.stringify({ email }) });

export const refreshToken = async (refreshTokenValue: string): Promise<{tokens: AuthTokens, user: User}> => {
    const newTokens = await apiFetch('/refresh-token', { method: 'POST', body: JSON.stringify({ refreshToken: refreshTokenValue }) });
    return createSessionFromTokens(newTokens);
};

export const loginWithPassword = async (data: any): Promise<{tokens: AuthTokens, user: User}> => {
    const tokens = await apiFetch('/login', { method: 'POST', body: JSON.stringify(data) });
    return createSessionFromTokens(tokens);
};

export const requestOtpFor2FA = (data: any) => apiFetch('/login/password-request-otp', { method: 'POST', body: JSON.stringify(data) });

export const loginWithOtp = async (data: any): Promise<{tokens: AuthTokens, user: User}> => {
    const tokens = await apiFetch('/login/otp', { method: 'POST', body: JSON.stringify(data) });
    return createSessionFromTokens(tokens);
};

export const requestMagicLink = (email: string) => apiFetch('/login/magic-request', { method: 'POST', body: JSON.stringify({ email }) });

export const loginWithMagicLink = async (token: string): Promise<{tokens: AuthTokens, user: User}> => {
    const tokens = await apiFetch('/login/magic', { method: 'POST', body: JSON.stringify({ token }) });
    return createSessionFromTokens(tokens);
};

export const loginWithGoogle = (idToken: string): Promise<{tokens: AuthTokens, user: User}> => apiFetch('/oauth/google', { method: 'POST', body: JSON.stringify({ idToken }) });

export const requestPasswordReset = (email: string) => apiFetch('/request-reset', { method: 'POST', body: JSON.stringify({ email }) });

export const resetPassword = (data: any) => apiFetch('/reset', { method: 'POST', body: JSON.stringify(data) });

export const revokeToken = (refreshTokenValue: string) => apiFetch('/revoke-token', { method: 'POST', body: JSON.stringify({ refreshToken: refreshTokenValue }) });