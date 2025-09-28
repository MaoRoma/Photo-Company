import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ja' : 'en');
  };

  const t = (key) => {
    const translations = {
      en: {
        // Navigation
        home: 'Home',
        services: 'Services',
        gallery: 'Gallery',
        findPhotos: 'Find My Photos',
        about: 'About',
        contact: 'Contact',
        admin: 'Admin',
        
        // Hero Section
        heroTitle: 'Capture Memories, Print Forever',
        heroSubtitle: 'Professional photo sessions with high-quality prints and digital downloads for your social media',
        ourServices: 'OUR SERVICES',
        viewGallery: 'VIEW GALLERY',
        
        // Search Section
        findYourPhotos: 'Find Your Photos',
        searchSubtitle: 'Search for your photos using your session ID',
        enterSessionId: 'Enter your Session ID',
        search: 'Search',
        yourPhotos: 'Your Photos',
        professionalPortrait: 'Professional Portrait',
        watermarkedPreview: 'Watermarked Preview',
        view: 'View',
        purchasePhoto: 'Purchase Photo',
        choosePackage: 'Choose Your Package',
        digitalDownload: 'Digital Download',
        highResJpg: 'High-resolution JPG',
        noWatermark: 'No watermark',
        perfectSocialMedia: 'Perfect for social media',
        instantDownload: 'Instant download',
        purchaseDigital: 'Purchase Digital',
        
        // Admin
        dashboard: 'Dashboard',
        uploadPhotos: 'Upload Photos',
        manageSessions: 'Manage Sessions',
        customers: 'Customers',
        viewWebsite: 'View Website',
        totalCustomers: 'Total Customers',
        totalPhotos: 'Total Photos',
        totalSales: 'Total Sales',
        sessionsThisMonth: 'Sessions This Month',
        uploadCustomerPhotos: 'Upload Customer Photos',
        sessionId: 'Session ID',
        enterSessionIdPlaceholder: 'Enter Session ID (e.g., SESS001)',
        clickToUpload: 'Click to upload photos or drag and drop',
        supportsFormats: 'Supports: JPG, PNG, HEIC',
        uploadSession: 'UPLOAD SESSION',
        clearForm: 'CLEAR FORM',
        photoSessions: 'Photo Sessions',
        id: 'ID',
        date: 'Date',
        photos: 'Photos',
        status: 'Status',
        actions: 'Actions',
        active: 'ACTIVE',
        completed: 'COMPLETED',
        noSessionsFound: 'No sessions found.',
        noCustomersFound: 'No customers found.',
        
        // About Section
        aboutTitle: 'About PhotoPrint Pro',
        aboutDescription: 'We are a professional photography company dedicated to capturing your precious moments and providing you with both physical prints and digital downloads for your social media needs.',
        aboutServiceIntro: 'Our unique service allows you to:',
        aboutService1: 'Get professional photo sessions',
        aboutService2: 'Receive high-quality printed photos',
        aboutService3: 'Purchase digital versions for social media',
        aboutService4: 'Access your photos through our secure platform',
        
        // Services Section
        service1Title: 'Professional Photo Sessions',
        service1Description: 'High-quality photography sessions in our studio or on location. Perfect for portraits, events, and special occasions.',
        service2Title: 'Premium Photo Prints',
        service2Description: 'Get your photos printed on high-quality paper with various sizes and finishes available.',
        service3Title: 'Digital Downloads',
        service3Description: 'Purchase your photos in high-resolution JPG format for social media sharing without watermarks.',
        
        // Gallery Section
        photoGallery: 'Photo Gallery',
        gallerySubtitle: 'Browse our collection of professional photos (watermarked previews)',
        findThisPhoto: 'Find This Photo',
        
        // Contact Section
        contactUs: 'Contact Us',
        address: 'Address',
        addressDetails: '123 Photography Street\nStudio City, CA 90210',
        phone: 'Phone',
        phoneNumber: '(555) 123-4567',
        email: 'Email',
        emailAddress: 'info@photoprintpro.com',
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        yourMessage: 'Your Message',
        sendMessage: 'Send Message',
        
        // Upload Section
        uploading: 'Uploading...',
        
        // Payment Status
        paymentStatus: 'Payment Status',
        
        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        yes: 'Yes',
        no: 'No'
      },
      ja: {
        // Navigation
        home: 'ホーム',
        services: 'サービス',
        gallery: 'ギャラリー',
        findPhotos: '写真を探す',
        about: '会社概要',
        contact: 'お問い合わせ',
        admin: '管理画面',
        
        // Hero Section
        heroTitle: '思い出を撮影し、永遠にプリント',
        heroSubtitle: '高品質なプリントとSNS用デジタルダウンロード付きのプロフェッショナル写真撮影',
        ourServices: 'サービス一覧',
        viewGallery: 'ギャラリーを見る',
        
        // Search Section
        findYourPhotos: '写真を探す',
        searchSubtitle: 'セッションIDを使用して写真を検索',
        enterSessionId: 'セッションIDを入力',
        search: '検索',
        yourPhotos: 'あなたの写真',
        professionalPortrait: 'プロフェッショナルポートレート',
        watermarkedPreview: '透かし入りプレビュー',
        view: '表示',
        purchasePhoto: '写真を購入',
        choosePackage: 'パッケージを選択',
        digitalDownload: 'デジタルダウンロード',
        highResJpg: '高解像度JPG',
        noWatermark: '透かしなし',
        perfectSocialMedia: 'SNSに最適',
        instantDownload: '即座にダウンロード',
        purchaseDigital: 'デジタル購入',
        
        // Admin
        dashboard: 'ダッシュボード',
        uploadPhotos: '写真アップロード',
        manageSessions: 'セッション管理',
        customers: '顧客',
        viewWebsite: 'ウェブサイトを見る',
        totalCustomers: '総顧客数',
        totalPhotos: '総写真数',
        totalSales: '総売上',
        sessionsThisMonth: '今月のセッション',
        uploadCustomerPhotos: '顧客写真をアップロード',
        sessionId: 'セッションID',
        enterSessionIdPlaceholder: 'セッションIDを入力 (例: SESS001)',
        clickToUpload: '写真をアップロードするかドラッグ&ドロップ',
        supportsFormats: '対応形式: JPG, PNG, HEIC',
        uploadSession: 'セッションをアップロード',
        clearForm: 'フォームをクリア',
        photoSessions: '写真セッション',
        id: 'ID',
        date: '日付',
        photos: '写真',
        status: 'ステータス',
        actions: 'アクション',
        active: 'アクティブ',
        completed: '完了',
        noSessionsFound: 'セッションが見つかりません。',
        noCustomersFound: '顧客が見つかりません。',
        
        // About Section
        aboutTitle: 'PhotoPrint Proについて',
        aboutDescription: '私たちは、あなたの大切な瞬間を捉え、物理的なプリントとSNS用のデジタルダウンロードの両方を提供するプロフェッショナル写真会社です。',
        aboutServiceIntro: '私たちのユニークなサービスでは、以下のことができます：',
        aboutService1: 'プロフェッショナルな写真撮影を受ける',
        aboutService2: '高品質なプリント写真を受け取る',
        aboutService3: 'SNS用のデジタル版を購入する',
        aboutService4: 'セキュアなプラットフォームを通じて写真にアクセスする',
        
        // Services Section
        service1Title: 'プロフェッショナル写真撮影',
        service1Description: 'スタジオまたはロケーションでの高品質な写真撮影。ポートレート、イベント、特別な機会に最適です。',
        service2Title: 'プレミアム写真プリント',
        service2Description: '高品質な紙に様々なサイズと仕上げで写真をプリントできます。',
        service3Title: 'デジタルダウンロード',
        service3Description: '透かしなしの高解像度JPG形式でSNS共有用の写真を購入できます。',
        
        // Gallery Section
        photoGallery: '写真ギャラリー',
        gallerySubtitle: 'プロフェッショナル写真のコレクションを閲覧（透かし入りプレビュー）',
        findThisPhoto: 'この写真を探す',
        
        // Contact Section
        contactUs: 'お問い合わせ',
        address: '住所',
        addressDetails: '123 Photography Street\nStudio City, CA 90210',
        phone: '電話',
        phoneNumber: '(555) 123-4567',
        email: 'メール',
        emailAddress: 'info@photoprintpro.com',
        yourName: 'お名前',
        yourEmail: 'メールアドレス',
        yourMessage: 'メッセージ',
        sendMessage: 'メッセージを送信',
        
        // Upload Section
        uploading: 'アップロード中...',
        
        // Payment Status
        paymentStatus: '支払い状況',
        
        // Common
        loading: '読み込み中...',
        error: 'エラー',
        success: '成功',
        cancel: 'キャンセル',
        confirm: '確認',
        close: '閉じる',
        save: '保存',
        edit: '編集',
        delete: '削除',
        yes: 'はい',
        no: 'いいえ'
      }
    };

    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
