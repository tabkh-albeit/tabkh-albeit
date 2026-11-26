export type CategoryId = 'rice' | 'appetizers' | 'salads' | 'sweets';

export interface DishItem {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  subtitle: string;
  image: string;
  fallbackTone: 'warm' | 'herb' | 'cocoa' | 'amber';
  fallbackMotif: 'pastry' | 'salad' | 'dessert';
}

export interface CategoryMeta {
  id: CategoryId;
  title: string;
  subtitle: string;
}

const img = (file: string) => `${import.meta.env.BASE_URL}src/assets/images/${file}`;

export const STORE_INFO = {
  brandName: 'طبخ البيت',
  tagline: 'لجميع المأكولات الشعبية',
  phoneDisplay: '053 922 7842',
  phoneWhatsapp: '966539227842',
  documentId: 'FL-025098438',
  verificationId: '0000198702',
  location: 'جدة - حي الواحة - مخطط السندس',
  email: 'tabkhalbeit@gmail.com',
  deliveryNote: 'يوجد لدينا توصيل لجميع أنحاء جدة',
  heroImage: img('hero_arabic_feast_1795506676463.jpg'),
} as const;

export const PAYMENT_INFO = {
  pageTitle: 'طرق الدفع والتحويل البنكي',
  bankName: 'مصرف الراجحي',
  accountHolder: 'روضه واصل خليل المغربي',
  accountNumber: '440000010006080043055',
  ibanDisplay: 'SA91 8000 0440 6080 1004 3055',
  ibanCompact: 'SA9180000440608010043055',
  swiftCode: 'RJHISARI',
  qrImage: `${import.meta.env.BASE_URL}assets/aistudio/WhatsApp_Image_2026-11-26_at_3.34.45_PM_fe36e42d.jpeg`,
} as const;

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'rice',
    title: 'أطباق الرز',
    subtitle: 'أطباق رئيسية محضرة بالبهارات الشعبية والأرز الفاخر',
  },
  {
    id: 'appetizers',
    title: 'الصواني والمقبلات',
    subtitle: 'صواني فرن طازجة ومعجنات ومقبلات منزلية مقرمشة',
  },
  {
    id: 'salads',
    title: 'السلطات',
    subtitle: 'سلطات طازجة محضرة يومياً بأجود الخضار والتتبيلات',
  },
  {
    id: 'sweets',
    title: 'الحلى',
    subtitle: 'حلويات شرقية وغربية بنكهات منزلية دافئة ومبردة',
  },
];

