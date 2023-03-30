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
        const agencies = await prisma.agency.findMany({
            where: {
                userId: user.id,
                isEnable:true
            },
            select: {
                id: true,
                agencyName: true,
            }
        });

        if (!agencies)
            return res.status(404).json({ error: 'ERR_AGENCY_NOT_FOUND' });

        const trips = await prisma.trips.findMany({
            where: {
                agencyId: {
                    in: agencies.map((a) => a.id)
                },
                status: {
                    in:[1,3]
                },
            },
        });
        if (!trips || trips.length === 0)
            return res.status(200).json([]);
        const combinedWithAgencyName = trips.map((trip) => {
            return {
                ...trip,
                agencyName: agencies.find((a) => trip.agencyId === a.id)?.agencyName || ''
            };
        });
        return res.status(200).json(combinedWithAgencyName);
    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;
