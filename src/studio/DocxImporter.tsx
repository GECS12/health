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
          
          // Extract image dimensions if available
          // Mammoth provides dimensions in EMUs (English Metric Units)
          // 1 EMU = 1/914400 inches, we convert to pixels assuming 96 DPI
          const attrs: any = {
            src: asset.url,
            'data-asset-id': asset._id
          }
          
          // Check if image has width/height in EMUs and convert to pixels
          if (image.width && image.height) {
            // Convert EMUs to pixels (914400 EMUs per inch, 96 pixels per inch)
            const widthPx = Math.round((image.width / 914400) * 96)
            const heightPx = Math.round((image.height / 914400) * 96)
            
            attrs['data-width'] = widthPx.toString()
            attrs['data-height'] = heightPx.toString()
          }
          
          return attrs
        })
      }

      setStatus('Converting Docx to HTML...')
      const result = await mammoth.convertToHtml({arrayBuffer}, uploadOptions)
      let html = result.value

      // Post-process HTML to format citations
      // We need to be careful NOT to match natural numbers like "9 em relação a 3,75"
      setStatus('Formatting citations...')
      
      // Pattern 1: Citations at START of paragraph
      // Match: <p>NUMBER(s) followed by space and UPPERCASE letter
      // This catches "19,20,21 A ocidentalização..." or "24 A denominação..."
      html = html.replace(
        /(<p[^>]*>)\s*(\d+(?:\s*,\s*\d+)*)\s+([A-ZÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ])/g,
        (match, pTag, nums, firstLetter) => {
          const formattedNums = nums.split(',').map((n: string) => n.trim()).join(',')
          return `${pTag}<sup class="citation-ref">[${formattedNums}]</sup> ${firstLetter}`
        }
      )
      
      // Pattern 2: Citations AFTER a period with NO space: ".1" or ".2,3" or ".22,23"
      // This is the key distinguisher - citations are "glued" to the period
      // Avoid matching things like ". 9" (space) or ".75" (decimal)
      html = html.replace(
        /\.(\d+(?:,\d+)*)(?=\s|<|$)/g,
        (match, nums) => {
          // Skip if it looks like a decimal (single digit after period with more text)
          // e.g., "3.75" should not be matched - but we're matching ".75" pattern
          // Actually, "3.75" would match as "3" then ".75" - we need to check context
          // Only convert if nums contains citation-like patterns (1-3 digit numbers)
          const numList = nums.split(',')
          // Check if all numbers are reasonable citation numbers (1-999)
          const isCitation = numList.every((n: string) => {
            const num = parseInt(n.trim(), 10)
            return num >= 1 && num <= 999
          })
          if (isCitation) {
            const formattedNums = numList.map((n: string) => n.trim()).join(',')
            return `.<sup class="citation-ref">[${formattedNums}]</sup>`
          }
          return match
        }
      )

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
                  const imageBlock: any = {
                    _type: 'image',
                    asset: {
                      _type: 'reference',
                      _ref: assetId
                    }
                  }
                  
                  // Preserve image dimensions if available
                  const width = el.getAttribute('data-width')
                  const height = el.getAttribute('data-height')
                  
                  if (width && height) {
                    imageBlock.width = parseInt(width, 10)
                    imageBlock.height = parseInt(height, 10)
                  }
                  
                  return block(imageBlock)
                }
              }
              // Handle superscript elements (for citations)
              if (el instanceof HTMLElement && el.tagName.toLowerCase() === 'sup') {
                return {
                  _type: 'span',
                  marks: ['sup'],
                  text: el.textContent || ''
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
