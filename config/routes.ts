export const ROUTES = {
  AUTH: {
    HOME: '/Auth/home' as const,
    SEARCH: '/Auth/search' as const,
    LIST: '/Auth/list' as const,
    NOTIFICATIONS: '/Auth/notifications' as const,
    PROFILE: '/Auth/PerfilUsuario' as const,
    METPAGO: '/Auth/metPago' as const,
    TRIPS: '/Auth/Trips' as const,
    MODULO_RUTAS: '/Auth/modulo-rutas' as const,
  },
  PUBLIC: {
    LOGIN: '/Public/login' as const,
    SIGNUP: '/Public/signup' as const,
  },
  ERRORS: {
    NOT_FOUND: '/+not-found' as const,
  }
} as const;

export type AppRoute = typeof ROUTES.AUTH[keyof typeof ROUTES.AUTH] | 
                      typeof ROUTES.PUBLIC[keyof typeof ROUTES.PUBLIC] |
                      typeof ROUTES.ERRORS[keyof typeof ROUTES.ERRORS]; 