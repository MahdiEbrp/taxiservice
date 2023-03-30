import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { log } from 'next-axiom';
import prismaClient from '../../../lib/prismaClient';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (req.method !== 'GET')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });
    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const email = session.user.email;
    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });
        const agency = await prisma.agency.findMany({
            where: {
                userId: user.id
            },
        });

        const agencyCount = agency.length;
        const profilePicture = user.profilePicture;
        const name = user.name;
        const localization = user.localization;
        const accountType = user.accountType;
        const isFirstLogin = user.settingUpdateDate === null;
        return res.status(200).json({ email, name, profilePicture, agencyCount, localization, accountType, isFirstLogin });

    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;