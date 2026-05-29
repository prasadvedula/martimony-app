import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) return null

        const valid = await compare(credentials.password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email ?? '',
          name: user.name ?? '',
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id: string; role: string }).id = token.id as string;
        (session.user as { id: string; role: string }).role = token.role as string
      }
      return session
    },
  },
}

export async function getSession() {
  return getServerSession(authOptions)
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  if ((session.user as { role: string }).role !== 'ADMIN') throw new Error('Forbidden')
  return session
}
