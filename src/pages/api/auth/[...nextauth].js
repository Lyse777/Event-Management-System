import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; 

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        
        if (
          credentials.username === process.env.ADMIN_USER &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: 1, name: 'Admin User' }; 
        }
        return null; 
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
});
