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
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      description:
        'Click an image slot, then paste (Ctrl+V / Cmd+V) from clipboard, or upload. Shown above the intro text.',
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
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
            {
              name: 'imageWidth',
              type: 'number',
              title: 'Image Width (%)',
              description: 'Width as a percentage of the content area.',
              validation: (rule) => rule.min(10).max(100),
              initialValue: 100,
              options: {
                range: {min: 10, max: 100, step: 5},
              },
            },
          ],
        },
      ],
      description:
        'Paragraphs and inline images. Tip: for easy paste, use the Images field above instead.',
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
