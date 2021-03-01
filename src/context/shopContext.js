import { useState, useEffect, createContext } from 'react'
import Client from 'shopify-buy'

export const ShopContext = createContext()

// Initializing a client to return content in the store's primary language
const client = Client.buildClient({
  domain: process.env.REACT_APP_SHOPIFY_DOMAIN,
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_API,
});

const ShopProvider = ({children}) => {
  const [state, setState] = useState({
    product: {},
    products: [],
    checkout: {},
    isCartOpen: false,
    isMenuOpen: false
  })

  const createCheckout = async () => {
    // Create an empty checkout
    const checkout = await client.checkout.create()
    console.log('checkout: ', checkout)

    localStorage.setItem('checkoutId', checkout.id)
    setState((preState) => ({...preState, checkout}))
  }

  const fetchCheckout = async (checkoutId) => {
    const checkout = await client.checkout.fetch(checkoutId)
    setState((preState) => ({...preState, checkout}))
  }

  useEffect(() => {
    const checkoutId = localStorage.getItem('checkoutId')
    if (checkoutId) {
      fetchCheckout(checkoutId)
    } else {
      createCheckout()
    }
  }, [])

  const addItemToCheckout = async () => {

  }

  const removeLineItem = async (lineItemIdsToRemove) => {

  }

  // fetch all products in the shop
  const fetchAllProducts = async () => {
    const products = await client.product.fetchAll()
    setState((preState) => ({...preState, products}))
  }


  // handle is the name of product compatable with link
  const fetchProductWithHandle = async (handle) => {
    const product = await client.product.fetchByHandle(handle)
    setState((preState) => ({...preState, product}))
  }

  const closeCart = () => {

  }

  const openCart = () => {
    
  }

  
  const closeMenu = () => {

  }

  const openMenu = () => {
    
  }

  return (
    <ShopContext.Provider value={{
      ...state,
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

// shopify-buy
// It's based on Shopify's Storefront API 
// and provides the ability to retrieve products and collections 
//from your shop, 
// add products to a cart, and checkout.

// https://www.npmjs.com/package/shopify-buy#initializing-the-client