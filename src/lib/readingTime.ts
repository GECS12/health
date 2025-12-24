/**
 * Calculate reading time for Portuguese content
 * Average reading speed: 200-250 words per minute for Portuguese
 * We use 220 words/min as a reasonable average
 */

export function calculateReadingTime(body: any): number {
  if (!body || !Array.isArray(body)) return 0;

  // Extract plain text from Portable Text blocks
  const extractText = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }
    
    if (Array.isArray(content)) {
      return content.map(extractText).join(' ').trim();
    }
    
    if (content && typeof content === 'object') {
      // Handle Portable Text block structure
      if (content.children && Array.isArray(content.children)) {
        return extractText(content.children);
      }
      
      // Handle text nodes in Portable Text
      if (content.text && typeof content.text === 'string') {
        return content.text;
      }
      
      // Handle marks/annotations that might have children
      if (content.children) {
        return extractText(content.children);
      }
    }
    
    return '';
  };

  // Process all blocks in the body
  let plainText = '';
  
  for (const block of body) {
    if (block._type === 'block' && block.children) {
      plainText += ' ' + extractText(block.children);
    } else if (block._type === 'block' && block.text) {
      plainText += ' ' + block.text;
    }
  }
  
  // Count words (split by whitespace and filter empty strings)
  const words = plainText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  const wordCount = words.length;
  
  // Calculate reading time (220 words per minute for Portuguese)
  const wordsPerMinute = 220;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  // Minimum 1 minute
  return Math.max(1, readingTime);
}

/**
 * Format reading time in Portuguese
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 minuto de leitura';
  }
  return `${minutes} minutos de leitura`;
}

