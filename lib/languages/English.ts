
const English = {
    settings: {
        displayName: 'English',
        code: 'en',
        rightToLeft: false,
        listStyle:'decimal',
    },
    sidebar: {
        home: 'Home',
        services: 'Services',
        support: 'Support',

    },
    languageDialog: {
        title: 'Select the language you would like to use.',
        save: 'Save',
        discard: 'Discard',
    },
    notification: {
        darkModeEnabled: 'The dark mode has been activated.',
        darkModeDisabled: 'The dark mode has been deactivated.',
        changedLanguage: 'The language change has been applied successfully.',
        invalidEmailFormat: 'The email format is incorrect.',
        invalidPasswordFormat: 'The password format is incorrect.',
        invalidConfirmPassword: 'There is a difference between a confirm password and a password entered!',
        invalidCaptchaFormat: 'The captcha format is incorrect.',
    },
    responseError: {
        ERR_UNKNOWN: 'An unknown error has occurred.',
        ERR_EMAIL_EXISTS: 'You already have an account with this email address. Please login.',
        ERR_INVALID_CAPTCHA: 'The captcha is invalid.',
        ERR_INVALID_FORMAT: 'The format submitted is incorrect.',
        ERR_INVALID_METHOD: 'The method submitted is incorrect',
        ERR_POST_DATA: 'The data is incorrect.',
        ERR_UNKNOWN_CREATING_USER: 'An unknown error has occurred while creating a user.',
        ERR_SERVICE_UNAVAILABLE: 'The service is unavailable.',
        ERR_INVALID_REQUEST: 'The request is invalid.',
        ERR_REQUEST_EXPIRED: 'It\'s too late to submit your request.',
        ERR_INTERNAL_UPDATE: 'A server issue is preventing the information from being edited. If you think it will help fix the problem, please contact us.',
        ERR_NULL_RESPONSE: 'The server did not provide a correct response.',
        HTML_ERROR_404: 'The page you are looking for does not exist.',
    },
    messageDialog: {
        ok: 'Ok',
        userCreatedSuccessfully: {
            title: 'Congratulations!',
            message: 'Your account has been successfully created.Please check your email to activate your account.',
        }
    },
    emailVerificationPage: {
        title: 'Email Verification',
        loading: 'Verifying your account...',
        operationFail: 'The account verification process failed.',
        reason: 'Reason:',
        problems: {
            internetConnection: 'Make sure your internet connection is working.',
            emailExpired: 'The correct code will be emailed to you. (Make sure your spam folder is checked.)',
            networkChanged: 'You can resend the request by clicking the "Resend" button.',
            serverError:'Contact the system administrator if none of the methods work.',
        },
        resend: 'Resend',
        cancel: 'Cancel',
        redirectingToHomePage: 'Redirecting to home page...',
    },
    loginDialog: {
        title: 'Login or Register',
        loginTab: {
            title: 'Login',
            email: 'Email',
            emailHelperText: 'An example would be: e_mail@email.com.',
            password: 'Password',
            passwordHelperText: 'In order to send the password to the server, the password format must be entered correctly. We check the acceptable format before sending.',
            captchaHelperText: 'Captcha must be verified.',
            login: 'Login',
        },
        registerTab: {
            title: 'Register',
            email: 'Email',
            emailHelperText: 'An example would be: e_mail@email.com.',
            password: 'Password',
            passwordHelperText: "Passwords should contain a minimum of eight characters, including at least one capital letter, one number, and one symbol. For example: 'Password_1'.",
            confirmPassword: 'Password confirmation',
            confirmPasswordHelperText: 'The password confirmation should be the same as the password entered.',
            captchaHelperText: 'Captcha must be verified.',
            register: 'Register',
        },
        captchaProviderError: 'There has been an error with the captcha provider, perhaps from an internet disturbance. We recommend waiting a few seconds or reopening this dialog box if the captcha does not appear or does not work correctly.',
    }
};

export default English;