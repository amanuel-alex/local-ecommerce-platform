// components/profile/profile-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, Mail, Phone, MapPin, Building, CreditCard, 
  Shield, Upload, Save, X, Globe, Package, 
  BarChart3, Users, Settings as SettingsIcon 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

interface ProfileFormProps {
  user: any
  userRole: 'customer' | 'seller' | 'admin'
}

interface ProfileData {
  full_name: string
  email: string
  phone: string
  address: string
  bio: string
  company_name: string
  tax_id: string
  website: string
  notification_email: boolean
  notification_sms: boolean
}

export default function ProfileForm({ user, userRole }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState<ProfileData>({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
    bio: user?.user_metadata?.bio || '',
    company_name: user?.user_metadata?.company_name || '',
    tax_id: user?.user_metadata?.tax_id || '',
    website: user?.user_metadata?.website || '',
    notification_email: user?.user_metadata?.notification_email || true,
    notification_sms: user?.user_metadata?.notification_sms || false,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Load additional profile data
    const loadProfileData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setFormData(prev => ({
          ...prev,
          ...profile
        }))
        setAvatarUrl(profile.avatar_url || '')
      }
    }
    loadProfileData()
  }, [user.id, supabase])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let avatarUrlToSave = avatarUrl
      
      // Upload avatar if new file selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        avatarUrlToSave = publicUrl
      }

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          avatar_url: avatarUrlToSave,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Update user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
          company_name: formData.company_name,
          avatar_url: avatarUrlToSave,
        }
      })

      if (authError) throw authError

      toast.success('Profile updated successfully!')
      router.refresh()
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Role-specific configurations
  const roleConfig = {
    customer: {
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: User,
      title: 'Customer Profile',
      description: 'Manage your personal information and preferences',
    },
    seller: {
      badgeColor: 'bg-green-100 text-green-800 border-green-200',
      icon: Building,
      title: 'Seller Profile',
      description: 'Manage your business information and seller settings',
    },
    admin: {
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: SettingsIcon,
      title: 'Admin Profile',
      description: 'Administrator account settings and management',
    },
  }

  const config = roleConfig[userRole]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <config.icon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">{config.title}</h1>
              <Badge className={`${config.badgeColor} border`}>
                {userRole.toUpperCase()}
              </Badge>
            </div>
            <p className="text-gray-600">{config.description}</p>
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Avatar & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-3xl">
                        {formData.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 cursor-pointer">
                      <div className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors">
                        <Upload className="h-4 w-4" />
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{formData.full_name || 'User'}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>

                  <Separator />

                  {/* Quick Stats */}
                  <div className="w-full space-y-3">
                    {userRole === 'customer' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Orders</span>
                          <span className="font-semibold">24</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Wishlist</span>
                          <span className="font-semibold">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Reviews</span>
                          <span className="font-semibold">12</span>
                        </div>
                      </>
                    )}
                    {userRole === 'seller' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Products</span>
                          <span className="font-semibold">156</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Sales</span>
                          <span className="font-semibold">$12,450</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rating</span>
                          <span className="font-semibold">4.8/5</span>
                        </div>
                      </>
                    )}
                    {userRole === 'admin' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Users</span>
                          <span className="font-semibold">1,245</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sellers</span>
                          <span className="font-semibold">89</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Active Now</span>
                          <span className="font-semibold">342</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {userRole === 'customer' && (
                  <>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/customer/orders">My Orders</a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/customer/wishlist">Wishlist</a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/customer/cart">Shopping Cart</a>
                    </Button>
                  </>
                )}
                {userRole === 'seller' && (
                  <>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/seller/products">Products</a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/seller/orders">Orders</a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/seller/analytics">Analytics</a>
                    </Button>
                  </>
                )}
                {userRole === 'admin' && (
                  <>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/admin/users">User Management</a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/admin/sellers">Seller Management</a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/admin/analytics">Platform Analytics</a>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">
                            <User className="inline h-4 w-4 mr-2" />
                            Full Name
                          </Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            <Mail className="inline h-4 w-4 mr-2" />
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                            className="bg-gray-50"
                          />
                          <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            <Phone className="inline h-4 w-4 mr-2" />
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">
                            <MapPin className="inline h-4 w-4 mr-2" />
                            Address
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main Street, City, State ZIP"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="business">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>
                        {userRole === 'seller' 
                          ? 'Update your business details for customers'
                          : userRole === 'admin'
                          ? 'Administration settings'
                          : 'Additional information'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {userRole === 'seller' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="company_name">
                                <Building className="inline h-4 w-4 mr-2" />
                                Company Name
                              </Label>
                              <Input
                                id="company_name"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder="Your Company Name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tax_id">Tax ID / Business Number</Label>
                              <Input
                                id="tax_id"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={handleChange}
                                placeholder="TAX-123456"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="website">
                                <Globe className="inline h-4 w-4 mr-2" />
                                Website
                              </Label>
                              <Input
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://yourcompany.com"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {userRole === 'admin' && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Administrator Settings</h4>
                          <p className="text-sm text-gray-600">
                            Additional administrator settings can be configured in the admin panel.
                          </p>
                        </div>
                      )}
                      {userRole === 'customer' && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Customer Preferences</h4>
                          <p className="text-sm text-gray-600">
                            Set your shopping preferences and notification settings.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose how you want to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-gray-600">Receive updates via email</p>
                          </div>
                          <Switch
                            checked={formData.notification_email}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, notification_email: checked }))
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">SMS Notifications</h4>
                            <p className="text-sm text-gray-600">Receive updates via text message</p>
                          </div>
                          <Switch
                            checked={formData.notification_sms}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, notification_sms: checked }))
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">Current Password</Label>
                          <Input id="current_password" type="password" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input id="new_password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <Input id="confirm_password" type="password" />
                          </div>
                        </div>
                        <Button>Change Password</Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Two-Factor Authentication</h4>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">2FA Status</h4>
                            <p className="text-sm text-gray-600">
                              {userRole === 'admin' ? 'Required' : 'Optional'}
                            </p>
                          </div>
                          <Button variant="outline">
                            <Shield className="h-4 w-4 mr-2" />
                            {userRole === 'admin' ? 'Manage 2FA' : 'Enable 2FA'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </form>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}