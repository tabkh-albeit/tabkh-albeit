import { useEffect, useMemo, useState } from 'react';
import {
  ShoppingBag,
  Search,
  X,
  Plus,
  Minus,
  Home,
  UtensilsCrossed,
  User,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  FileText,
  Truck,
  ExternalLink,
  CreditCard,
} from 'lucide-react';
import {
  CATEGORIES,
  MENU_ITEMS,
  STORE_INFO,
  type CategoryId,
  type DishItem,
} from '@/src/data/menu';
import { BrandMark } from '@/src/components/BrandMark';
import { EnchantedSky } from '@/src/components/EnchantedSky';
import { DishMedia } from '@/src/components/DishMedia';
import { CartDrawer, type CartItem } from '@/src/components/CartDrawer';
import { StoreInfoModal } from '@/src/components/StoreInfoModal';
import { ChatWidget } from '@/src/components/ChatWidget';
import { PaymentPage } from '@/src/components/PaymentPage';

type ActivePage = 'home' | 'payment';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>(() =>
    typeof window !== 'undefined' && window.location.hash === '#payment'
      ? 'payment'
      : 'home'
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(window.location.hash === '#payment' ? 'payment' : 'home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openPaymentPage = () => {
    setActivePage('payment');
    if (window.location.hash !== '#payment') {
      window.history.pushState(null, '', '#payment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHomeSection = (sectionId?: string) => {
    setActivePage('home');
    if (sectionId && sectionId !== 'top') {
      setActiveCategory('all');
      window.history.pushState(null, '', `#${sectionId}`);
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    } else {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const qtyById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cart) {
      map[item.id] = item.qty;
    }
    return map;
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 1800);
  };

  const handleAddToCart = (dish: DishItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          categoryLabel: dish.categoryLabel,
          qty: 1,
        },
      ];
    });
    showToast(`تمت إضافة "${dish.name}" إلى السلة`);
  };

  const handleChangeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const normalizedQuery = searchQuery.trim();

  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter(
      (cat) => activeCategory === 'all' || cat.id === activeCategory
    )
      .map((cat) => {
        const dishes = MENU_ITEMS.filter((dish) => {
          if (dish.category !== cat.id) return false;
          if (!normalizedQuery) return true;
          return (
            dish.name.includes(normalizedQuery) ||
            dish.subtitle.includes(normalizedQuery) ||
            dish.categoryLabel.includes(normalizedQuery)
          );
        });
        return { ...cat, dishes };
      })
      .filter((section) => section.dishes.length > 0);
  }, [activeCategory, normalizedQuery]);

  return (
    <div id="top" className="relative min-h-screen pb-20 md:pb-12">
      {/* Live Toast Feedback */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed top-5 left-1/2 z-50 -translate-x-1/2 transition-all duration-200 ${
          toastMessage
            ? 'translate-y-0 opacity-100'
            : '-translate-y-6 opacity-0'
        }`}
      >
        {toastMessage && (
          <div className="rounded-full bg-[#FF8FAB] px-5 py-2 text-sm font-extrabold text-[#140b0f] shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Enchanted Sky & Castle Backdrop */}
      <EnchantedSky />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6">
        {/* Header */}
        <header className="sticky top-2 z-40 rounded-[8px] border border-[#FF8FAB]/85 bg-[#121010]/42 px-3.5 py-3 backdrop-blur-md sm:px-5">
          <div className="flex items-center justify-between gap-6">
            {/* Zone 1: Brand Wordmark */}
            <a
              href="#top"
              onClick={(e) => {
                if (activePage === 'payment') {
                  e.preventDefault();
                  openHomeSection('top');
                }
              }}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[6px] bg-[#2E2A2A]/45 px-3 py-1 text-base font-black tracking-tight text-white focus-visible:outline-2 focus-visible:outline-[#FF8FAB]"
            >
              <BrandMark className="h-5 w-6 shrink-0" />
              <span>{STORE_INFO.brandName}</span>
            </a>

            {/* Zone 2: Concise single-line navigation links */}
            <nav
              aria-label="أقسام المنيو"
              className="hidden items-center gap-4 text-sm font-bold text-[#b8b1c0] lg:flex"
            >
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  onClick={(e) => {
                    if (activePage === 'payment') {
                      e.preventDefault();
                      openHomeSection(cat.id);
                    } else {
                      setActiveCategory('all');
                    }
                  }}
                  className="shrink-0 whitespace-nowrap py-1 transition-colors duration-150 hover:text-[#FF8FAB]"
                >
                  {cat.title}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  if (activePage === 'payment') {
                    e.preventDefault();
                    openHomeSection('contact');
                  }
                }}
                className="shrink-0 whitespace-nowrap py-1 transition-colors duration-150 hover:text-[#FF8FAB]"
              >
                التواصل والتوصيل
              </a>
              <a
                href="#payment"
                onClick={(e) => {
                  e.preventDefault();
                  openPaymentPage();
                }}
                className={`shrink-0 whitespace-nowrap py-1 transition-colors duration-150 hover:text-[#FF8FAB] ${
                  activePage === 'payment' ? 'text-[#FF8FAB]' : ''
                }`}
              >
                طرق الدفع
              </a>
            </nav>

            {/* Zone 3: Primary Pink Cart Pill Action */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[18px] bg-[#FF8FAB] px-4 py-1.5 text-sm font-black text-[#140b0f] transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-white"
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />
              <span>السلة</span>
              <span className="tabular-nums rounded-full bg-[#140b0f]/15 px-1.5 py-0.5 text-xs font-black">
                {totalItems}
              </span>
            </button>
          </div>
        </header>

        <main>
          {activePage === 'payment' ? (
            <PaymentPage onBackToMenu={() => openHomeSection('menu')} />
          ) : (
            <>
          {/* Hero Box with Double Pink Border */}
          <section className="wire-box mt-2.5 rounded-[10px] bg-[#121010]/35 px-4 py-7 text-center backdrop-blur-[6px] sm:px-8 sm:py-9">
            <p className="text-xs font-bold tracking-wide text-[#FFD700] sm:text-sm">
              {STORE_INFO.location} · {STORE_INFO.deliveryNote}
            </p>
            <h1 className="mx-auto mt-2.5 max-w-2xl text-balance text-3xl font-black leading-tight text-white sm:text-5xl">
              {STORE_INFO.brandName}
              <span className="mt-1.5 block text-xl font-extrabold text-[#FF8FAB] sm:text-2xl">
                {STORE_INFO.tagline}
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#b8b1c0] sm:text-base">
              أطباق منزلية تُحضّر يومياً بحب ومذاق أصيل — من أطباق الرز الحجازية والشعبية إلى الصواني الطازجة والسلطات والحلويات المعدّة بعناية لتصلك ساخنة في جميع أحياء جدة.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <a
                href="#menu"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] bg-[#FF8FAB] px-6 py-2 text-sm font-black text-[#140b0f] transition-opacity duration-150 hover:opacity-90"
              >
                تصفح المنيو
              </a>
              <a
                href={`https://wa.me/${STORE_INFO.phoneWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[#FF8FAB] bg-transparent px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-[#FF8FAB]/15"
              >
                <span>طلب مباشر واتساب</span>
                <ExternalLink className="h-4 w-4 text-[#FF8FAB]" />
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-[#b8b1c0]">
              <span>
                رقم الوثيقة:{' '}
                <strong dir="ltr" className="tabular-nums text-white">
                  {STORE_INFO.documentId}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                رقم التوثيق:{' '}
                <strong className="tabular-nums text-white">
                  {STORE_INFO.verificationId}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                الجوال:{' '}
                <strong dir="ltr" className="tabular-nums text-white">
                  {STORE_INFO.phoneDisplay}
                </strong>
              </span>
            </div>
          </section>

          {/* Menu Filter Toolbar */}
          <section id="menu" className="mt-8 scroll-mt-24">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div
                role="tablist"
                aria-label="تصفية الأطباق حسب القسم"
                className="flex flex-wrap items-center gap-2"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                  className={`shrink-0 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-bold backdrop-blur-sm transition-colors duration-150 ${
                    activeCategory === 'all'
                      ? 'border-[#FF8FAB] bg-[#FF8FAB] text-[#140b0f]'
                      : 'border-[#FF8FAB]/35 bg-[#1E1A1E]/45 text-[#e6e0ec] hover:border-[#FF8FAB] hover:text-white'
                  }`}
                >
                  جميع الأطباق
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-bold backdrop-blur-sm transition-colors duration-150 ${
                      activeCategory === cat.id
                        ? 'border-[#FF8FAB] bg-[#FF8FAB] text-[#140b0f]'
                        : 'border-[#FF8FAB]/35 bg-[#1E1A1E]/45 text-[#e6e0ec] hover:border-[#FF8FAB] hover:text-white'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#b8b1c0]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن طبق..."
                  aria-label="ابحث عن طبق في القائمة"
                  className="w-full rounded-lg border border-[#FF8FAB]/35 bg-[#1E1A1E]/45 py-2.5 pr-10 pl-9 text-sm text-white backdrop-blur-sm placeholder:text-[#d5cedd]/75 focus:border-[#FF8FAB] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="مسح البحث"
                    className="absolute top-1/2 left-2.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#b8b1c0] hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categorized Menu Grids */}
            <div className="mt-8 space-y-10">
              {visibleCategories.length === 0 ? (
                <div className="wire-box rounded-[10px] px-6 py-12 text-center">
                  <p className="text-base font-bold text-white">
                    لم نجد أطباقاً مطابقة لـ "{searchQuery}"
                  </p>
                  <p className="mt-1 text-sm text-[#b8b1c0]">
                    جرّب البحث باسم آخر أو عرض جميع أقسام القائمة.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="mt-4 rounded-lg bg-[#FF8FAB] px-5 py-2 text-sm font-extrabold text-[#140b0f] transition-opacity hover:opacity-90"
                  >
                    عرض جميع الأطباق
                  </button>
                </div>
              ) : (
                visibleCategories.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24"
                  >
                    <div className="mb-4 flex flex-col gap-1 border-b border-[#FF8FAB]/20 pb-2.5 sm:flex-row sm:items-baseline sm:justify-between">
                      <h2 className="text-2xl font-black text-[#FF8FAB]">
                        {section.title}
                      </h2>
                      <p className="text-sm text-[#b8b1c0]">{section.subtitle}</p>
                    </div>

                    <div
                      className={`grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-4 ${
                        section.id === 'sweets' &&
                        activeCategory === 'all' &&
                        !normalizedQuery
                          ? 'lg:grid-cols-5'
                          : 'lg:grid-cols-4'
                      }`}
                    >
                      {section.dishes.map((dish) => {
                        const inCartQty = qtyById[dish.id] ?? 0;

                        return (
                          <article
                            key={dish.id}
                            className="group flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#FF8FAB]/30 bg-[#1E1A1E]/45 text-center backdrop-blur-[6px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF8FAB]/80 hover:bg-[#1E1A1E]/60 hover:shadow-[0_0_20px_rgba(255,143,171,0.18)]"
                          >
                            <div>
                              <DishMedia dish={dish} />
                              <div className="px-3 pt-3">
                                <p className="text-[11px] font-semibold text-[#FFD700]">
                                  {dish.categoryLabel}
                                </p>
                                <h3 className="mt-0.5 text-base font-extrabold leading-snug text-white">
                                  {dish.name}
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed text-[#d6cfdf]">
                                  {dish.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="p-3 pt-3.5">
                              {inCartQty > 0 ? (
                                <div className="flex items-center justify-between rounded-[8px] border border-[#FF8FAB] bg-[#121010]/55 p-1">
                                  <button
                                    type="button"
                                    onClick={() => handleChangeQty(dish.id, -1)}
                                    aria-label={`إنقاص كمية ${dish.name}`}
                                    className="flex h-7 w-7 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="tabular-nums text-xs font-extrabold text-[#FF8FAB]">
                                    {inCartQty} في السلة
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleChangeQty(dish.id, 1)}
                                    aria-label={`زيادة كمية ${dish.name}`}
                                    className="flex h-7 w-7 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(dish)}
                                  className="w-full rounded-[8px] bg-[#FF8FAB] px-4 py-2 text-xs font-black text-[#140b0f] transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-white"
                                >
                                  اطلب الآن
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>
          </section>

          {/* Three Double-Outlined Geometric Hex Medallions (Store Trust, Location, Delivery) */}
          <section
            id="contact"
            className="mt-14 scroll-mt-24 border-t border-[#FF8FAB]/20 pt-10"
          >
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#FF8FAB]">
                التواصل والتوثيق والتوصيل
              </h2>
              <p className="mt-1 text-sm text-[#b8b1c0]">
                بياناتنا الرسمية الموثقة وخدمة التوصيل المباشر في جميع أنحاء جدة
              </p>
            </div>

            {/* 3 Double Rotated-Octagon Geometric Medallions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-7">
              {/* Medallion 1: Official Verification */}
              <div className="relative flex h-[210px] w-[210px] items-center justify-center">
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <polygon
                    points="60,4 99,21 116,60 99,99 60,116 21,99 4,60 21,21"
                    fill="rgba(18, 16, 16, 0.38)"
                    stroke="#F48FB1"
                    strokeWidth="1.1"
                  />
                  <polygon
                    points="75,6 108,33 114,75 87,108 45,114 12,87 6,45 33,12"
                    fill="none"
                    stroke="#F48FB1"
                    strokeWidth="0.75"
                    opacity="0.7"
                  />
                </svg>
                <div className="relative z-10 w-[72%] text-center">
                  <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-[#F48FB1] text-[#F48FB1] shadow-[0_0_0_3px_rgba(244,143,177,0.16)]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-[#FAD074]">التوثيق الرسمي</p>
                  <p dir="ltr" className="mt-1 text-xs font-extrabold tabular-nums text-white">
                    {STORE_INFO.documentId}
                  </p>
                  <p className="mt-0.5 text-[11px] tabular-nums text-[#b8b1c0]">
                    توثيق: {STORE_INFO.verificationId}
                  </p>
                </div>
              </div>

              {/* Medallion 2: Jeddah Location */}
              <div className="relative flex h-[210px] w-[210px] items-center justify-center">
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <polygon
                    points="60,4 99,21 116,60 99,99 60,116 21,99 4,60 21,21"
                    fill="rgba(18, 16, 16, 0.38)"
                    stroke="#F48FB1"
                    strokeWidth="1.1"
                  />
                  <polygon
                    points="75,6 108,33 114,75 87,108 45,114 12,87 6,45 33,12"
                    fill="none"
                    stroke="#F48FB1"
                    strokeWidth="0.75"
                    opacity="0.7"
                  />
                </svg>
                <div className="relative z-10 w-[72%] text-center">
                  <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-[#F48FB1] text-[#F48FB1] shadow-[0_0_0_3px_rgba(244,143,177,0.16)]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-[#FAD074]">موقعنا</p>
                  <p className="mt-1 text-xs font-extrabold text-white">
                    جدة - حي الواحة
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#b8b1c0]">
                    مخطط السندس
                  </p>
                </div>
              </div>

              {/* Medallion 3: Delivery & Contact */}
              <div className="relative flex h-[210px] w-[210px] items-center justify-center">
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <polygon
                    points="60,4 99,21 116,60 99,99 60,116 21,99 4,60 21,21"
                    fill="rgba(18, 16, 16, 0.38)"
                    stroke="#F48FB1"
                    strokeWidth="1.1"
                  />
                  <polygon
                    points="75,6 108,33 114,75 87,108 45,114 12,87 6,45 33,12"
                    fill="none"
                    stroke="#F48FB1"
                    strokeWidth="0.75"
                    opacity="0.7"
                  />
                </svg>
                <div className="relative z-10 w-[72%] text-center">
                  <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-[#F48FB1] text-[#F48FB1] shadow-[0_0_0_3px_rgba(244,143,177,0.16)]">
                    <Truck className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-[#FAD074]">خدمة التوصيل</p>
                  <p className="mt-1 text-xs font-extrabold text-white">
                    لجميع أنحاء جدة
                  </p>
                  <a
                    href={`tel:${STORE_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                    dir="ltr"
                    className="mt-0.5 inline-block text-[11px] font-bold tabular-nums text-[#F48FB1] hover:underline"
                  >
                    {STORE_INFO.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Contact Strip */}
            <div className="wire-box mt-8 flex flex-col items-center justify-between gap-4 rounded-[8px] px-6 py-5 sm:flex-row">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#b8b1c0] sm:justify-start sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#F48FB1]" />
                  <span>رقم الوثيقة: <strong dir="ltr" className="tabular-nums text-white">{STORE_INFO.documentId}</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-[#F48FB1]" />
                  <a
                    href={`tel:${STORE_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                    dir="ltr"
                    className="font-bold tabular-nums text-white hover:text-[#F48FB1]"
                  >
                    {STORE_INFO.phoneDisplay}
                  </a>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-[#F48FB1]" />
                  <a
                    href={`mailto:${STORE_INFO.email}`}
                    className="font-bold text-white hover:text-[#F48FB1]"
                  >
                    {STORE_INFO.email}
                  </a>
                </span>
              </div>

              <div className="flex flex-wrap shrink-0 items-center justify-center gap-2.5">
                <a
                  href={`https://wa.me/${STORE_INFO.phoneWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap border border-[#FFD1E0] bg-[#FF8FAB] px-4 py-2 text-xs font-black text-[#140b0f] transition-opacity hover:opacity-90"
                >
                  <span>تواصل واتساب</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#payment"
                  onClick={(e) => {
                    e.preventDefault();
                    openPaymentPage();
                  }}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap border border-[#F48FB1]/55 bg-[#121010]/45 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-[#F48FB1] hover:text-[#FF8FAB]"
                >
                  <CreditCard className="h-3.5 w-3.5 text-[#FF8FAB]" />
                  <span>طرق الدفع</span>
                </a>
                <a
                  href={`mailto:${STORE_INFO.email}`}
                  className="inline-flex items-center whitespace-nowrap border border-[#F48FB1]/55 bg-[#121010]/45 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-[#F48FB1]"
                >
                  البريد الإلكتروني
                </a>
              </div>
            </div>
          </section>
            </>
          )}

          {/* Quiet Footer */}
          <footer className="mt-8 border-t border-white/10 py-6 text-center text-xs text-[#d6cfdf]">
            <p>
              {STORE_INFO.brandName} · {STORE_INFO.tagline} · رقم الوثيقة{' '}
              <span dir="ltr" className="tabular-nums">
                {STORE_INFO.documentId}
              </span>{' '}
              · رقم التوثيق{' '}
              <span className="tabular-nums">{STORE_INFO.verificationId}</span>
            </p>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="التنقل السريع"
        className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-around border-t border-[#FF8FAB]/40 bg-[#121010]/60 px-1.5 py-2 backdrop-blur-md md:hidden"
      >
        <a
          href="#top"
          onClick={(e) => {
            if (activePage === 'payment') {
              e.preventDefault();
              openHomeSection('top');
            }
          }}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-bold ${
            activePage === 'home' ? 'text-[#FF8FAB]' : 'text-[#b8b1c0] hover:text-white'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>الرئيسية</span>
        </a>
        <a
          href="#menu"
          onClick={(e) => {
            if (activePage === 'payment') {
              e.preventDefault();
              openHomeSection('menu');
            }
          }}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-bold text-[#b8b1c0] hover:text-white"
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>الأطباق</span>
        </a>
        <a
          href="#payment"
          onClick={(e) => {
            e.preventDefault();
            openPaymentPage();
          }}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-bold ${
            activePage === 'payment' ? 'text-[#FF8FAB]' : 'text-[#b8b1c0] hover:text-white'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>طرق الدفع</span>
        </a>
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-bold text-[#b8b1c0] hover:text-white"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>السلة</span>
          {totalItems > 0 && (
            <span className="tabular-nums absolute -top-0.5 left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF8FAB] px-1 text-[10px] font-black text-[#140b0f]">
              {totalItems}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsStoreModalOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-bold text-[#b8b1c0] hover:text-white"
        >
          <User className="h-4 w-4" />
          <span>المتجر</span>
        </button>
      </nav>

      {/* Slide-over Cart & WhatsApp Order Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onChangeQty={handleChangeQty}
        onClearCart={() => setCart([])}
      />

      {/* Store Details Modal */}
      <StoreInfoModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />

      {/* AI Store Assistant Widget */}
      <ChatWidget />
    </div>
  );
}
