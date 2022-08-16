import differenceInHours from 'date-fns/differenceInHours';
import prismaClient from '../../../lib/PrismaClient';
import sendEmail, { resetPasswordBody } from '../../../lib/Email';
import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { getRandomString, Sh256Encrypt } from '../../../lib/Encryption';
import { getCaptchaValidationStatus, isPasswordValid } from '../../../lib/Validator';
const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST')
        return res.status(405).json({ error: 'ERR_INVALID_METHOD' });

    const { requestId, updateCode, password } = req.body;

    if (!requestId && !updateCode && !password)
        return res.status(400).json({ error: 'ERR_POST_DATA' });

    if (!isPasswordValid(password))
        return res.status(405).json({ error: 'ERR_INVALID_FORMAT' });

    const isValid = await getCaptchaValidationStatus(requestId);
    if (isValid === 200) {

        const prisma = prismaClient;

        try {
            const result = await prisma.user.findFirst({
                where: {
                    resetCode: updateCode
                },
            });
            if (result) {
                const diff = differenceInHours(new Date(), result.resetCodeDate as Date);
                const randomResetCode = getRandomString(15) + Date.now().toString();
                if (diff > 24) {
                    const user = await prisma.user.update({
                        where: { id: result.id },
                        data: {
                            resetCode: randomResetCode,
                            resetCodeDate: new Date()
                        }
                    });
                    if (user) {
                        sendEmail(result.email, `Password reset from ${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                            , resetPasswordBody(randomResetCode));
                        return res.status(400).json({ error: 'ERR_REQUEST_EXPIRED' });
                    }
                    else
                        return res.status(503).json({ error: 'ERR_INTERNAL_UPDATE' });
                }
                else {
                    const encryptedPassword = Sh256Encrypt(password, process.env.ENCRYPTION_PASSWORD_SALT as string);
                    const user = await prisma.user.update({
                        where: {
                            id: result.id,
                        },
                        data: {
                            resetCode: null,
                            resetCodeDate: null,
                            password: encryptedPassword,
                        }
                    });
                    if (!user)
                        return res.status(503).json({ error: 'ERR_INTERNAL_UPDATE' });
                }
                return res.status(200).end();
            }
            else
                return res.status(400).json({ error: 'ERR_INVALID_CODE' });
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