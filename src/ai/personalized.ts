import { getRecommendations } from "./recommendation"

export function 
getPersonalizedFeed(products: any[], history: string[]) {
  let result: any[] = []

  history.forEach((item) => {
    const recs = getRecommendations(products, item)
    result = [...result, ...recs]
  })

  const unique = result.filter(
    (item, index, self) =>
      index === self.findIndex((p) => p.name === item.name)
  )

  return unique.slice(0, 6)
}