import nodemailer from 'nodemailer';
import ReactDOMServer from 'react-dom/server';

export const verificationEmailBody = (verificationCode: string) => {
    const defaultUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/emailVerification?code=${verificationCode}`;
    const persianVersion = `${process.env.NEXT_PUBLIC_WEB_URL}/fa/emailVerification?code=${verificationCode}`;
    const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    const html = () => {
        return (
            <div style={{ padding: '5px', borderColor: 'grey', borderStyle: 'solid' }}>
                <h2 style={{ textAlign: 'center' }}>The confirmation email</h2>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    You&apos;ve received an email from us because you signed up for {root} recently. Click the link below to confirm your email address and other information.
                </p>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    <a style={{
                        fontSize: '18px', fontFamily: 'Helvetica, Arial, sans-serif', color: '#ffffff',
                        fontWeight: 'bold', textDecoration: 'none', borderRadius: '5px', backgroundColor: '#1f7f4c',
                        borderColor: '#1f7f4c', display: 'inline-block', padding: '10px'
                    }} href={defaultUrl} target='_blank' rel='noreferrer' >
                        Confirm
                    </a>
                </p>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    For those of you who are having trouble accessing the link, here is the URL:<a href={defaultUrl} target='_blank' rel='noreferrer'>{defaultUrl}</a>
                </p>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    <a href={persianVersion} target='_blank' rel='noreferrer'>نسخه فارسی</a>
                </p>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    Copyright &copy; {root}
                </p>
            </div>
        );
    };
    return ReactDOMServer.renderToStaticMarkup(html());
};
export const resetPasswordBody = (verificationCode: string) => {
    const defaultUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/resetPassword?code=${verificationCode}`;
    const persianVersion = `${process.env.NEXT_PUBLIC_WEB_URL}/fa/resetPassword?code=${verificationCode}`;
    const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    const html = () => {
        return (
            <div style={{ padding: '5px', borderColor: 'grey', borderStyle: 'solid' }}>
                <h2 style={{ textAlign: 'center' }}>The confirmation email</h2>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    Please click on the reset link if you wish to reset your password. You may ignore this email if you do not wish to reset your password.
                </p>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    <a style={{
                        fontSize: '18px', fontFamily: 'Helvetica, Arial, sans-serif', color: '#ffffff',
                        fontWeight: 'bold', textDecoration: 'none', borderRadius: '5px', backgroundColor: '#1f7f4c',
                        borderColor: '#1f7f4c', display: 'inline-block', padding: '10px'
                    }} href={defaultUrl} target='_blank' rel='noreferrer' >
                        Reset Password
                    </a>
                </p>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    For those of you who are having trouble accessing the link, here is the URL:<a href={defaultUrl} target='_blank' rel='noreferrer'>{defaultUrl}</a>
                </p>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    <a href={persianVersion} target='_blank' rel='noreferrer'>نسخه فارسی</a>
                </p>
                <p style={{ textAlign: 'center', fontSize: '1.0rem' }}>
                    Copyright &copy; {root}
                </p>
            </div>
        );
    };
    return ReactDOMServer.renderToStaticMarkup(html());
};
const sendEmail = (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SENDER_SMTP_HOST,
        secure: true,
        port: 465,
        ignoreTLS: true,
        auth: {
            user: process.env.EMAIL_SENDER_USER,
            pass: process.env.EMAIL_SENDER_PASSWORD,
        },
    });
    const mailOptions = {
        from: `<${process.env.EMAIL_SENDER_USER}>`,
        to: to,
        subject: subject,
        html: html,
    };
    transporter.sendMail(mailOptions, (err) => {
        if (err)
            throw new Error('ERR_SEND_MAIL');
    });
};
export default sendEmail;