import { defineField, defineType } from 'sanity'
import React from 'react'
import type { StringInputProps } from 'sanity'

function ImageUrlInput(props: StringInputProps) {
  const { value, renderDefault } = props
  return React.createElement(
    'div',
    null,
    value
      ? React.createElement('img', { src: value, alt: 'Preview', style: { display: 'block', width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 4, marginBottom: 8 } })
      : null,
    renderDefault(props)
  )
}

export const newsItem = defineType({
  name: 'newsItem',
  title: 'Nieuwsbericht',
  type: 'document',
  fields: [
    defineField({ name: 'order', title: 'Volgorde', type: 'number' }),
    defineField({ name: 'text', title: 'Tekst', type: 'text' }),
    defineField({
      name: 'imageUrl',
      title: 'Afbeelding URL',
      type: 'url',
      components: { input: ImageUrlInput },
    }),
  ],
  orderings: [{ title: 'Volgorde', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'text', imageUrl: 'imageUrl' },
    prepare({ title }: { title?: string }) {
      return { title: title?.slice(0, 60) + '…' }
    },
  },
})
