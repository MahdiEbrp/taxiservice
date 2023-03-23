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


        const trips = await prisma.trips.findMany({
            where: {
                userId: user.id,
            },
        });
        if (!trips || trips.length === 0)
            return res.status(200).json([]);

        const combinedWithAgencyName = await Promise.all(trips.map(async (trip) => {
            const agency = await prisma.agency.findFirst({
                where: {
                    id: trip.agencyId,
                }
            });
            return {
                ...trip,
                agencyName: agency?.agencyName || ''
            };
        }));

        return res.status(200).json(combinedWithAgencyName);

    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;
