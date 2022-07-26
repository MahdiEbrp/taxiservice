
const traditionalChinese = {
    settings: {
        displayName: '繁体中文(Traditional Chinese)',
        code: 'zh-TW',
        direction: 'ltr',
        listStyle: 'decimal',
        days: ['星期日', '周一', '周二', '周三', '周四', '星期五', '周六'],
    },
    sidebar: {
        agenciesManagement: '机构管理',
        addNewAgency: '添加新代理',
        editAgency: '编辑机构',
        home: '家',
        messages: '留言',
        payments: '付款',
        personnel: '人员',
        services: '服务',
        settings: '设置',
        support: '支持',
        trips: '旅行',
        jobRequests: '工作请求',
        managePersonnel: '管理人员',
    },
    languageDialog: {
        title: '选择您要使用的语言。',
        save: '节省',
        discard: '丢弃',
    },
    userInformationDialog: {
        signOut: '登出',
        emailAddress: '電子郵件地址',
        settingsNotFound: '抱歉，我們無法從服務器獲取我們請求的信息。',
        leaving: '遺憾的是，我必須說再見...',
        accountType: '帳戶類型',
        localization: '本土化',
    },
    notification: {
        addressError: '輸入了短地址或未選擇地圖上的位置。',
        agencyDuplicateError: '已經有一個同名的機構。',
        changedLanguage: '語言更改已成功應用。',
        currentEmailFormatError: '當前的電子郵件格式不正確。',
        currentPasswordFormatError: '當前密碼格式不正確。',
        darkModeDisabled: '暗模式已停用。',
        darkModeEnabled: '暗模式已啟動。',
        emailNotSet: '未設置電子郵件地址。',
        endDateError: '在工作時間內，結束時間必須晚於開始時間。',
        incorrectFormat: '輸入了格式錯誤的信息！',
        invalidCaptchaFormat: '驗證碼格式不正確。',
        invalidConfirmPassword: '確認密碼和輸入密碼是有區別的！',
        invalidEmailFormat: '電子郵件格式不正確。',
        invalidPasswordFormat: '密碼格式不正確。',
        invalidWorkingHoursTab: '沒有選定的日期或開始時間大於結束時間。',
        localizationEmpty: '從列表中選擇一個國家。',
        nameIsTooShort: '請輸入至少包含三個字符的名稱！',
        newEmailFormatError: '新的電子郵件格式不正確。',
        newEmailSameAsCurrent: '當前電子郵件和新電子郵件不能相同。',
        newPasswordFormatError: '新密碼格式不正確。',
        newPasswordSameAsCurrent: '當前密碼和新密碼不能相同。',
        passwordNotMatch: '新密碼和確認密碼不匹配。',
        emailNotMatch: '新電子郵件和確認電子郵件不匹配。',
        profilePictureEmpty: '請選擇個人資料圖片。',
        selectAgency: '未選擇機構或機構名稱為空。',
        selectCountry: '請選擇一個國家。',
        startDateError: '在工作時間內，開始時間必須早於結束時間。',
        successfullyAddAgency: '做得好！ 您已成功創建代理機構。',
        successfullyChangePassword: '做得好！ 您已成功更改密碼。',
        successfullyChangeEmail: '做得好！ 您已成功更改電子郵件。請重新登錄。',
        successfullyEditAgency: '做得好！ 您已成功編輯該機構。',
        successfullyEditUser: '做得好！ 您已成功編輯該用戶。',
        successfullyLogin: '恭喜，您已成功登錄。',
        unauthenticated: '你沒有登錄！',
        currentEmailError: '您輸入的電子郵件地址不是您當前的電子郵件地址。',

    },
    authorizedLayout: {
        loading: '正在加載...',
        redirectingToHomePage: '正在重定向到主頁...',
    },
    components: {
        imageLoaderError: '圖像未正確加載。關鍵字：',
        noOptionsText: '未找到結果！',
        loadingText: '正在加載...',
        locations: '地點',
        currentLocation: '您當前的地理位置：',
        requestAgain: '再次請求',
        errorLoading: '我們無法獲得您要求的信息。 點擊下方按鈕再次申請。',
        dataGrid: {
            noData: '沒有數據顯示。',
            rowSelected: '選擇的行',
            rowsSelected: '選定的行',
            of: '的',
        },

    },
    responseError: {
        CredentialsSignin: '您輸入的用戶名或密碼不正確。',
        ERR_AGENCY_DUPLICATE: '機構名稱已被使用。',
        ERR_EMAIL_EXISTS: '您已經有一個使用此電子郵件地址的帳戶。 請登錄。',
        ERR_EMAIL_NOT_FOUND: '我們找不到任何使用此電子郵件地址的用戶！',
        ERR_INTERNAL_UPDATE: '服務器問題導致無法編輯信息。 如果您認為這將有助於解決問題，請與我們聯繫。',
        ERR_INVALID_CAPTCHA: '驗證碼無效。',
        ERR_INVALID_CODE: '沒有請求代碼或無效！',
        ERR_INVALID_EMAIL: '電子郵件地址無效。',
        ERR_INVALID_FORMAT: '提交的格式不正確。',
        ERR_INVALID_METHOD: '提交的方法不正確',
        ERR_INVALID_PASSWORD: '服務器沒有提供正確的響應。',
        ERR_INVALID_REQUEST: '服務器沒有提供正確的響應。',
        ERR_NULL_RESPONSE: '服務器沒有提供正確的響應。',
        ERR_POST_DATA: '數據不正確。',
        ERR_REQUEST_EXPIRED: '提交您的請求為時已晚。',
        ERR_SAME_EMAIL: '新電子郵件和當前電子郵件不能相同。',
        ERR_SAME_PASSWORD: '新密碼和當前密碼不能相同。',
        ERR_SERVER_INVALID_CAPTCHA: '服務器中的驗證碼不會接受您的請求。',
        ERR_SERVICE_UNAVAILABLE: '服務不可用。',
        ERR_TOO_MANY_REQUESTS: '向服務器發送的請求過多。 請稍後再試。',
        ERR_UNAUTHORIZED: '您無權訪問此頁面。',
        ERR_UNAUTHORIZED_EMAIL: '您輸入的電子郵件地址不是您當前的電子郵件地址。',
        ERR_UNKNOWN: '出現未知錯誤。',
        ERR_UNKNOWN_AUTHORIZING_USER: '授權用戶時發生未知錯誤。',
        ERR_UNKNOWN_CREATING_USER: '創建用戶時發生未知錯誤。',
        ERR_UPDATE_FAILS: '信息更新因錯誤而中斷。',
        ERR_USER_NOT_FOUND: '找不到用戶。',
        ERR_USER_NOT_VERIFIED: '用戶未通過驗證。',
        HTML_ERROR_404: '您要查找的頁面不存在。',
        UNACCEPTABLE_EMAIL: '新的電子郵件地址是不可接受的，因為它已經在使用中。'
    },
    messageDialog: {
        ok: '好的',
        userCreatedSuccessfully: {
            title: '恭喜！',
            message: '您的帳戶已成功創建。請檢查您的電子郵件以激活您的帳戶。 您可能會在垃圾郵件文件夾中找到它（不要忘記檢查它）。',
        },
        passwordReadyReset: {
            title: '讓我們重置！',
            message: '您現在可以重設密碼。 已向您發送一封帶有重置鏈接的電子郵件。 您可能會在垃圾郵件文件夾中找到它（不要忘記檢查它）。',
        },
    },
    advanceSettingsDialog: {
        title: '高級設置',
        password: '密碼',
        email: '電子郵件',
        updatingPassword: '正在更新密碼...',
        updatingEmail: '正在更新電子郵件...',
        loading: '正在加載...',
        updateAndLogin: '更新和註銷',
        emailUpdateInfo: '警告！ 如果您更改電子郵件，您將被註銷，您需要使用新電子郵件重新登錄。',
    },
    profilePictureDialog: {
        title: '頭像選擇',
        description: '為您的帳戶選擇個人資料圖片。',
        save: '節省',
        discard: '丟棄',
    },
    agenciesPage: {
        fetchingAgencies: '從服務器接收信息...',
        activeAgency: '該機構很活躍。',
        addressOfBusiness: '您的公司地址',
        addressWarning: '地址應準確完整地輸入。',
        agencyMainPhoneNumber: '機構主要電話號碼。',
        agencyName: '機構名稱',
        agencySecondaryPhoneNumber: '代理商的第二個電話號碼（不是必需的）。',
        agencySelection: '機構選擇',
        businessLocation: '查找您的營業地點：',
        editAddress: '編輯地址',
        editPhone: '編輯電話',
        endOfWorkingHours: '下班時間',
        inactiveAgency: '該機構處於非活動狀態。',
        localization: '本土化',
        mobileNumberPlaceholder: '手機號碼',
        mobileNumberVisibility: '其他人看不到您的手機號碼。',
        next: '下一個',
        previous: '以前的',
        add: '添加',
        update: '更新',
        phoneNumberPlaceholder1: '工作電話號碼 1',
        phoneNumberPlaceholder2: '工作電話號碼 2',
        phoneNumbersError: '必須要有工作號和手機號！（電話號碼必須至少有 10 位數字）',
        preparing: '準備...',
        startOfWorkingHours: '開始工作時間',
        title: '機構管理',
        workingHours: '工作時間',
        maximumLengthOfAgencyName: '機構名稱的最大長度為50個字符。',
        editAgency: {
            title: '編輯機構',
            updating: '正在更新代理...',
        },
        addNewAgency: {
            title: '添加新代理',
            updating: '添加新代理...',
        },
    },
    jobRequestsPage: {
        title: '工作請求',
        loading: '正在加載...',
        receivingJobRequests: '正在接收工作請求...',
        agencyName: '機構名稱',
        status: '地位',
        sent: '發送',
        accepted: '公認',
        notSent: '未發送',
        reload: '重新加載',
    },
    settingsPage: {
        title: '設置',
        fullName: '全名',
        fullNameDescription: '請輸入您的全名。',
        profilePictureDescription: '您可以通過單擊更改您的個人資料圖片。',
        advancedSettingsDescription: '要更改您的密碼和電子郵件地址，請單擊“高級設置”。',
        advancedSettings: '高級設置',
        localization: '本土化',
        localizationWarning: '本地化有助於更準確地獲取數據，因此請謹慎選擇。',
        save: '節省',
        loading: '加載設置...',
        customer: '顧客',
        personnel: '人員',
        entrepreneur: '企業家',
        customerAccess: '請求旅行或查看以前的旅行',
        personnelAccess: '申請工作並接受旅行優惠',
        entrepreneurAccess: '訪問所有機構和人事活動',
        selectAccountType: '選擇用戶帳戶類型：',
    },
    pageNotFound: {
        title: '網頁未找到！',
        error404: '錯誤 404',
        message: '嗯...看起來你迷路了或走錯路了！ 沒什麼好擔心的，我帶你回家。玩得開心。',
        returnHome: '回家',
        redirectingToHomePage: '正在重定向到主頁...',
        imageAlt: '地圖 404 未找到 丟失',
    },
    emailVerificationPage: {
        title: '電子郵件驗證',
        loading: '正在驗證您的帳戶...',
        operationFail: '帳戶驗證過程失敗。',
        reason: '原因：',
        problems: {
            internetConnection: '確保您的互聯網連接正常。',
            emailExpired: '正確的代碼將通過電子郵件發送給您。（確保檢查了您的垃圾郵件文件夾。）',
            networkChanged: '您可以通過單擊“重新發送”按鈕重新發送請求。',
            serverError: '如果這些方法都不起作用，請聯繫系統管理員。',
        },
        resend: '重發',
        return: '返回',
        operationSuccess: '恭喜！',
        successMessage: '帳戶驗證已成功完成。 您現在可以訪問您的帳戶並使用該站點的功能。要返回主頁，請單擊“返回”按鈕。',
        redirectingToHomePage: '正在重定向到主頁...',
    },
    resetPasswordPage: {
        expiredMessage: '您使用了過期的鏈接。 一封新郵件已通過電子郵件發送給您。 （確保檢查了您的垃圾郵件文件夾。）',
        loading: '正在重置密碼...',
        operationSuccess: '恭喜！',
        redirectingToHomePage: '正在重定向到主頁...',
        resetPassword: '重設密碼',
        return: '返回',
        successMessage: '你的密碼已成功更改。 您現在可以訪問您的帳戶並使用該站點的功能。單擊“返回”返回主頁面。',
        successToastMessage: '密碼重置過程已成功完成。',
        title: '重設密碼',
    },
    loginDialog: {
        title: '登錄或註冊',
        loginTab: {
            title: '登錄',
            passwordHelperText: '為了將密碼發送到服務器，必須正確輸入密碼格式。 我們在發送前檢查可接受的格式。',
            login: '登錄',
            resetPassword: '重設密碼',
            forgetPassword: '如果您忘記了密碼，請單擊“重置密碼”按鈕。',
        },
        registerTab: {
            title: '登記',
            register: '登記',
        },
        userInformation: {
            title: '用戶信息',

        }
    },
    submitForm: {
        captchaHelperText: '驗證碼必須經過驗證。',
        captchaProviderError: '驗證碼提供商出現錯誤，可能是由於互聯網干擾。 如果驗證碼未出現或無法正常工作，我們建議您等待幾秒鐘或重新打開此對話框。',
        confirmEmail: '確認電子郵件',
        confirmNewPassword: '確認新密碼',
        confirmPassword: '確認密碼',
        confirmPasswordHelperText: '密碼確認應與輸入的密碼相同。',
        currentEmail: '當前的電子郵件',
        currentPassword: '當前密碼',
        currentPasswordHelperText: '輸入當前密碼。',
        email: '電子郵件',
        emailHelperText: '例如：e_mail@email.com。',
        newEmail: '新郵件',
        newPassword: '新密碼',
        password: '密碼',
        passwordHelperText: "密碼至少應包含八個字符，包括至少一個大寫字母、一個數字和一個符號。 例如：“Password_1”。",
        update: '更新',
        confirmEmailHelperText: '電子郵件確認應與輸入的電子郵件相同。',
        currentEmailHelperText: '輸入您當前的電子郵件。',

    }
};

export default traditionalChinese;
