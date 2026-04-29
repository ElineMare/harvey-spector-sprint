import { defineField, defineType } from 'sanity'
import React from 'react'
import type { StringInputProps } from 'sanity'

function ImageUrlInput(props: StringInputProps) {
  const { value, renderDefault } = props
  return React.createElement(
    'div',
    null,
    value
      ? React.createElement('img', {
          src: value,
          alt: 'Preview',
          style: {
            display: 'block',
            width: '100%',
            maxHeight: 220,
            objectFit: 'cover',
            borderRadius: 4,
            marginBottom: 8,
          },
        })
      : null,
    renderDefault(props)
  )
}

function ImageMedia({ imageUrl }: { imageUrl: string }) {
  return React.createElement('img', {
    src: imageUrl,
    style: { width: '100%', height: '100%', objectFit: 'cover' },
  })
}

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Volgorde',
      type: 'number',
    }),
    defineField({
      name: 'number',
      title: 'Nummer',
      type: 'string',
      description: 'Weergavenummer, bijv. "01"',
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Afbeelding URL',
      type: 'url',
      components: {
        input: ImageUrlInput,
      },
    }),
  ],
  orderings: [
    {
      title: 'Volgorde',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', imageUrl: 'imageUrl' },
    prepare({ title, subtitle, imageUrl }: { title?: string; subtitle?: string; imageUrl?: string }) {
      return {
        title,
        subtitle,
        media: imageUrl ? () => React.createElement(ImageMedia, { imageUrl }) : undefined,
      }
    },
  },
})
