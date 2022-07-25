
const Persian = {
    settings: {
        displayName: 'فارسی',
        code: 'fa',
        rightToLeft: true,
        listStyle:'arabic-indic'
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
    notification: {
        darkModeEnabled: 'حالت تاریک فعال شده است.',
        darkModeDisabled: 'حالت تاریک غیرفعال شده است.',
        changedLanguage: 'تغییر زبان با موفقیت اعمال شد.',
        invalidEmailFormat: 'فرمت ایمیل نادرست است.',
        invalidPasswordFormat: 'فرمت رمز عبور نادرست است.',
        invalidConfirmPassword: 'بین تایید رمز عبور و رمز عبور وارد شده تفاوت وجود دارد!',
        invalidCaptchaFormat: 'فرمت کپچا نادرست است.',
        successfullyLogin: 'تبریک می گویم، شما با موفقیت وارد سیستم شدید.',
    },
    responseError: {
        CredentialsSignin: 'نام کاربری یا رمز عبور وارد شده اشتباه است.',
        ERR_EMAIL_EXISTS: 'شما قبلاً یک حساب کاربری با این آدرس ایمیل دارید. لطفا وارد شوید.',
        ERR_EMAIL_NOT_FOUND: 'هیچ کاربری با این آدرس ایمیل پیدا نکردیم!',
        ERR_INTERNAL_UPDATE: 'یک مشکل سرور مانع از ویرایش اطلاعات می‌شود. اگر فکر می کنید به رفع مشکل کمک می کند، لطفاً با ما تماس بگیرید.',
        ERR_INVALID_CAPTCHA: 'کپچا نامعتبر است.',
        ERR_INVALID_FORMAT: 'فرمت ارسال اطلاعات صحیح نیست.',
        ERR_INVALID_METHOD: 'روش ارسال اطلاعات صحیح نیست.',
        ERR_INVALID_REQUEST: 'درخواست نامعتبر است.',
        ERR_NULL_RESPONSE: 'سرور پاسخ درستی ارائه نکرد.',
        ERR_POST_DATA: 'داده های ارسالی صحیح نیستند.',
        ERR_REQUEST_EXPIRED: 'برای ارسال درخواستتان خیلی دیر است',
        ERR_SERVER_INVALID_CAPTCHA: 'اعتبار سنجی کپچا در سرور درخواست شما را نمی پذیرد.',
        ERR_SERVICE_UNAVAILABLE: 'سرویس در دسترس نیست.',
        ERR_UNKNOWN: 'یک خطای ناشناخته رخ داده است.',
        ERR_UNKNOWN_AUTHORIZING_USER: 'یک خطای ناشناخته در هنگام تایید حساب کاربری رخ داده است.',
        ERR_UNKNOWN_CREATING_USER: 'یک خطای ناشناخته در هنگام ساخت حسای کاربری رخ داده است.',
        ERR_USER_NOT_VERIFIED: 'کاربر تایید نشده است.',
        HTML_ERROR_404: 'صفحه ای که به دنبال آن هستید وجود ندارد.',
    },
    messageDialog: {
        ok: 'تایید',
        userCreatedSuccessfully: {
            title: 'تبریک!',
            message: 'حساب شما با موفقیت ایجاد شد. لطفاً ایمیل خود را بررسی کنید تا حساب خود را فعال کنید. ممکن است آن را در پوشه هرزنامه خود پیدا کنید (فراموش نکنید آن را بررسی کنید).',
        },
        passwordReadyReset: {
            title: 'بازنشانی کنیم!',
            message:'اکنون می توانید رمز عبور خود را بازنشانی کنید. یک ایمیل با لینک بازنشانی برای شما ارسال شده است. ممکن است آن را در پوشه هرزنامه خود پیدا کنید (فراموش نکنید آن را بررسی کنید).',
        },
    },
    emailVerificationPage: {
        title: 'تایید ایمیل',
        loading: 'در حال تأیید حساب شما...',
        operationFail: 'فرآیند تأیید حساب ناموفق بود.',
        reason: 'دلیل:',
        problems: {
            internetConnection: 'مطمئن شوید که اتصال اینترنت شما کار می کند.',
            emailExpired: 'کد صحیح برای شما ایمیل خواهد شد. (مطمئن شوید که پوشه اسپم شما بررسی شده است.)',
            networkChanged: 'با کلیک بر روی دکمه "ارسال مجدد" می توانید درخواست را مجددا ارسال کنید.',
            serverError: 'اگر هیچ یک از روش ها کار نکرد، با مدیر سیستم تماس بگیرید.',
        },
        resend: 'ارسال مجدد',
        return: 'بازگشت',
        operationSuccess: 'تبریک!',
        successMessage: 'تأیید حساب با موفقیت انجام شد. اکنون می توانید به حساب خود دسترسی داشته باشید و از ویژگی های سایت استفاده کنید. برای بازگشت به صفحه اصلی، روی دکمه "بازگشت" کلیک کنید.',
        redirectingToHomePage: 'در حال تغییر مسیر به صفحه اصلی...',
    },
    loginDialog: {
        title: 'وارد شوید یا ثبت نام کنید',
        loginTab: {
            title: 'ورود',
            email: 'ایمیل',
            emailHelperText: 'به عنوان مثال: e_mail@email.com.',
            password: 'رمز عبور',
            passwordHelperText: 'برای ارسال رمز عبور به سرور، فرمت رمز عبور باید به درستی وارد شود.ما قبل از ارسال فرمت قابل قبول را بررسی می کنیم.',
            captchaHelperText: 'کپچا باید تایید شود.',
            login: 'ورود',
            resetPassword: 'تنظیم مجدد رمز عبور',
            forgetPassword:'اگر رمز عبور خود را فراموش کردید روی دکمه "تنظیم مجدد رمز عبور" کلیک کنید.'

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
        captchaProviderError: 'مشکلی در ارائه دهنده کپچا رخ داده است، شاید به دلیل اختلال در اینترنت. توصیه می کنیم در صورتی که کپچا ظاهر نشد یا درست کار نکرد، چند ثانیه صبر کنید یا این کادر محاوره ای را دوباره باز کنید.',
    }
};
export default Persian;