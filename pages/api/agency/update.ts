import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prismaClient from '../../../lib/prismaClient';
import { arrayHasNullOrEmptyItem } from '../../../lib/validator';


const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });

    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    let { agencyName } = <{ agencyName: string; }>req.body;
    const { isEnable } = <{ isEnable: boolean; }>req.body;
    let { phoneNumber1, phoneNumber2, mobileNumber } = <{ phoneNumber1: string, phoneNumber2: string, mobileNumber: string; }>req.body;
    let { address } = <{ address: string; }>req.body;
    const { latitude, longitude } = <{ latitude: number; longitude: number; }>req.body;
    const { workingDays, startOfWorkingHours, endOfWorkingHours } = <{ workingDays: number, startOfWorkingHours: Date, endOfWorkingHours: Date; }>req.body;

    //phoneNumber 2 is optional
    const isValid = !arrayHasNullOrEmptyItem([agencyName, isEnable, phoneNumber1, mobileNumber, address, latitude, longitude, workingDays, startOfWorkingHours, endOfWorkingHours]);
    if (!isValid)
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });
    const email = session.user.email;
    const maxAgencyLength = 50;
    const maxPhoneNumberLength = 30;
    const maxAddressLength = 300;
    phoneNumber2 = phoneNumber2 ? phoneNumber2 : '';
    agencyName = agencyName.trim().substring(0, maxAgencyLength);
    phoneNumber1 = phoneNumber1.trim().substring(0, maxPhoneNumberLength);
    phoneNumber2 = phoneNumber2.trim().substring(0, maxPhoneNumberLength);
    mobileNumber = mobileNumber.trim().substring(0, maxPhoneNumberLength);
    address = address.trim().substring(0, maxAddressLength);

    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });

        const agency = await prisma.agency.update({
            where: {
                id: user.id
            },
            data: {
                agencyName: agencyName,
                isEnable: isEnable,
                phoneNumber1: phoneNumber1,
                phoneNumber2: phoneNumber2,
                mobileNumber: mobileNumber,
                address: address,
                latitude: latitude,
                longitude: longitude,
                workingDays: workingDays,
                startOfWorkingHours: startOfWorkingHours,
                endOfWorkingHours: endOfWorkingHours
            }
        });
        return res.status(200).json({ agency: agency });
    } catch (error) {
        return res.status(500).json({ error: 'ERR_INTERNAL_SERVER_ERROR' });
    }
};
export default Handler;
