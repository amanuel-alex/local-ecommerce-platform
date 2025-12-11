// import { NextAuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { prisma } from './prisma'
// import bcrypt from 'bcryptjs'
// import GoogleProvider from 'next-auth/providers/google'

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error('Invalid credentials')
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email }
//         })
// // 
//         if (!user || !user.password) {
//           throw new Error('Invalid credentials')
//         }

//         const isValid = await bcrypt.compare(credentials.password, user.password)

//         if (!isValid) {
//           throw new Error('Invalid credentials')
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.sub!
//         session.user.role = token.role as string
//       }
//       return session
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role
//       }
//       return token
//     }
//   },
//   pages: {
//     signIn: '/auth/signin',
//     signUp: '/auth/signup',
//     error: '/auth/error',
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// }

// export { auth } from 'next-auth'