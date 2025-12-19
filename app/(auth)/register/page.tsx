'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Lock, Eye, EyeOff, Store } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    account_type: 'customer' as 'customer' | 'seller',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords don't match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix form errors')
      return
    }

    console.log('🚀 Starting registration process...')
    setLoading(true)
    const toastId = toast.loading('Creating your account...')

    try {
      console.log('📤 Calling Supabase signUp...')
      // 1. Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            account_type: formData.account_type,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        console.error('❌ Supabase signUp error:', signUpError)
        throw signUpError
      }

      console.log('✅ Auth signUp successful:', authData)

      if (!authData.user) {
        throw new Error('No user created')
      }

      // 2. Show success message IMMEDIATELY
      toast.success('Account created successfully!', {
        id: toastId,
        description: authData.session 
          ? 'You are now logged in.' 
          : 'Please check your email to verify your account.',
      })

      // 3. Clear loading state
      setLoading(false)

      // 4. Redirect based on session - WITHOUT async delays
      if (authData.session) {
        console.log('✅ User has session, redirecting...')
        // Small timeout to ensure state updates
        setTimeout(() => {
          if (formData.account_type === 'seller') {
            router.push('/seller')
          } else {
            router.push('/customer')
          }
        }, 100)
      } else {
        console.log('📧 No session, redirecting to verify page')
        // Email verification required
        setTimeout(() => {
          router.push(`/verify?email=${encodeURIComponent(formData.email)}`)
        }, 100)
      }

    } catch (error: any) {
      console.error('❌ Registration error:', error)
      setLoading(false)
      
      let errorMessage = 'Registration failed'
      let errorDescription = error?.message || 'Please try again later'
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Email already registered'
        errorDescription = 'Please try logging in or use a different email.'
      } else if (error.message?.includes('password')) {
        errorMessage = 'Password issue'
        errorDescription = 'Please use a stronger password (min 6 characters).'
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'Too many attempts'
        errorDescription = 'Please wait a few minutes before trying again.'
      }

      toast.error(errorMessage, {
        id: toastId,
        description: errorDescription,
      })
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground">
            Join our community today
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-card rounded-xl  shadow-sm p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2.5">
              <Label htmlFor="full_name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  placeholder="your name"
                  className="pl-10 h-11"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.full_name && (
                <p className="text-sm text-destructive mt-1.5">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@example.com"
                  className="pl-10 h-11"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1.5">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2.5">
              <Label htmlFor="confirm_password" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11"
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-sm text-destructive mt-1.5">{errors.confirm_password}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Account Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Customer */}
                <button
                  type="button"
                  onClick={() => handleInputChange('account_type', 'customer')}
                  disabled={loading}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.account_type === 'customer'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <User className={`w-6 h-6 mb-2 ${
                    formData.account_type === 'customer' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <span className="font-medium text-sm">Customer</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    Browse & shop
                  </span>
                </button>

                {/* Seller */}
                <button
                  type="button"
                  onClick={() => handleInputChange('account_type', 'seller')}
                  disabled={loading}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.account_type === 'seller'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <Store className={`w-6 h-6 mb-2 ${
                    formData.account_type === 'seller' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <span className="font-medium text-sm">Seller</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    Sell products
                  </span>
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 rounded border-border"
                disabled={loading}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal">
                I agree to the
                <Link href="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>{' '}
               
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-primary font-medium hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}