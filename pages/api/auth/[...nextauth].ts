import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { isCaptchaValid } from '../../../lib/Validator';

export const options = {
    providers: [
        CredentialProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                email: { input: 'email', label: 'Email', type: 'email' },
                password: { input: 'password', label: 'Password', type: 'password' },
                requestId: { input: 'requestId', label: 'requestId', type: 'text' },
            },
            async authorize(credentials) {
                const email = credentials?.email;
                const password = credentials?.password;
                const requestId = credentials?.requestId;
                if (email && password && requestId) {

                    const isValid = await isCaptchaValid(credentials?.requestId as string);
                    if (isValid !== 200)
                        throw new Error(`Captcha Error ${isValid}`);
                    else {
                        const user = { id: 1, email: 'test@test.com', password: 'test123', requestId: 'ok' };
                        if (user.email === email && user.password === password)
                            return user;
                        else
                            return null;
                    }

                }
                else
                    return null;
            }
        }),

    ],
    pages: {
        signIn: '/',

    },
    secret: process.env.NEXT_AUTH_SECRET,
    jwt: {
        secret: process.env.NEXT_AUTH_SECRET,
        encryption: 'HS256',
    },

};
export default NextAuth(options);




