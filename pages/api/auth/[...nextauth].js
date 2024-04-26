import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import FacebookProvider from 'next-auth/providers/facebook'
import {  MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/mongodb'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      const adminList = [
        'william.christopher.96@gmail.com',
        'alicefinger@unipampa.edu.br',
        'alinemello@unipampa.edu.br',
        'marcoseduardo.aluno@unipampa.edu.br',
        'marcoseduardolopes00@gmail.com'
      ]

      session.user._id = user.id
      session.user.role = adminList.includes(user.email) ? 'admin' : 'user'

      return session
    },
  },
  adapter: MongoDBAdapter(clientPromise)
})
