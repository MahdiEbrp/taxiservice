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
    const { ids, insertMode } = <{ ids: string[], insertMode: boolean; }>req.body;

    if (arrayHasNullOrEmptyItem([ids, insertMode]))
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

        if (!insertMode) {
            await prisma.personel.deleteMany({
                where: {
                    agencyId: {
                        in: ids
                    }
                }
            });
        }
        else if (insertMode) {
            await prisma.personel.createMany({
                data: ids.map((id) => {
                    return {
                        agencyId: id,
                        userId: user.id,
                        isRequest: true,
                        isManager: false,
                        canDrive: false,
                        canSeeReports: false,
                        canSeeRequests: false,
                        position: '',

                    };
                })
            });
            const agencies = await prisma.agency.findMany({
                where: {
                    id: {
                        in: ids
                    }
                },
                select: {
                    userId: true
                }
            });
            const agencyUserIds = agencies.map((a) => a.userId);

            await prisma.message.createMany({
                data: agencyUserIds.map((id) => {
                    return {
                        title: '$JOB_REQUEST_TITLE$',
                        message: '$JOB_REQUEST_MESSAGE$',
                        createdAt: new Date(),
                        isRead: false,
                        senderId: id,
                        userId: id

                    };
                })
            });


        }

        const personel = await prisma.personel.findMany({
            where: {
                userId: user.id
            },
        });
        const agency = await prisma.agency.findMany({
            select: {
                id: true,
                agencyName: true,
            }
        });
        const combined = agency.map((a) => {
            const p = personel.find((p) => p.agencyId === a.id);
            let status = 0;
            if (p) { status = p.isRequest ? 1 : 2; }

            return {
                ...a,
                status: status
            };
        });

        return res.status(200).json(combined);

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
