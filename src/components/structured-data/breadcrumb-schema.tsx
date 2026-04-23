/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Using dangerouslySetInnerHTML is acceptable for embedding JSON-LD structured data */
type BreadcrumbItem = {
  name: string
  url: string
}

type Props = {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://mundialshop.com${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
