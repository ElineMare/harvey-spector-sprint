'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { project } from './lib/schemas/project'

export default defineConfig({
  name: 'default',
  title: 'Harvey Specter',
  projectId: 'v1c8g0jp',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: [project],
  },
})
