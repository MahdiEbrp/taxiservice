
const Persian = {
    settings: {
        displayName: 'فارسی',
        code: 'fa',
        direction: 'rtl',
        listStyle: 'arabic-indic'
    },
    sidebar: {
        agenciesManagement: 'مدیریت آژانس ها',
        addNewAgency: 'افزودن آژانس جدید',
        editAgency: 'ویرایش آژانس',
        home: 'خونه',
        messages: 'پیام ها',
        payments: 'پرداخت ها',
        personnel: 'پرسنل',
        services: 'سرویس ها',
        settings: 'تنظیمات',
        support: 'پشتیبانی',
        trips: 'سفرها',
    },
    languageDialog: {
        title: 'زبانی را که می خواهید استفاده کنید انتخاب کنید.',
        save: 'ذخیره',
        discard: 'بی خیال',
    },
    notification: {
        changedLanguage: 'تغییر زبان با موفقیت اعمال شد.',
        darkModeDisabled: 'حالت تاریک غیرفعال شده است.',
        darkModeEnabled: 'حالت تاریک فعال شده است.',
        incorrectFormat:'اطلاعات با فرمت اشتباه وارد شد!',
        invalidCaptchaFormat: 'فرمت کپچا نادرست است.',
        invalidConfirmPassword: 'بین تایید رمز عبور و رمز عبور وارد شده تفاوت وجود دارد!',
        invalidEmailFormat: 'فرمت ایمیل نادرست است.',
        invalidPasswordFormat: 'فرمت رمز عبور نادرست است.',
        selectAgency: 'لطفا یک آژانس انتخاب کنید.',
        selectCountry: 'لطفا یک کشور انتخاب کنید.',
        successfullyLogin: 'تبریک می گویم، شما با موفقیت وارد سیستم شدید.',
        unauthenticated: 'شما وارد سیستم نشده اید!',
    },
    authorizedLayout: {
        loading: 'در حال بارگذاری...',
        redirectingToHomePage: 'در حال تغییر به صفحه اصلی...',
    },
    components: {
        imageLoaderError: 'تصویر بارگذاری نشد.کلمات کلیدی:',
        noOptionsText:'نتیجه ای یافت نشد!',
    },
    responseError: {
        CredentialsSignin: 'نام کاربری یا رمز عبور وارد شده اشتباه است.',
        ERR_EMAIL_EXISTS: 'شما قبلاً یک حساب کاربری با این آدرس ایمیل دارید. لطفا وارد شوید.',
        ERR_EMAIL_NOT_FOUND: 'هیچ کاربری با این آدرس ایمیل پیدا نکردیم!',
        ERR_INTERNAL_UPDATE: 'یک مشکل سرور مانع از ویرایش اطلاعات می‌شود. اگر فکر می کنید به رفع مشکل کمک می کند، لطفاً با ما تماس بگیرید.',
        ERR_INVALID_CAPTCHA: 'کپچا نامعتبر است.',
        ERR_INVALID_CODE: 'کد درخواستی وجود ندارد یا نامعتبر است!',
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
            message: 'اکنون می توانید رمز عبور خود را بازنشانی کنید. یک ایمیل با لینک بازنشانی برای شما ارسال شده است. ممکن است آن را در پوشه هرزنامه خود پیدا کنید (فراموش نکنید آن را بررسی کنید).',
        },
    },
    agenciesPage: {
        title:'مدیریت آژانس ها',
        next: 'بعدی',
        preparing: 'در حال آماده سازی...',
        agencyName: 'نام آژانس',
        editAgency: {
            localization: 'بومی سازی',
            localizationWarning:'بومی سازی به دسترسی دقیق‌تر به داده‌ها کمک می‌کند، بنابراین لطفاً آن را با دقت انتخاب کنید.',
            agencyMainPhoneNumber: 'شماره تلفن اصلی آژانس',
            agencySecondaryPhoneNumber:'شماره تلفن دوم آژانس (ضروری نیست).',
            agencySelection: 'انتخاب آژانس',
            editPhone: 'ویرایش شماره تلفن',
            title: 'ویرایش آژانس',
            phoneNumberPlaceholder1: 'شماره تلفن محل کار 1',
            phoneNumberPlaceholder2: 'شماره تلفن محل کار 2',
            mobileNumberPlaceholder: 'شماره تلفن همراه',
            mobileNumberVisibility: 'سایر افراد نمی توانند شماره تلفن همراه شما را ببینند.',
            phoneNumbersError: 'داشتن شماره تلفن محل کار و شماره تلفن همراه ضروری است! (شماره تلفن ها باید حداقل 10 رقم باشند)',
            editAddress: 'ویرایش آدرس',
        },
        addNewAgency: {
            title: 'افزودن آژانس جدید',
        },
    },
    pageNotFound: {
        title: 'صفحه مورد نظر وجود ندارد!',
        error404: 'خطای 404',
        message: 'هوم... انگار گم شدی یا راه را اشتباه رفتی! جای نگرانی نیست، من به سمت خونه هدایتت میکنم. اوقات خوبی داشته باشی.',
        returnHome: 'بازگشت به خونه',
        redirectingToHomePage: 'در حال انتقال به صفحه اصلی...',
        imageAlt: 'نقشه 404 پیدانشد گم شده',
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
    resetPasswordPage: {
        expiredMessage: 'شما از لینک منقضی شده استفاده کرده اید. یک ایمیل جدید برای شما ارسال شده است. (مطمئن شوید که پوشه اسپم شما بررسی شده است.)',
        loading: 'در حال بازنشانی کلمه عبور...',
        operationSuccess: 'تبریک!',
        redirectingToHomePage: 'در حال تغییر مسیر به صفحه اصلی...',
        resetPassword: 'تغییر کلمه عبور',
        return: 'بازگشت',
        successMessage: 'کلمه عبور شما با موفقیت تغییر کرد. اکنون می توانید به حساب کاربری خود دسترسی داشته باشید و از ویژگی های سایت استفاده کنید. برای بازگشت به صفحه اصلی روی "بازگشت" کلیک کنید.',
        successToastMessage: 'بازنشانی کلمه عبور با موفقیت انجام شد.',
        title: 'بازنشانی کلمه عبور',
    },
    loginDialog: {
        title: 'وارد شوید یا ثبت نام کنید',
        loginTab: {
            title: 'ورود',
            passwordHelperText: 'برای ارسال رمز عبور به سرور، فرمت رمز عبور باید به درستی وارد شود.ما قبل از ارسال فرمت قابل قبول را بررسی می کنیم.',
            login: 'ورود',
            resetPassword: 'تنظیم مجدد رمز عبور',
            forgetPassword: 'اگر رمز عبور خود را فراموش کردید روی دکمه "تنظیم مجدد رمز عبور" کلیک کنید.'

        },
        registerTab: {
            title: 'ثبت نام',
            register: 'ثبت نام',
        },
        userInformation: {
            title: 'اطلاعات کاربری',
        },
    },
    submitForm: {
        captchaHelperText: 'کپچا باید تایید شود.',
        captchaProviderError: 'مشکلی در ارائه دهنده کپچا رخ داده است، شاید به دلیل اختلال در اینترنت. توصیه می کنیم در صورتی که کپچا ظاهر نشد یا درست کار نکرد، چند ثانیه صبر کنید یا این کادر محاوره ای را دوباره باز کنید.',
        confirmNewPassword: 'تایید رمز عبور جدید',
        confirmPassword: 'تایید رمز عبور',
        confirmPasswordHelperText: 'تایید رمز عبور باید همان رمز عبور وارد شده باشد.',
        email: 'ایمیل',
        emailHelperText: 'به عنوان مثال: e_mail@email.com.',
        newPassword: 'رمز عبور جدید',
        password: 'رمز عبور',
        passwordHelperText: "رمز عبور باید حداقل شامل هشت کاراکتر، شامل حداقل یک حرف بزرگ، یک عدد و یک نماد باشد. به عنوان مثال: 'Password_1'.",
    }
};
export default Persian;