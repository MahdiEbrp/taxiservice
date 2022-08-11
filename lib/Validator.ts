
export const isEmailValid = (value: string) => {
    if (!value)
        return false;
    if (value.length < 5)
        return false;
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);

};
export const isPasswordValid = (value: string) => {
    if (!value)
        return false;
    if (value.length < 8)
        return false;
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)((?=.*\W)|(?=.*_))^.{8,}$/;
    return passwordRegex.test(value);
};
export const onlyNumbersRegex = /^[0-9]+$/;
export const isPhoneNumberValid = (value: string) => {
    if (!value)
        return false;
    if (value.length < 10)
        return false;
    const phoneNumberRegex = /^[0-9]/;
    return phoneNumberRegex.test(value);
};
export const isCaptchaValid = async (value: string) => {

    const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/robotCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            requestId: value,
        }),
    });
    return response.status;

};

