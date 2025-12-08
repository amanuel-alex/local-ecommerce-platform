import { createClient } from './server'
import { Product } from '@/types/product'

export async function getRecentProducts(limit: number = 8): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      sellers (business_name),
      categories (name)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent products:', error)
    return []
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: parseFloat(product.price),
    original_price: product.compare_price ? parseFloat(product.compare_price) : undefined,
    rating: parseFloat(product.rating) || 4.5,
    review_count: product.total_reviews || 0,
    image_url: product.images?.[0] || '/images/placeholder-product.jpg',
    seller_name: product.sellers?.business_name || 'Local Seller',
    is_new: true,
    stock_quantity: product.quantity,
    tags: product.tags || [],
    category: product.categories?.name || 'General',
    created_at: product.created_at,
    updated_at: product.updated_at
  }))
}

export async function getTopSellingProducts(limit: number = 8): Promise<Product[]> {
  const supabase = await createClient()
  
  // This would typically join with order_items to get sales count
  // For now, we'll use a combination of rating and review count
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      sellers (business_name),
      categories (name)
    `)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .order('total_reviews', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching top selling products:', error)
    return []
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: parseFloat(product.price),
    original_price: product.compare_price ? parseFloat(product.compare_price) : undefined,
    rating: parseFloat(product.rating) || 4.5,
    review_count: product.total_reviews || 0,
    image_url: product.images?.[0] || '/images/placeholder-product.jpg',
    seller_name: product.sellers?.business_name || 'Local Seller',
    is_bestseller: true,
    stock_quantity: product.quantity,
    tags: product.tags || [],
    category: product.categories?.name || 'General',
    created_at: product.created_at,
    updated_at: product.updated_at
  }))
}

export async function getTrendingProducts(limit: number = 8): Promise<Product[]> {
  const supabase = await createClient()
  
  // In a real app, this would use view counts or sales velocity
  // For now, we'll use recently updated products with good ratings
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      sellers (business_name),
      categories (name)
    `)
    .eq('is_active', true)
    .gte('rating', 4.0)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching trending products:', error)
    return []
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: parseFloat(product.price),
    original_price: product.compare_price ? parseFloat(product.compare_price) : undefined,
    rating: parseFloat(product.rating) || 4.5,
    review_count: product.total_reviews || 0,
    image_url: product.images?.[0] || '/images/placeholder-product.jpg',
    seller_name: product.sellers?.business_name || 'Local Seller',
    stock_quantity: product.quantity,
    tags: product.tags || [],
    category: product.categories?.name || 'General',
    created_at: product.created_at,
    updated_at: product.updated_at
  }))
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      sellers (business_name),
      categories (name)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: parseFloat(product.price),
    original_price: product.compare_price ? parseFloat(product.compare_price) : undefined,
    rating: parseFloat(product.rating) || 4.5,
    review_count: product.total_reviews || 0,
    image_url: product.images?.[0] || '/images/placeholder-product.jpg',
    seller_name: product.sellers?.business_name || 'Local Seller',
    stock_quantity: product.quantity,
    tags: product.tags || [],
    category: product.categories?.name || 'General',
    created_at: product.created_at,
    updated_at: product.updated_at
  }))
}