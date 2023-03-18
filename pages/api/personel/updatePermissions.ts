import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { log } from 'next-axiom';
import prismaClient from '../../../lib/prismaClient';
import { arrayHasNullOrEmptyItem } from '../../../lib/validator';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });
    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const email = session.user.email;
    const { id, position, canDrive, canSeeReports, canSeeRequests, isEnable, isManager } = <{
        id: string, position: string, canDrive: boolean, canSeeReports: boolean,
        canSeeRequests: boolean, isEnable: boolean, isManager: boolean;
    }>req.body;

    if (arrayHasNullOrEmptyItem([id, position, canDrive, canSeeReports, canSeeRequests, isEnable, isManager]))
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });

    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });
        const personel = await prisma.personel.update({
            where: {
                id: id
            },
            data: {
                position: position,
                canDrive: canDrive,
                canSeeReports: canSeeReports,
                canSeeRequests: canSeeRequests,
                isEnable: isEnable,
                isManager: isManager
            }
        });

        if (!personel)
            return res.status(404).json({ error: 'ERR_PERSONEL_NOT_FOUND' });

        return res.status(200).end();
    }
    catch (error) {
        if (error instanceof Error)
            log.error(error.message);
        else
            log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;