export const MENU_ITEMS: DishItem[] = [
  // أطباق الرز
  {
    id: 'kabuli-lamb',
    name: 'كابلي - لحم',
    category: 'rice',
    categoryLabel: 'أطباق الرز',
    subtitle: 'رز بسمتي عطري مطبوخ مع لحم طري، هيل، قرفة وزبيب، يُقدم مع مكسرات محمصة وبصل مقلي',
    image: img('dish_kabuli_lamb_1795506677925.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'pastry',
  },
  {
    id: 'chicken-biryani',
    name: 'برياني - دجاج',
    category: 'rice',
    categoryLabel: 'أطباق الرز',
    subtitle: 'رز عطري بطبقات مع دجاج متبل، زعفران وبصل مقلي، يُزين بكزبرة طازجة وكاجو',
    image: img('dish_chicken_biryani_1795506677994.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'pastry',
  },
  {
    id: 'bukhari-chicken',
    name: 'بخاري - دجاج',
    category: 'rice',
    categoryLabel: 'أطباق الرز',
    subtitle: 'رز بخاري تقليدي مع دجاج متبل، جزر، زبيب وتوابل دافئة، يُقدم مع لوز وبقدونس',
    image: img('dish_bukhari_chicken_1795506677850.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'pastry',
  },
  {
    id: 'sayadiyah-fish',
    name: 'صيادية - سمك',
    category: 'rice',
    categoryLabel: 'أطباق الرز',
    subtitle: 'رز مطبوخ مع بصل مكرمل وسمك أبيض طري، متبل بالقرفة والبهارات، يُزين بصنوبر وأعشاب',
    image: img('dish_sayadiyah_fish_1795506676895.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'pastry',
  },
  {
    id: 'koshari',
    name: 'كشري',
    category: 'rice',
    categoryLabel: 'أطباق الرز',
    subtitle: 'طبق مصري أصيل من الرز والعدس والمكرونة والحمص، مع صلصة طماطم حارة وبصل مقلي مقرمش',
    image: img('dish_koshari_1795506678655.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'pastry',
  },

  // الصواني والمقبلات
  {
    id: 'noodles',
    name: 'نودلز',
    category: 'appetizers',
    categoryLabel: 'الصواني والمقبلات',
    subtitle: 'نودلز بيتي بالخضار والصوص الخاص',
    image: img('dish_noodles_1795506679955.jpg'),
    fallbackTone: 'warm',
    fallbackMotif: 'pastry',
  },
  {
    id: 'bechamel',
    name: 'باشميل',
    category: 'appetizers',
    categoryLabel: 'الصواني والمقبلات',
    subtitle: 'معكرونة بالصوص الأبيض الكريمي والجبنة',
    image: img('dish_bechamel_1795506680186.jpg'),
    fallbackTone: 'warm',
    fallbackMotif: 'pastry',
  },
  {
    id: 'mahashi',
    name: 'محاشي خضار',
    category: 'appetizers',
    categoryLabel: 'الصواني والمقبلات',
    subtitle: 'كوسا، باذنجان وفلفل محشي بخلطة الأرز والخضار والتوابل',
    image: img('dish_mahashi_1795506679598.jpg'),
    fallbackTone: 'warm',
    fallbackMotif: 'pastry',
  },
  {
    id: 'fettuccine',
    name: 'فوتشيني',
    category: 'appetizers',
    categoryLabel: 'الصواني والمقبلات',
    subtitle: 'معكرونة فوتشيني بكريمة الطبخ والجبنة',
    image: img('dish_fettuccine_1795506679459.jpg'),
    fallbackTone: 'warm',
    fallbackMotif: 'pastry',
  },
  {
    id: 'toast-rolls',
    name: 'رولات التوست',
    category: 'appetizers',
    categoryLabel: 'الصواني والمقبلات',
    subtitle: 'توست محشي ومقلي — مقرمش من الخارج طري من الداخل',
    image: img('dish_toast_rolls_1795507270091.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'pastry',
  },
  {
    id: 'potato-balls',
    name: 'كرات بطاطس',
    category: 'appetizers',
    categoryLabel: 'الصواني والمقبلات',
    subtitle: 'بطاطس مهروسة متبلة، مقلية حتى تصبح ذهبية ومقرمشة',
    image: img('dish_potato_balls_1795506787314.jpg'),
    fallbackTone: 'warm',
    fallbackMotif: 'pastry',
  },
  {
    id: 'kibbeh-spring-rolls',
    name: 'كبة وسبرنغ رول',
    category: 'appetizers',
    categoryLabel: 'الصواني والمقبلات',
    subtitle: 'تشكيلة مقرمشة — كبة مقلية + سبرنغ رول بالخضار',
    image: img('dish_kibbeh_springroll_1795507269433.jpg'),
    fallbackTone: 'warm',
    fallbackMotif: 'pastry',
  },
  {
    id: 'manto-sambosa',
    name: 'منتو وسمبوسة وفرموزة',
    category: 'appetizers',
    categoryLabel: 'الصواني والمقبلات',
    subtitle: 'تشكيلة لذيذة — منتو على البخار + سمبوسة حارة + فرموزة باللحم أو الجبنة',
    image: img('dish_manto_sambosa_1795506680771.jpg'),
    fallbackTone: 'warm',
    fallbackMotif: 'pastry',
  },

  // السلطات
  {
    id: 'fatteh-grape-leaves',
    name: 'فتة ورق عنب',
    category: 'salads',
    categoryLabel: 'السلطات',
    subtitle: 'ورق عنب مطبوخ مع طبقة من الخبز المحمص والزبادي والصوص الطازج',
    image: img('dish_fatteh_grape_leaves_1795506728058.jpg'),
    fallbackTone: 'herb',
    fallbackMotif: 'salad',
  },
  {
    id: 'caesar',
    name: 'سلطة سيزر',
    category: 'salads',
    categoryLabel: 'السلطات',
    subtitle: 'خس طازج مع خبز محمص، جبنة بارميزان وصوص السيزر الكريمي',
    image: img('dish_caesar_1795507270157.jpg'),
    fallbackTone: 'herb',
    fallbackMotif: 'salad',
  },
  {
    id: 'tabbouleh',
    name: 'تبولة',
    category: 'salads',
    categoryLabel: 'السلطات',
    subtitle: 'بقدونس طازج، نعناع، برغل، خضار مقطعة وصوص ليمون وزيت زيتون',
    image: img('dish_tabbouleh_1795507270372.jpg'),
    fallbackTone: 'herb',
    fallbackMotif: 'salad',
  },
  {
    id: 'fattoush',
    name: 'فتوش',
    category: 'salads',
    categoryLabel: 'السلطات',
    subtitle: 'خضار موسمية طازجة مع خبز مقرمش وصوص دبس الرمان والليمون',
    image: img('dish_fattoush_1795506681579.jpg'),
    fallbackTone: 'herb',
    fallbackMotif: 'salad',
  },

  // الحلى
  {
    id: 'kunafa',
    name: 'كنافة',
    category: 'sweets',
    categoryLabel: 'الحلى',
    subtitle: 'كنافة نابلسية طازجة بالقشطة أو الجبن الساخن والقطر',
    image: img('dish_kunafa_1795507271822.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'dessert',
  },
  {
    id: 'om-ali',
    name: 'أم علي',
    category: 'sweets',
    categoryLabel: 'الحلى',
    subtitle: 'طبقات من العجين والحليب والمكسرات — دافئة وغنية بالطعم',
    image: img('dish_om_ali_1795506726666.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'dessert',
  },
  {
    id: 'nutella-souffle',
    name: 'سوفليه نوتيلا',
    category: 'sweets',
    categoryLabel: 'الحلى',
    subtitle: 'كيك سوفليه طري من الداخل يذوب بالشوكولاتة',
    image: img('dish_nutella_souffle_1795507271532.jpg'),
    fallbackTone: 'cocoa',
    fallbackMotif: 'dessert',
  },
  {
    id: 'mango-trifle',
    name: 'ترافل مانجو',
    category: 'sweets',
    categoryLabel: 'الحلى',
    subtitle: 'طبقة كريمية بالمانجو الطازجة مع طبقة كيك خفيفة',
    image: img('dish_mango_trifle_1795507271023.jpg'),
    fallbackTone: 'amber',
    fallbackMotif: 'dessert',
  },
  {
    id: 'oreo-dessert',
    name: 'حلى أوريو',
    category: 'sweets',
    categoryLabel: 'الحلى',
    subtitle: 'طبقات من بسكويت الأوريو والكريمة الباردة — بارد ومنعش',
    image: img('dish_oreo_dessert_1795506787529.jpg'),
    fallbackTone: 'cocoa',
    fallbackMotif: 'dessert',
  },
];
