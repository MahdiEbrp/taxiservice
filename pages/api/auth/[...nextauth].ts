import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { isCaptchaValid } from '../../../lib/Validator';
import prismaClient from '../../../lib/PrismaClient';
import { Sh256Encrypt } from '../../../lib/Encryption';

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
                if (!email || !password)
                    return null;

                const requestId = credentials?.requestId;
                if (email && password && requestId) {

                    const isValid = await isCaptchaValid(credentials?.requestId);
                    const encryptedPassword = Sh256Encrypt(password, process.env.ENCRYPTION_PASSWORD_SALT as string);

                    if (isValid !== 200)
                        throw new Error('ERR_INVALID_CAPTCHA');
                    else {
                        try {
                            const prisma = prismaClient;
                            const user = await prisma.user.findFirst({
                                where: {
                                    email: email,
                                    password: encryptedPassword,
                                    verified:true
                                }
                            });
                            return user;
                        }
                        catch(e) {
                            throw new Error('ERR_UNKNOWN_AUTHORIZING_USER');
                        }
                    }

                }
                else
                    throw new Error('ERR_INVALID_FORMAT');
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




