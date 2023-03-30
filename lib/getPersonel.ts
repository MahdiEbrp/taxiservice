import prismaClient from './prismaClient';

const getPersonel = async (email: string) => {
    const prisma = prismaClient;
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if (!user)
        return null;
    const agency = await prisma.agency.findMany({
        select: {
            id: true,
            agencyName: true,
        },
        where: {
            userId:user.id
        }
    });
    if (!agency)
        return null;
    const personel = await prisma.personel.findMany({
        where: {
            agencyId: {
                in: agency.map((a) => a.id)
            }
        },
    });
    return personel;
};

export default getPersonel;