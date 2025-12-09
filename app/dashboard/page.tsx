'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart, 
  Package,
  TrendingUp,
  Clock,
  Store
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchUserAndProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, search, selectedCategory, sortBy])

  const fetchUserAndProducts = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Fetch user role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      // Fetch all products (excluding user's own if seller)
      let query = supabase
        .from('products')
        .select('*, sellers(business_name), categories(name)')
        .eq('is_active', true)

      // If seller, don't show their own products
      if (userData?.role === 'seller') {
        query = query.neq('seller_id', user.id)
      }

      const { data: productsData, error: productsError } = await query

      if (productsError) throw productsError

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setProducts(productsData || [])
      setCategories(categoriesData || [])
      setFilteredProducts(productsData || [])
    } catch (error) {
      toast.error('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Filter by search
    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase()) ||
        product.sellers?.business_name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category_id === selectedCategory ||
        product.categories?.name === selectedCategory
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'popular':
          return (b.sales_count || 0) - (a.sales_count || 0)
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProducts(filtered)
  }

  const addToCart = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        })

      if (error) throw error

      toast.success('Added to cart')
    } catch (error) {
      toast.error('Error adding to cart')
    }
  }

  const addToWishlist = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId
        })

      if (error) throw error

      toast.success('Added to wishlist')
    } catch (error) {
      toast.error('Error adding to wishlist')
    }
  }

  const handleQuickBuy = (productId: string) => {
    addToCart(productId)
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Products</h1>
          <p className="text-muted-foreground">
            Discover amazing products from our sellers
          </p>
        </div>
        {user?.role === 'seller' && (
          <Button onClick={() => router.push('/dashboard/seller/products/new')}>
            + Add Your Product
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, sellers, categories..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.slice(0, 8).map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {/* Content will be filtered by main filters */}
          </TabsContent>
          {categories.slice(0, 8).map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              {/* Category-specific content if needed */}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.is_featured && (
                    <Badge className="bg-primary">Featured</Badge>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <Badge className="bg-amber-500">Low Stock</Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge className="bg-destructive">Out of Stock</Badge>
                  )}
                </div>
                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={() => addToWishlist(product.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>By {product.sellers?.business_name || 'Seller'}</span>
                  {product.rating && (
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">${product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ${product.original_price}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{product.sales_count || 0} sold</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleQuickBuy(product.id)}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="text-muted-foreground mt-2">
              {search ? 'Try a different search term' : 'No products available yet'}
            </p>
          </div>
        )}
      </div>

      {/* Featured Sellers Section */}
      {filteredProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Featured Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from(new Set(filteredProducts.map(p => p.seller_id)))
              .slice(0, 3)
              .map(sellerId => {
                const sellerProducts = filteredProducts.filter(p => p.seller_id === sellerId)
                const seller = sellerProducts[0]?.sellers
                if (!seller) return null
                
                return (
                  <Card key={sellerId} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Store className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{seller.business_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sellerProducts.length} products
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Visit Store
                      </Button>
                    </div>
                  </Card>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}