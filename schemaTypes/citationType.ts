import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const citationType = defineType({
  name: 'citation',
  title: 'Citation',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'citationId',
      title: 'Citation ID',
      type: 'string',
      description: 'Unique identifier (e.g., "silva2020" or "1")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of author names (e.g., "Silva, J.", "Santos, M.")',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'year',
      title: 'Publication Year',
      type: 'number',
      description: 'Year of publication',
      validation: (rule) => rule.required().min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the article or book',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Journal name, publisher, or book series',
    }),
    defineField({
      name: 'volume',
      title: 'Volume',
      type: 'string',
      description: 'Volume number (if applicable)',
    }),
    defineField({
      name: 'issue',
      title: 'Issue',
      type: 'string',
      description: 'Issue number (if applicable)',
    }),
    defineField({
      name: 'pages',
      title: 'Pages',
      type: 'string',
      description: 'Page range (e.g., "123-145")',
    }),
    defineField({
      name: 'doi',
      title: 'DOI',
      type: 'string',
      description: 'Digital Object Identifier',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Link to the publication (if available)',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Additional context or notes about this citation',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      authors: 'authors',
      year: 'year',
      citationId: 'citationId',
    },
    prepare({title, authors, year, citationId}) {
      const authorList = authors && authors.length > 0 ? authors[0] : 'Unknown Author'
      const subtitle = `${authorList} (${year}) - ID: ${citationId}`
      return {
        title,
        subtitle,
      }
    },
  },
})
