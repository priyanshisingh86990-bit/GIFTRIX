export function 
getRecommendations(products: any[], 
productName: string) {
  const currentProduct = products.find(
    (p) => p.name.toLowerCase() === productName.toLowerCase()
  )

  if (!currentProduct) return []

  return products
    .filter(
      (p) =>
        p.name !== currentProduct.name &&
        p.category === currentProduct.category
    )
    .slice(0, 3)
}