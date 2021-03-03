import { useState, useEffect, createContext } from 'react'
import Client from 'shopify-buy'

export const ShopContext = createContext()

// Initializing a client to return content in the store's primary language
const client = Client.buildClient({
  domain: process.env.REACT_APP_SHOPIFY_DOMAIN,
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_API,
});

const ShopProvider = ({ children }) => {
  const [product, setProduct] = useState({})
  const [products, setProducts] = useState([])
  const [checkout, setCheckout] = useState({})

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const createCheckout = async () => {
    // Create an empty checkout
    const checkout = await client.checkout.create()
    console.log('checkout: ', checkout)

    localStorage.setItem('checkoutId', checkout.id)
    setCheckout(checkout)
  }

  const fetchCheckout = async (checkoutId) => {
    const checkout = await client.checkout.fetch(checkoutId)
    setCheckout(checkout)
  }

  useEffect(() => {
    const checkoutId = localStorage.getItem('checkoutId')
    if (checkoutId) {
      fetchCheckout(checkoutId)
    } else {
      createCheckout()
    }
  }, [])

  const addItemToCheckout = async (variantId, quantity) => {
    const lineItemsToAdd = [
      {
        variantId,
        quantity: parseInt(quantity, 10)
      }
    ];

    const checkout = await client.checkout.addLineItems(checkout.id, lineItemsToAdd)
    setCheckout(checkout)
  }

  const removeLineItem = async (lineItemIdsToRemove) => {
    const checkout = await client.checkout.removeLineItems(checkout.id, lineItemIdsToRemove)
    setCheckout(checkout)
  }

  // fetch all products in the shop
  const fetchAllProducts = async () => {
    const products = await client.product.fetchAll()
    setProducts(products)
  }


  // handle is the name of product compatable with link
  const fetchProductWithHandle = async (handle) => {
    const product = await client.product.fetchByHandle(handle)
    setProduct(product)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const openCart = () => {
    setIsCartOpen(true)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const openMenu = () => {
    setIsMenuOpen(true)
  }

  return (
    <ShopContext.Provider value={{
      product,
      products,
      checkout,
      isCartOpen,
      isMenuOpen,
    
      fetchAllProducts,
      fetchProductWithHandle,
      addItemToCheckout,
      removeLineItem,
      closeCart,
      openCart,
      closeMenu,
      openMenu,
    }}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopProvider

// https://www.npmjs.com/package/shopify-buy#initializing-the-client

// package: shopify-buy
// It's based on Shopify's Storefront API 
// and provides the ability to retrieve products and collections 
// from your shop, add products to a cart, and checkout.

