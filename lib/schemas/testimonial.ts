import { defineField, defineType } from 'sanity'
import React from 'react'
import type { StringInputProps } from 'sanity'

function ImageUrlInput(props: StringInputProps) {
  const { value, renderDefault } = props
  return React.createElement(
    'div',
    null,
    value
      ? React.createElement('img', { src: value, alt: 'Preview', style: { display: 'block', width: '100%', maxHeight: 120, objectFit: 'contain', marginBottom: 8 } })
      : null,
    renderDefault(props)
  )
}

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'order', title: 'Volgorde', type: 'number' }),
    defineField({ name: 'author', title: 'Naam', type: 'string' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text' }),
    defineField({
      name: 'logoUrl',
      title: 'Logo URL',
      type: 'url',
      components: { input: ImageUrlInput },
    }),
    defineField({ name: 'logoWidth', title: 'Logo breedte (px)', type: 'number' }),
    defineField({ name: 'logoHeight', title: 'Logo hoogte (px)', type: 'number' }),
  ],
  orderings: [{ title: 'Volgorde', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'author', subtitle: 'quote' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title, subtitle: subtitle?.slice(0, 60) + '…' }
    },
  },
})
