import sh256 from 'crypto-js/sha256';
export const Sh256Encrypt = (message: string, salt: string) => {
    const iterations = 10000;
    const keylen = 32;
    return (
        sh256(message, {
            salt: salt,
            iterations: iterations,
            keylen: keylen,
        }).toString()
    );
};
export const getRandomString = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;

};