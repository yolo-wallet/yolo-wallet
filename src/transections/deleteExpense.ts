import client from '@/service/sanity'

export async function deleteExepnseByIdTransaction(id: string) {
  try {
    await client.delete(id)
    return {
      message: 'Expense deleted successfully',
      code: 0
    }
  } catch (error) {
    console.error(error)
    return {
      message: 'Expense delete failed',
      code: 22
    }
  }
}
