import CredentialProvider from 'next-auth/providers/credentials';
import NextAuth, { Session } from 'next-auth';
import prismaClient from '../../../lib/prismaClient';
import { Sh256Encrypt } from '../../../lib/encryption';
import { getCaptchaValidationStatus } from '../../../lib/validator';
import { log } from 'next-axiom';
import { JWT } from 'next-auth/jwt';

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

                    const isValid = await getCaptchaValidationStatus(credentials?.requestId);
                    const encryptedPassword = Sh256Encrypt(password, process.env.ENCRYPTION_PASSWORD_SALT as string);

                    if (isValid !== 200)
                        throw new Error('ERR_SERVER_INVALID_CAPTCHA');
                    else {
                        try {
                            const prisma = prismaClient;
                            const user = await prisma.user.findFirst({
                                where: {
                                    email: email,
                                    password: encryptedPassword,
                                }
                            });
                            if (user) {
                                if (!user.verified)
                                    throw new Error('ERR_USER_NOT_VERIFIED');
                                else
                                    return { id:'',email: user.email, name: user.name };
                            }
                            return null;
                        }
                        catch (e) {
                            log.error(JSON.stringify(e));
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
    callbacks: {
        async session(params: { session: Session; token: JWT; }) {
            const { session, token } = params;
            const prisma = prismaClient;
            try {
                const user = await prisma.user.findFirst({
                    where: {
                        email: token.email || '',
                    }
                });

                if (user) {
                    session.user = { email: user.email, name: user.name };
                    return Promise.resolve(session);
                }
                return Promise.reject();
            }
            catch (e) {
                log.error(JSON.stringify(e));
                return Promise.reject({ 'message:' : JSON.stringify(e) });
            }
        },

    },

};
export default NextAuth(options);