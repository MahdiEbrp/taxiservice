import { NextApiRequest, NextApiResponse } from 'next';
import differenceInHours from 'date-fns/differenceInHours';
import { getRandomString } from '../../../lib/encryption';
import sendEmail, { verificationEmailBody } from '../../../lib/Email';
import prismaClient from '../../../lib/prismaClient';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(405).json({ error: 'ERR_INVALID_METHOD' });
    const code = req.query['code'] as string;
    if (!code)
        return res.status(400).json({ error: 'ERR_INVALID_FORMAT' });
    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                verifiedCode: code
            }
        });
        if (!user) {
            return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });
        }

        const diff = differenceInHours(new Date(), user.verifiedCodeDate);
        const verificationCode = getRandomString(5) + Date.now().toString();

        if (diff > 24) {
            const result= await prisma.user.update({
                where: { id: user.id },
                data: {
                    verifiedCode: verificationCode,
                    verifiedCodeDate:new Date()
                }
            });
            if (result) {
                sendEmail(user.email, `Email confirmation from ${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                    , verificationEmailBody(verificationCode));
                return res.status(400).json({ error: 'ERR_REQUEST_EXPIRED' });
            }
            else
                return res.status(503).json({ error: 'ERR_INTERNAL_UPDATE' });

        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verified: true,
                verifiedCode: '',
            }
        });

    }
    catch {
        return res.status(503).json({ error: 'ERR_INTERNAL_UPDATE' });
    }
    return res.status(200).end();
};
export default Handler;