import React, {useCallback, useState} from 'react'
import {Button, Stack, Text, Card, Spinner} from '@sanity/ui'
import {useClient, useFormValue, useSchema} from 'sanity'
import mammoth from 'mammoth'
import {htmlToBlocks} from '@sanity/block-tools'
import {UploadIcon} from '@sanity/icons'

export function DocxImporter(props: any) {
  const [isImporting, setIsImporting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  
  const client = useClient({apiVersion: '2024-01-01'})
  const documentId = useFormValue(['_id']) as string
  const schema = useSchema()
  
  // Get the block type from the schema to know how to convert HTML
  const postType = schema.get('post') as any
  const bodyField = postType?.fields.find((f: any) => f.name === 'body')
  const blockContentType = bodyField?.type

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!documentId) {
      setStatus('Error: Save document first')
      return
    }

    setIsImporting(true)
    setStatus('Reading file...')

    try {
      const arrayBuffer = await file.arrayBuffer()
      
      const uploadOptions = {
        convertImage: mammoth.images.imgElement(async (image: any) => {
          const buffer = await image.read()
          setStatus(`Uploading image...`)
          
          const asset = await client.assets.upload('image', buffer, {
            filename: `imported-image-${Date.now()}.${image.contentType.split('/')[1]}`
          })
          
          return {
            src: asset.url,
            'data-asset-id': asset._id
          }
        })
      }

      setStatus('Converting Docx to HTML...')
      const result = await mammoth.convertToHtml({arrayBuffer}, uploadOptions)
      const html = result.value

      setStatus('Converting HTML to Portable Text...')
      
      if (!blockContentType) {
          throw new Error('Could not find body field block type in schema')
      }

      const blocks = htmlToBlocks(html, blockContentType, {
        parseHtml: (html) => new DOMParser().parseFromString(html, 'text/html'),
        rules: [
          {
            deserialize(el, next, block) {
              if (el instanceof HTMLElement && el.tagName.toLowerCase() === 'img') {
                const assetId = el.getAttribute('data-asset-id')
                if (assetId) {
                  return block({
                    _type: 'image',
                    asset: {
                      _type: 'reference',
                      _ref: assetId
                    }
                  })
                }
              }
              return undefined
            }
          }
        ]
      })

      setStatus('Updating document...')
      
      // Update both draft and published (if exists) or just the current ID
      // The most reliable way in Studio is to update the 'documentId' we currently have
      await client
        .patch(documentId)
        .set({body: blocks})
        .commit()
      
      // If we are on a draft, also make sure we don't have a mismatching published version
      // but usually the Studio handles this.
      
      setStatus('Import complete!')
      setTimeout(() => setStatus(null), 5000)
    } catch (error: any) {
      console.error('Import failed:', error)
      setStatus('Error: ' + error.message)
    } finally {
      setIsImporting(false)
      if (event.target) event.target.value = ''
    }
  }, [client, blockContentType, documentId])

  if (!documentId) {
    return (
      <Card padding={3} border style={{textAlign: 'center'}} radius={2}>
        <Text size={1} muted>Save the document to enable Word import.</Text>
      </Card>
    )
  }

  return (
    <Card padding={3} border style={{textAlign: 'center'}} radius={2} tone="transparent">
      <Stack space={3}>
        <Stack space={2}>
          <Text size={1} weight="semibold">Docx Content Importer</Text>
          <Text size={1} muted>This will extract text and images from a .docx file and replace the content of the Body field.</Text>
        </Stack>
        
        <Button
          icon={UploadIcon}
          text={isImporting ? 'Importing...' : 'Upload Word Doc (.docx)'}
          tone="primary"
          loading={isImporting}
          onClick={() => document.getElementById('docx-upload-input')?.click()}
        />
        
        <input
          id="docx-upload-input"
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          style={{display: 'none'}}
        />
        
        {status && (
          <Card padding={2} radius={2} tone={status.startsWith('Error') ? 'critical' : 'positive'}>
            <Stack space={2} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              {isImporting && <Spinner />}
              <Text size={1} weight="medium">
                {status}
              </Text>
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  )
}
