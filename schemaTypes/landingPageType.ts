import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const landingPageType = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author / Subtitle',
      type: 'string',
      description: 'Shown under the title (e.g. author name)',
    }),
    defineField({
      name: 'preamble',
      title: 'Intro text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [],
          },
        },
      ],
      description: 'The paragraphs shown below the title on the home page',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      description: 'Text on the “start reading” button',
      initialValue: 'Começar a ler o Capítulo 1',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author',
    },
  },
})
