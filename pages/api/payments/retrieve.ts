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
                userId: user.id
            },
        });
        const personel = await prisma.personel.findMany({
            where: {
                userId: user.id,
            }
        });

        const trips = await prisma.trips.findMany({
            where: {
                OR: [
                    {
                        userId: user.id
                    },
                    {
                        agencyId: {
                            in: agencies.map((a) => a.id)
                        }
                    },
                    {
                        personelId: {
                            in: personel.map((p) => p.id)
                        }
                    }
                ],
                status: 1
            }
        });

        const combinedWithAgencyName = await Promise.all(trips.map(async (trip) => {
            const agency = await prisma.agency.findFirst({
                where: {
                    id: trip.agencyId,
                }
            });
            const _agency = agencies.find((a) => trip.agencyId === a.id);
            const _personel = personel.find((p) => trip.personelId === p.id);
            const isPassenger = trip.userId === user.id;

            let income = _agency ? trip.commission : 0;
            income += _personel ? trip.price - trip.commission : 0;
            const cost = isPassenger ? trip.price : 0;
            return {
                ...trip,
                agencyName: agency?.agencyName || '',
                income,
                cost,
            };
        }));
        if (!combinedWithAgencyName)
            return res.status(200).json([]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newArr = combinedWithAgencyName.map(({ commission, price, ...rest }) => { return rest; });
        return res.status(200).json({trips: newArr });

    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;
