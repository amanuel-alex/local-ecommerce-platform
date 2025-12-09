'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardPage from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  ShoppingCart,
  Trash2,
  Eye,
  Package,
  Star,
  Filter,
  Search
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface WishlistItem {
  id: string
  product_id: string
  product: {
    id: string
    name: string
    description: string
    price: number
    original_price?: number
    image_url?: string
    stock: number
    rating?: number
    seller: {
      business_name: string
    }
  }
  created_at: string
}

export default function CustomerWishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const supabase = createClient()

  useEffect(() => {
    fetchWishlist()
  }, [])

  useEffect(() => {
    filterAndSortItems()
  }, [wishlistItems, search, sortBy])

  const fetchWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products (
            *,
            seller:sellers (business_name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setWishlistItems(data || [])
    } catch (error) {
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortItems = () => {
    let filtered = [...wishlistItems]

    // Filter by search
    if (search) {
      filtered = filtered.filter(item =>
        item.product.name.toLowerCase().includes(search.toLowerCase()) ||
        item.product.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.product.seller.business_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.product.price - b.product.price
        case 'price-high':
          return b.product.price - a.product.price
        case 'rating':
          return (b.product.rating || 0) - (a.product.rating || 0)
        case 'name':
          return a.product.name.localeCompare(b.product.name)
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredItems(filtered)
  }

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistId)

      if (error) throw error

      setWishlistItems(items => items.filter(item => item.id !== wishlistId))
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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
      toast.error('Failed to add to cart')
    }
  }

  const moveAllToCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      for (const item of wishlistItems) {
        const { error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: item.product_id,
            quantity: 1
          })

        if (error) throw error
      }

      toast.success('All items added to cart')
    } catch (error) {
      toast.error('Failed to add items to cart')
    }
  }

  const clearWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setWishlistItems([])
      toast.success('Wishlist cleared')
    } catch (error) {
      toast.error('Failed to clear wishlist')
    }
  }

  return (
    <DashboardPage
      title="My Wishlist"
      description="Save products you love for later"
      allowedRoles={['customer']}
    >
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading wishlist...</p>
        </div>
      ) : (
        <div className="p-6">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search wishlist items..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
              {wishlistItems.length > 0 && (
                <>
                  <Button variant="outline" onClick={moveAllToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                  <Button variant="destructive" onClick={clearWishlist}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Wishlist Stats */}
          {wishlistItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{wishlistItems.length}</div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    ${wishlistItems.reduce((sum, item) => sum + item.product.price, 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {Math.max(...wishlistItems.map(item => item.product.rating || 0)).toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">Highest Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {wishlistItems.filter(item => item.product.stock > 0).length}
                  </div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Wishlist Items */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
              <p className="text-muted-foreground mt-2">
                {search ? 'No items match your search' : 'Start adding products you love'}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative h-48 w-full bg-muted">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {/* Stock Badge */}
                      {item.product.stock === 0 && (
                        <Badge className="absolute top-2 right-2 bg-destructive">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromWishlist(item.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold">${item.product.price}</span>
                          {item.product.original_price && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              ${item.product.original_price}
                            </span>
                          )}
                        </div>
                        {item.product.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{item.product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        Sold by: {item.product.seller.business_name}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2 p-4 pt-0">
                    <Button
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/product/${item.product_id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => addToCart(item.product_id)}
                      disabled={item.product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardPage>
  )
}