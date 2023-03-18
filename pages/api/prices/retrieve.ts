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

        const personel = await prisma.personel.findMany({
            where: {
                userId: user.id,
                isEnable: true
            },
        });

        const agencies = await prisma.agency.findMany({
            where: {
                id: {
                    in: personel.map((a) => a.agencyId)
                }
            },
            select: {
                agencyName: true,
                id:true
            }
        });
        const prices = await prisma.prices.findMany({
            where: {
                agencyId: {
                    in: agencies.map((a) => a.id)
                }
            }
        });
        const places = await prisma.places.findMany({
            where: {
                userId: user.id
            },
            select: {
                id: true,
                address: true,
                longitude: true,
                latitude: true,
            }
        });
        return res.status(200).json({ prices: prices, agencies: agencies, places:places });

    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;
