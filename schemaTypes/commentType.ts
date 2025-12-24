import {defineField, defineType} from 'sanity'

export const commentType = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'content',
      title: 'Comment',
      type: 'text',
      validation: (rule) => rule.required().min(1).max(2000),
    }),
    defineField({
      name: 'post',
      title: 'Article',
      type: 'reference',
      to: [{type: 'post'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'parentComment',
      title: 'Parent Comment',
      type: 'reference',
      to: [{type: 'comment'}],
      description: 'If this is a reply to another comment, select the parent comment',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Comments must be approved before they appear on the site',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      author: 'author',
      content: 'content',
      post: 'post.title',
      approved: 'approved',
    },
    prepare({author, content, post, approved}) {
      const preview = content ? content.substring(0, 50) : 'No content'
      const status = approved ? '✓' : '⏳'
      return {
        title: `${status} ${author || 'Anonymous'}`,
        subtitle: `${post || 'No article'} - ${preview}...`,
      }
    },
  },
  orderings: [
    {
      title: 'Created At, Newest',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Created At, Oldest',
      name: 'createdAtAsc',
      by: [{field: 'createdAt', direction: 'asc'}],
    },
  ],
})

