
const Persian = {
    settings: {
        displayName: 'فارسی',
        code: 'fa',
        rightToLeft: true,
    },
    sidebar: {
        home: 'خونه',
        services: 'سرویس ها',
        support: 'پشتیبانی',
    },
    languageDialog: {
        title: 'زبانی را که می خواهید استفاده کنید انتخاب کنید.',
        save: 'ذخیره',
        discard: 'بی خیال',
    },
    responseError: {
        ERR_UNKNOWN: 'یک خطای ناشناخته رخ داده است.',
        ERR_EMAIL_EXISTS: 'شما قبلاً یک حساب کاربری با این آدرس ایمیل دارید. لطفا وارد شوید.',
        ERR_INVALID_CAPTCHA: 'کپچا نامعتبر است.',
        ERR_INVALID_FORMAT: 'فرمت ارسال اطلاعات صحیح نیست.',
        ERR_INVALID_METHOD: 'روش ارسال اطلاعات صحیح نیست.',
        ERR_POST_DATA: 'داده های ارسالی صحیح نیستند.',
        ERR_UNKNOWN_CREATING_USER: 'یک خطای ناشناخته در هنگام ساخت حسای کاربری رخ داده است.',
        ERR_SERVICE_UNAVAILABLE: 'سرویس در دسترس نیست.',
    },
    notification: {
        darkModeEnabled: 'حالت تاریک فعال شده است.',
        darkModeDisabled: 'حالت تاریک غیرفعال شده است.',
        changedLanguage: 'تغییر زبان با موفقیت اعمال شد.',
        invalidEmailFormat: 'فرمت ایمیل نادرست است.',
        invalidPasswordFormat: 'فرمت رمز عبور نادرست است.',
        invalidConfirmPassword: 'بین تایید رمز عبور و رمز عبور وارد شده تفاوت وجود دارد!',
        invalidCaptchaFormat: 'فرمت کپچا نادرست است.',
    },
    messageDialog: {
        ok: 'تایید',
        userCreatedSuccessfully: {
            title: 'تبریک!',
            message: 'حساب کاربری شما با موفقیت ایجاد شد. لطفاً ایمیل خود را برای فعال سازی حساب خود بررسی کنید.',
        }
    },
    loginDialog: {
        title: 'وارد شوید یا ثبت نام کنید',
        loginTab: {
            title:'ورود',
            email: 'ایمیل',
            emailHelperText: 'به عنوان مثال: e_mail@email.com.',
            password: 'رمز عبور',
            passwordHelperText: 'برای ارسال رمز عبور به سرور، فرمت رمز عبور باید به درستی وارد شود.ما قبل از ارسال فرمت قابل قبول را بررسی می کنیم.',
            captchaHelperText: 'کپچا باید تایید شود.',
            login: 'ورود',
        },
        registerTab: {
            title: 'ثبت نام',
            email: 'ایمیل',
            emailHelperText: 'به عنوان مثال: e_mail@email.com.',
            password: 'رمز عبور',
            passwordHelperText: "رمز عبور باید حداقل شامل هشت کاراکتر، شامل حداقل یک حرف بزرگ، یک عدد و یک نماد باشد. به عنوان مثال: 'Password_1'.",
            confirmPassword: 'تایید رمز عبور',
            confirmPasswordHelperText: 'تایید رمز عبور باید همان رمز عبور وارد شده باشد.',
            captchaHelperText: 'کپچا باید تایید شود.',
            register: 'ثبت نام',
        },
        captchaProviderError:'مشکلی در ارائه دهنده کپچا رخ داده است، شاید به دلیل اختلال در اینترنت. توصیه می کنیم در صورتی که کپچا ظاهر نشد یا درست کار نکرد، چند ثانیه صبر کنید یا این کادر محاوره ای را دوباره باز کنید.',
    }
};
export default Persian;