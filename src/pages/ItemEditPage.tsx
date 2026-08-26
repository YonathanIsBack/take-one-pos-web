import { useParams, useSearchParams } from 'react-router-dom'

function ItemEditPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action')

  return (
    <div>
      <h1>Item Edit</h1>
      <p>Item ID: {id}</p>
      <p>Action: {action}</p>
    </div>
  )
}

export default ItemEditPage
