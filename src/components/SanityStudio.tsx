'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../sanity.config'
import '../styles/sanity-studio.css'

export function SanityStudio() {
  return <NextStudio config={config} />
}
