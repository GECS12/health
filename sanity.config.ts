import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Health Nutrition',

  projectId: 'd8l1kuhs', // Keeping original ID
  dataset: 'production',
  
  basePath: '/admin', // Matches the directory name in src/app

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content Hierarchy')
          .items([
            // 1. Chapters (Sections)
            S.listItem()
              .title('Chapters & Articles')
              .child(
                S.documentTypeList('section')
                  .title('Top-level Chapters')
                  .filter('_type == "section" && !defined(parent)')
                  .defaultOrdering([{field: 'order', direction: 'asc'}])
                  .child(sectionId =>
                  S.documentList()
                      .title('Articles & Sub-chapters')
                      .filter('(_type == "post" && section._ref == $sectionId) || (_type == "section" && parent._ref == $sectionId)')
                      .params({ sectionId })
                      .defaultOrdering([{field: 'order', direction: 'asc'}])
                      .menuItems(S.documentTypeList('post').getMenuItems()) // Inherit default menu items or define custom ones
                  )
              ),
            S.divider(),
            
            // 2. All Articles (Flat list)
            S.listItem()
              .title('All Articles')
              .child(
                S.documentTypeList('post')
                  .title('All Articles')
                  .defaultOrdering([{field: 'title', direction: 'asc'}])
              ),

             // 3. Unassigned Articles
             S.listItem()
              .title('Unassigned Articles')
              .child(
                S.documentTypeList('post')
                  .title('Unassigned Articles')
                  .filter('_type == "post" && !defined(section)')
              ),

            S.divider(),
            
            // 4. All Sections (Flat list for management)
            S.listItem()
              .title('All Sections')
              .child(
                S.documentTypeList('section')
                  .title('All Sections')
                  .defaultOrdering([{field: 'order', direction: 'asc'}])
              ),

            // Filter out types we've already handled
            ...S.documentTypeListItems().filter(
              (listItem) => !['post', 'section'].includes(listItem.getId() || '')
            ),
          ])
    }),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft',
          disable: '/api/disable-draft',
        },
      },
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
