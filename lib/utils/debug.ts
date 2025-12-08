export function logError(error: any, context: string) {
  console.error(`[${context}]`, error)
  
  if (error?.message) {
    console.error('Error message:', error.message)
  }
  
  if (error?.stack) {
    console.error('Error stack:', error.stack)
  }
  
  return {
    message: error?.message || 'Unknown error',
    code: error?.code,
    status: error?.status,
    context
  }
}