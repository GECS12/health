import {defineField, defineType} from 'sanity'

export const sectionType = defineType({
  name: 'section',
  title: 'Section (Chapter)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      description: 'Used to order the chapters in the sidebar (1, 2, 3...)',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Section/Chapter',
      type: 'reference',
      to: [{type: 'section'}],
      description: 'Leave empty if this is a top-level chapter',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
    },
    prepare({title, order}) {
      return {
        title: `${order ? `${order}. ` : ''}${title}`,
        subtitle: 'Chapter / Section',
      }
    },
  },
})
