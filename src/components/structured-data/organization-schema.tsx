/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Using dangerouslySetInnerHTML is acceptable for embedding JSON-LD structured data */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mundial Shop',
    url: 'https://mundialshop.com',
    logo: 'https://mundialshop.com/logo.png',
    description: '48 selecciones del Mundial 2026. Envío express a México.',
    sameAs: [
      'https://instagram.com/mundialshop',
      'https://facebook.com/mundialshop',
      'https://twitter.com/mundialshop',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contacto@mundialshop.com',
      availableLanguage: ['Spanish', 'English'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
