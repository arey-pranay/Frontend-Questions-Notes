interface Product {
  id: number;
  category: string;
  name: string;
}

function groupProductsByCategory(
  products: Product[]
): Record<string, Product[]> {
  const map: Record<string, Product[]> = {};
  for (const product of products) {
    const key = product.category;
    if (!map[key]) map[key] = [];
    map[key].push(product)

  }
  console.log(map)
  return map;
}
