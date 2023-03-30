import { NextApiRequest, NextApiResponse } from 'next';
import { log } from 'next-axiom';
import prismaClient from '../../../lib/prismaClient';
import { arrayHasNullOrEmptyItem, getCaptchaValidationStatus } from '../../../lib/validator';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });


    const { captcha, agencyID, title, message, phoneNumber } = <{ captcha: string, agencyID: string, title: string, message: string, phoneNumber: string; }>req.body;

    if (arrayHasNullOrEmptyItem([captcha, title, message, phoneNumber]))
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });

    const isValid = await getCaptchaValidationStatus(captcha);
    if (isValid !== 200)
        res.status(405).json({ error: 'ERR_INVALID_FORMAT' });

    try {
        const prisma = prismaClient;

        const agency = await prisma.agency.findFirst({
            where: {
                id: agencyID
            }
        });

        if (!agency)
            return res.status(404).json({ error: 'ERR_AGENCY_NOT_FOUND' });

        await prisma.message.create({
            data: {
                title: title,
                message: `$PHONE_NUMBER$ : ${phoneNumber}\r\n$MESSAGE$ : ${message}`,
                createdAt: new Date(),
                isRead: false,
                senderId: agency.userId,
                userId: agency.userId
            }
        });

        return res.status(200).json({ message: 'ok' });



    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;