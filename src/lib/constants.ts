export const POPULAR_TEAMS = [
  { country: 'México', emoji: '🇲🇽', handle: 'playera-fan-mexico-2026', confederation: 'CONCACAF' },
  { country: 'Argentina', emoji: '🇦🇷', handle: 'playera-fan-argentina-2026', confederation: 'CONMEBOL' },
  { country: 'Brasil', emoji: '🇧🇷', handle: 'playera-fan-brasil-2026', confederation: 'CONMEBOL' },
  { country: 'España', emoji: '🇪🇸', handle: 'playera-fan-espana-2026', confederation: 'UEFA' },
  { country: 'Francia', emoji: '🇫🇷', handle: 'playera-fan-francia-2026', confederation: 'UEFA' },
  { country: 'Alemania', emoji: '🇩🇪', handle: 'playera-fan-alemania-2026', confederation: 'UEFA' },
] as const

export const CONFEDERATION_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'CONCACAF', label: 'CONCACAF' },
  { value: 'CONMEBOL', label: 'CONMEBOL' },
  { value: 'UEFA', label: 'UEFA' },
  { value: 'CAF', label: 'CAF' },
  { value: 'AFC', label: 'AFC' },
] as const

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const

export const VERSIONS = ['Local', 'Visitante'] as const

export const CART_COOKIE = 'shopify_cart_id'
