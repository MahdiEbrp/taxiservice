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
                isEnable: true,
            },
            select: {
                id: true,
                agencyName: true,
                phoneNumber1: true,
                phoneNumber2: true,
                address: true,
                latitude: true,
                longitude: true,
                workingDays: true,
                startOfWorkingHours: true,
                endOfWorkingHours: true,
            }
        });

        const dateNow = new Date();
        const dayNow = 1 << dateNow.getDay();
        const openedAgency = agency.filter((item) => {
            const isOpen = (item.workingDays & dayNow) > 0;
            const startOfWorkingHours = item.startOfWorkingHours.getHours() * 60 + item.startOfWorkingHours.getMinutes();
            const endOfWorkingHours = item.endOfWorkingHours.getHours() * 60 + item.endOfWorkingHours.getMinutes();
            const now = dateNow.getHours() * 60 + dateNow.getMinutes();
            return isOpen && (now >= startOfWorkingHours && now <= endOfWorkingHours);
        });
        if (!agency)
            return res.status(404).json({ error: 'ERR_AGENCY_NOT_FOUND' });
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
        return res.status(200).json({ agencies: openedAgency , places: places });
    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;
