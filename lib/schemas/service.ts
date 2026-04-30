import { defineField, defineType } from 'sanity'
import React from 'react'
import type { StringInputProps } from 'sanity'

function ImageUrlInput(props: StringInputProps) {
  const { value, renderDefault } = props
  return React.createElement(
    'div',
    null,
    value
      ? React.createElement('img', { src: value, alt: 'Preview', style: { display: 'block', width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 4, marginBottom: 8 } })
      : null,
    renderDefault(props)
  )
}

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'order', title: 'Volgorde', type: 'number' }),
    defineField({ name: 'number', title: 'Nummer', type: 'string', description: 'Bijv. "[ 1 ]"' }),
    defineField({ name: 'name', title: 'Naam', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'description', title: 'Beschrijving', type: 'text' }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Afbeelding URL',
      type: 'url',
      components: { input: ImageUrlInput },
    }),
  ],
  orderings: [{ title: 'Volgorde', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'tagline' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title, subtitle }
    },
  },
})
