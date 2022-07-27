import prismaClient from '../../../lib/PrismaClient';
import sendEmail, { resetPasswordBody } from '../../../lib/Email';
import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { getRandomString } from '../../../lib/Encryption';
import { isCaptchaValid, isEmailValid } from '../../../lib/Validator';
const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST')
        return res.status(405).json({ error: 'ERR_INVALID_METHOD' });

    const { requestId, email } = req.body;

    if (!requestId && !email)
        return res.status(400).json({ error: 'ERR_POST_DATA' });

    if (!isEmailValid(email))
        return res.status(405).json({ error: 'ERR_INVALID_FORMAT' });

    const isValid = await isCaptchaValid(requestId);
    if (isValid === 200) {

        const prisma = prismaClient;
        const randomResetCode = getRandomString(15) + Date.now().toString();
        try {
            const result = await prisma.user.findFirst({
                where: {
                    email: email
                },
            });
            if (result) {
                const user = await prisma.user.update({
                    where: {
                        id: result.id,
                    },
                    data: {
                        resetCode: randomResetCode,
                        resetCodeDate: new Date()
                    }
                });
                if (!user)
                    return res.status(503).json({ error: 'ERR_INTERNAL_UPDATE' });
                sendEmail(email, `Reset email link from ${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                    , resetPasswordBody(randomResetCode));
                return res.status(200).end();
            }
            else
                return res.status(400).json({ error: 'ERR_EMAIL_NOT_FOUND' });
        }
        catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError)
                return res.status(503).json({ error: 'ERR_INTERNAL_UPDATE' });

            if (e instanceof Error)
                if (e.message === 'ERR_SEND_MAIL')
                    return res.status(202).json({ error: 'ERR_SEND_MAIL' });

            return res.status(503).json({ error: 'ERR_UNKNOWN' });


        }
    }
    else
        res.status(isValid).json({ error: 'ERR_INVALID_CAPTCHA' });

};
export default Handler;