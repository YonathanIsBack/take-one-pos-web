import { useParams, useSearchParams } from 'react-router-dom'

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>Item Detail</h1>
      <p>Item ID: {id}</p>
    </div>
  )
}

export default ItemDetailPage
