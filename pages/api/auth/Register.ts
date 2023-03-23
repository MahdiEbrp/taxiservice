import prismaClient from '../../../lib/prismaClient';
import sendEmail, { verificationEmailBody } from '../../../lib/Email';
import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { getCaptchaValidationStatus, isEmailValid, isPasswordValid } from '../../../lib/validator';
import { getRandomString, Sh256Encrypt } from '../../../lib/encryption';
import { log } from 'next-axiom';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST')
        return res.status(405).json({ error: 'ERR_INVALID_METHOD' });

    const { requestId, email, password } = <{ requestId: string, email: string; password: string; }>req.body;

    if (!requestId && !email && !password)
        return res.status(400).json({ error: 'ERR_POST_DATA' });

    const isValid = await getCaptchaValidationStatus(requestId);

    if (isValid === 200) {
        if (isPasswordValid(password) && isEmailValid(email)) {

            const encryptedPassword = Sh256Encrypt(password, process.env.ENCRYPTION_PASSWORD_SALT as string);
            const prisma = prismaClient;
            const verificationCode = getRandomString(5) + Date.now().toString();
            try {
                const result = await prisma.user.create({
                    data: {
                        email: email,
                        password: encryptedPassword,
                        verifiedCode: verificationCode,
                        verified: false,
                        verifiedCodeDate: new Date(),
                        createdAt: new Date(),
                        name: '',
                        profilePicture: 'profile0.svg',
                        localization: 'US',
                    }
                });
                if (result) {
                    sendEmail(email, `Email confirmation from ${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                        , verificationEmailBody(verificationCode));
                    return res.status(200).end();
                }
                else
                    return res.status(503).json({ error: 'ERR_UNKNOWN' });

            }
            catch (e) {

                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    {
                        if (e.code === 'P2002')
                            return res.status(400).json({ error: 'ERR_EMAIL_EXISTS' });
                        else
                            return res.status(503).json({ error: 'ERR_UNKNOWN_CREATING_USER' });
                    }

                }
                if (e instanceof Error)
                    if (e.message === 'ERR_SEND_MAIL')
                        return res.status(202).json({ error: 'ERR_SEND_MAIL' });
                log.error(JSON.stringify(e));
                return res.status(503).json({ error: 'ERR_UNKNOWN' });


            }
        }
        else
            res.status(405).json({ error: 'ERR_INVALID_FORMAT' });

    }
    else
        res.status(isValid).json({ error: 'ERR_INVALID_CAPTCHA' });


};
export default Handler;