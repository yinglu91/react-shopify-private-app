import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/shopContext'

const Home = () => {
  const { products, fetchAllProducts } = useContext(ShopContext)
 
  useEffect(() => {
    fetchAllProducts()
  }, [fetchAllProducts])
 
  if (!products) return <div>Loadings...</div>
  return (
    <div>
      {
        products.map(product => (
          <h1 key={product.title}>{product.title}</h1>
        ))
      }
    </div>
  )
}

export default Home
