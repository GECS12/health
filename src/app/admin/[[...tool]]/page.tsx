import { SanityStudio } from '../../../components/SanityStudio';

export function generateStaticParams() {
  return [{ tool: [] }] 
}

export default function StudioPage() {
  return <SanityStudio />;
}
