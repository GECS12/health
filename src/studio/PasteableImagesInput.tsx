'use client'

import React, {useCallback, useState} from 'react'
import {Card, Flex, Stack, Text, Spinner} from '@sanity/ui'
import {ImageIcon} from '@sanity/icons'
import {insert, setIfMissing, useClient, type ArrayOfObjectsInputProps} from 'sanity'

function randomKey(length = 12) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''
  for (let i = 0; i < length; i++) {
    key += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return key
}

function getImageFiles(dataTransfer: DataTransfer | null): File[] {
  if (!dataTransfer) return []

  const fromFiles = Array.from(dataTransfer.files || []).filter((file) =>
    file.type.startsWith('image/')
  )
  if (fromFiles.length) return fromFiles

  const fromItems: File[] = []
  for (const item of Array.from(dataTransfer.items || [])) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) fromItems.push(file)
    }
  }
  return fromItems
}

/**
 * Landing-page images array with a reliable paste/drop zone.
 * Avoids Sanity's image-modal paste bug (paste fails until open/cancel).
 */
export function PasteableImagesInput(props: ArrayOfObjectsInputProps) {
  const {onChange, readOnly, renderDefault} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files.length || readOnly) return

      setUploading(true)
      setStatus(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}…`)

      try {
        const imageBlocks = []
        for (const [index, file] of files.entries()) {
          setStatus(`Uploading ${index + 1} of ${files.length}…`)
          const asset = await client.assets.upload('image', file, {
            filename: file.name || `pasted-image-${Date.now()}.png`,
          })
          imageBlocks.push({
            _type: 'image',
            _key: randomKey(),
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          })
        }

        onChange([setIfMissing([]), insert(imageBlocks, 'after', [-1])])
        setStatus(`Added ${files.length} image${files.length > 1 ? 's' : ''}`)
        setTimeout(() => setStatus(null), 2000)
      } catch (error) {
        console.error(error)
        setStatus('Upload failed — try again')
        setTimeout(() => setStatus(null), 3000)
      } finally {
        setUploading(false)
      }
    },
    [client, onChange, readOnly]
  )

  const handlePaste = useCallback(
    (event: React.ClipboardEvent) => {
      const files = getImageFiles(event.clipboardData)
      if (!files.length) return
      event.preventDefault()
      event.stopPropagation()
      void uploadFiles(files)
    },
    [uploadFiles]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)
      const files = getImageFiles(event.dataTransfer)
      void uploadFiles(files)
    },
    [uploadFiles]
  )

  return (
    <Stack space={3}>
      <Card
        padding={4}
        radius={2}
        shadow={1}
        tone={isDragging ? 'primary' : 'transparent'}
        border
        style={{
          borderStyle: 'dashed',
          outline: 'none',
          cursor: readOnly ? 'default' : 'copy',
        }}
        tabIndex={readOnly ? undefined : 0}
        onPaste={handlePaste}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Flex align="center" justify="center" gap={3} direction="column">
          {uploading ? (
            <Spinner muted />
          ) : (
            <Text size={3}>
              <ImageIcon />
            </Text>
          )}
          <Text size={1} muted align="center">
            {status ||
              'Click here, then paste (Ctrl+V / Cmd+V) or drop images'}
          </Text>
        </Flex>
      </Card>

      {renderDefault(props)}
    </Stack>
  )
}
