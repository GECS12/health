import {defineField, defineType} from 'sanity'
import {DropIcon} from '@sanity/icons'
import React from 'react'
import {DocxImporter} from '../src/studio/DocxImporter'

const CenteredStyle = (props: any) => (
  <div style={{
    textAlign: 'center',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  }}>{props.children}</div>
)
const RightStyle = (props: any) => (
  <div style={{
    textAlign: 'right',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  }}>{props.children}</div>
)
const JustifyStyle = (props: any) => (
  <div style={{
    textAlign: 'justify',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  }}>{props.children}</div>
)

// Text Color Decorator
const ColorDecorator = (color: string) => (props: any) => (
  <span style={{color}}>{props.children}</span>
)

// Explicit Icon Components to prevent rendering issues and improve clarity
const RedIcon = () => <span style={{fontWeight: 'bold', color: '#ef4444'}}>R</span>
const BlueIcon = () => <span style={{fontWeight: 'bold', color: '#3b82f6'}}>B</span>
const GreenIcon = () => <span style={{fontWeight: 'bold', color: '#22c55e'}}>G</span>
const YellowIcon = () => <span style={{fontWeight: 'bold', color: '#eab308'}}>Y</span>
const PurpleIcon = () => <span style={{fontWeight: 'bold', color: '#a855f7'}}>P</span>
const BlackIcon = () => <span style={{fontWeight: 'bold', color: '#000000'}}>B</span>
const GrayIcon = () => <span style={{fontWeight: 'bold', color: '#6b7280'}}>G</span>

// Superscript decorator for reference numbers
const SuperscriptIcon = () => <span style={{fontSize: '10px', verticalAlign: 'super'}}>x²</span>
const SuperscriptDecorator = (props: any) => (
  <sup style={{fontSize: '0.75em', verticalAlign: 'super', color: '#3b82f6'}}>{props.children}</sup>
)

export const postType = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'docxImport',
      title: 'Import from Word',
      type: 'string',
      components: {
        input: DocxImporter
      },
      description: 'Upload a .docx file to populate the Body field automatically. Warning: This will overwrite existing content.'
    }),
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
      name: 'section',
      title: 'Section / Chapter',
      type: 'reference',
      to: [{type: 'section'}],
      description: 'Which chapter does this article belong to?',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      description: 'Order within the chapter',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
              // Color Decorators
              {title: 'Red', value: 'color-red', icon: RedIcon, component: ColorDecorator('#ef4444')},
              {title: 'Blue', value: 'color-blue', icon: BlueIcon, component: ColorDecorator('#3b82f6')},
              {title: 'Green', value: 'color-green', icon: GreenIcon, component: ColorDecorator('#22c55e')},
              {title: 'Yellow', value: 'color-yellow', icon: YellowIcon, component: ColorDecorator('#eab308')},
              {title: 'Purple', value: 'color-purple', icon: PurpleIcon, component: ColorDecorator('#a855f7')},
              {title: 'Black', value: 'color-black', icon: BlackIcon, component: ColorDecorator('#000000')},
              {title: 'Gray', value: 'color-gray', icon: GrayIcon, component: ColorDecorator('#6b7280')},
              {title: 'Custom Color', value: 'textColor', icon: RedIcon},
              {title: 'Superscript (ref)', value: 'sup', icon: SuperscriptIcon, component: SuperscriptDecorator},
            ],
            annotations: [
              {
                name: 'referenceLink',
                type: 'object',
                title: 'Reference Link',
                icon: SuperscriptIcon,
                fields: [
                  {
                    name: 'refNumber',
                    type: 'number',
                    title: 'Reference Number',
                    description: 'e.g., 2 to link to reference #2',
                    validation: (rule: any) => rule.required().min(1),
                  }
                ]
              }
            ],
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
            }
          ]
        },
        {
          type: 'object',
          name: 'video',
          title: 'Video',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Video URL',
              description: 'Paste a YouTube or Vimeo video URL',
              validation: (rule) => rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (optional)',
            }
          ],
          preview: {
            select: {
              url: 'url',
              caption: 'caption'
            },
            prepare({ url, caption }) {
              return {
                title: caption || 'Video',
                subtitle: url,
              }
            }
          }
        },
      ],
    }),
  ],
})
