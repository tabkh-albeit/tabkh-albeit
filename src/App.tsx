import { useMemo, useState } from 'react';
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
} from 'lucide-react';
import {
  CATEGORIES,
  MENU_ITEMS,
  STORE_INFO,
  type CategoryId,
  type DishItem,
} from '@/src/data/menu';
import { BrandMark } from '@/src/components/BrandMark';
import { DishMedia } from '@/src/components/DishMedia';
import { CartDrawer, type CartItem } from '@/src/components/CartDrawer';
import { StoreInfoModal } from '@/src/components/StoreInfoModal';
import { ChatWidget } from '@/src/components/ChatWidget';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    <div id="top" className="min-h-screen pb-20 md:pb-12">
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
          <div className="rounded-full bg-[#ea7ca2] px-5 py-2 text-sm font-extrabold text-[#140b0f] shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Top Navigation Bar (3-zone contract: Brand — Links — 1 Primary Action) */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#08080a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-xl font-black tracking-tight text-white focus-visible:outline-2 focus-visible:outline-[#ea7ca2]"
          >
            <BrandMark className="h-7 w-9 shrink-0" />
            <span>{STORE_INFO.brandName}</span>
          </a>

          {/* Zone 2: Concise single-line section links */}
          <nav
            aria-label="أقسام المنيو"
            className="hidden items-center gap-6 text-sm font-bold text-[#b8b1c0] lg:flex"
          >
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                onClick={() => setActiveCategory('all')}
                className="shrink-0 whitespace-nowrap py-1 transition-colors duration-150 hover:text-[#ea7ca2]"
              >
                {cat.title}
              </a>
            ))}
            <a
              href="#contact"
              className="shrink-0 whitespace-nowrap py-1 transition-colors duration-150 hover:text-[#ea7ca2]"
            >
              التواصل والتوصيل
            </a>
          </nav>

          {/* Zone 3: Primary Cart Action */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[#ea7ca2] px-4 py-2 text-sm font-extrabold text-[#140b0f] transition-colors duration-150 hover:bg-[#f093b3] focus-visible:outline-2 focus-visible:outline-white"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span>السلة</span>
            <span className="tabular-nums rounded-md bg-[#140b0f]/15 px-1.5 py-0.5 text-xs font-black">
              {totalItems}
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1160px] px-4 sm:px-6">
        {/* Hero Section */}
        <section className="py-8 md:py-12">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-sm font-bold text-[#ea7ca2]">
                {STORE_INFO.location} · {STORE_INFO.deliveryNote}
              </p>
              <h1 className="mt-2.5 text-balance text-4xl font-black leading-tight text-white sm:text-5xl">
                {STORE_INFO.brandName}
                <span className="mt-1.5 block text-2xl font-extrabold text-[#ea7ca2] sm:text-3xl">
                  {STORE_INFO.tagline}
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#b8b1c0]">
                أطباق منزلية تُحضّر يومياً بحب ومذاق أصيل — من أطباق الرز الحجازية والشعبية إلى الصواني الطازجة والسلطات والحلويات المعدّة بعناية لتصلك ساخنة في جميع أحياء جدة.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#menu"
                  className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-gradient-to-l from-[#ea7ca2] to-[#c95b82] px-6 py-3 text-sm font-extrabold text-[#140b0f] transition-opacity duration-150 hover:opacity-95"
                >
                  تصفح المنيو
                </a>
                <a
                  href={`https://wa.me/${STORE_INFO.phoneWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#ea7ca2]/35 bg-[#141318] px-5 py-3 text-sm font-bold text-white transition-colors duration-150 hover:border-[#ea7ca2] hover:bg-[#1b1821]"
                >
                  <span>طلب مباشر واتساب</span>
                  <ExternalLink className="h-4 w-4 text-[#ea7ca2]" />
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-[#b8b1c0]">
                <span>رقم الوثيقة: <strong dir="ltr" className="tabular-nums text-white">{STORE_INFO.documentId}</strong></span>
                <span aria-hidden="true">·</span>
                <span>رقم التوثيق: <strong className="tabular-nums text-white">{STORE_INFO.verificationId}</strong></span>
                <span aria-hidden="true">·</span>
                <span>للتواصل: <strong dir="ltr" className="tabular-nums text-white">{STORE_INFO.phoneDisplay}</strong></span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[240px] overflow-hidden rounded-[20px] border border-[#ea7ca2]/30 bg-[#141318]">
                <img
                  src={STORE_INFO.heroImage}
                  alt="مائدة طبخ البيت للمأكولات الشعبية في جدة"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover lg:h-full"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080a]/60 via-transparent to-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Menu Filter Toolbar */}
        <section id="menu" className="scroll-mt-20 border-t border-white/8 pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Interactive Category Filter Buttons */}
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
                className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-colors duration-150 ${
                  activeCategory === 'all'
                    ? 'bg-[#ea7ca2] text-[#140b0f]'
                    : 'border border-white/10 bg-[#141318] text-[#b8b1c0] hover:border-[#ea7ca2]/40 hover:text-white'
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
                  className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-colors duration-150 ${
                    activeCategory === cat.id
                      ? 'bg-[#ea7ca2] text-[#140b0f]'
                      : 'border border-white/10 bg-[#141318] text-[#b8b1c0] hover:border-[#ea7ca2]/40 hover:text-white'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#b8b1c0]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن طبق..."
                aria-label="ابحث عن طبق في القائمة"
                className="w-full rounded-xl border border-white/12 bg-[#141318] py-2.5 pr-10 pl-9 text-sm text-white placeholder:text-[#b8b1c0]/70 focus:border-[#ea7ca2] focus:outline-none"
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
          <div className="mt-8 space-y-12">
            {visibleCategories.length === 0 ? (
              <div className="rounded-[20px] border border-white/10 bg-[#141318] px-6 py-12 text-center">
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
                  className="mt-4 rounded-xl bg-[#ea7ca2] px-5 py-2 text-sm font-extrabold text-[#140b0f] transition-colors hover:bg-[#f093b3]"
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
                  <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h2 className="text-2xl font-black text-[#ea7ca2]">
                      {section.title}
                    </h2>
                    <p className="text-sm text-[#b8b1c0]">{section.subtitle}</p>
                  </div>

                  <div
                    className={`grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-4 ${
                      section.id === 'sweets' && activeCategory === 'all' && !normalizedQuery
                        ? 'lg:grid-cols-5'
                        : 'lg:grid-cols-4'
                    }`}
                  >
                    {section.dishes.map((dish) => {
                      const inCartQty = qtyById[dish.id] ?? 0;

                      return (
                        <article
                          key={dish.id}
                          className="group flex flex-col justify-between rounded-[20px] border border-[#ea7ca2]/25 bg-gradient-to-b from-[#17151c] to-[#100f14] p-3 transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#ea7ca2]/55"
                        >
                          <div>
                            <DishMedia dish={dish} />
                            <div className="mt-3 px-0.5">
                              <p className="text-xs font-semibold text-[#b8b1c0]">
                                {dish.categoryLabel}
                              </p>
                              <h3 className="mt-0.5 text-base font-extrabold leading-snug text-white">
                                {dish.name}
                              </h3>
                              <p className="mt-1.5 text-xs leading-relaxed text-[#b8b1c0]">
                                {dish.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3.5">
                            {inCartQty > 0 ? (
                              <div className="flex items-center justify-between rounded-xl border border-[#ea7ca2]/45 bg-[#1b1821] p-1">
                                <button
                                  type="button"
                                  onClick={() => handleChangeQty(dish.id, -1)}
                                  aria-label={`إنقاص كمية ${dish.name}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="tabular-nums text-sm font-extrabold text-[#ea7ca2]">
                                  {inCartQty} في السلة
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleChangeQty(dish.id, 1)}
                                  aria-label={`زيادة كمية ${dish.name}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddToCart(dish)}
                                className="w-full whitespace-nowrap rounded-xl bg-gradient-to-l from-[#ea7ca2] to-[#c95b82] px-4 py-2.5 text-sm font-extrabold text-[#140b0f] transition-opacity duration-150 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-white"
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

        {/* Store Contact & Delivery Section */}
        <section
          id="contact"
          className="mt-14 scroll-mt-24 border-t border-[#ea7ca2]/20 pt-10"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#ea7ca2]">
              التواصل والتوصيل
            </h2>
            <p className="mt-1 text-sm text-[#b8b1c0]">
              اطلب عبر السلة أو تواصل معنا مباشرة لتنسيق طلبات الولائم والمناسبات في جدة
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Contact & Verification */}
            <div className="flex flex-col justify-between rounded-[20px] border border-[#ea7ca2]/25 bg-[#141318] p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#ea7ca2]" />
                  <div>
                    <p className="text-xs font-semibold text-[#b8b1c0]">رقم الجوال والواتساب</p>
                    <a
                      href={`tel:${STORE_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                      dir="ltr"
                      className="mt-0.5 inline-block text-lg font-extrabold tabular-nums text-white hover:text-[#ea7ca2]"
                    >
                      {STORE_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/8 pt-4">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#ea7ca2]" />
                  <div>
                    <p className="text-xs font-semibold text-[#b8b1c0]">رقم الوثيقة</p>
                    <p dir="ltr" className="mt-0.5 text-lg font-extrabold tabular-nums text-white">
                      {STORE_INFO.documentId}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/8 pt-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#ea7ca2]" />
                  <div>
                    <p className="text-xs font-semibold text-[#b8b1c0]">رقم التوثيق</p>
                    <p className="mt-0.5 text-lg font-extrabold tabular-nums text-white">
                      {STORE_INFO.verificationId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${STORE_INFO.phoneWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-l from-[#ea7ca2] to-[#c95b82] px-4 py-2.5 text-sm font-extrabold text-[#140b0f] transition-opacity hover:opacity-95"
                >
                  <span>تواصل واتساب</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${STORE_INFO.email}`}
                  className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  راسلنا بالبريد
                </a>
              </div>
            </div>

            {/* Location, Email & Delivery */}
            <div className="flex flex-col justify-between rounded-[20px] border border-[#ea7ca2]/25 bg-[#141318] p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#ea7ca2]" />
                  <div>
                    <p className="text-xs font-semibold text-[#b8b1c0]">موقعنا</p>
                    <p className="mt-0.5 text-base font-extrabold text-white">
                      {STORE_INFO.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/8 pt-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#ea7ca2]" />
                  <div>
                    <p className="text-xs font-semibold text-[#b8b1c0]">البريد الإلكتروني</p>
                    <a
                      href={`mailto:${STORE_INFO.email}`}
                      className="mt-0.5 inline-block text-base font-bold text-white hover:text-[#ea7ca2]"
                    >
                      {STORE_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/8 pt-4">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#ea7ca2]" />
                  <div>
                    <p className="text-xs font-semibold text-[#b8b1c0]">خدمة التوصيل</p>
                    <p className="mt-0.5 text-base font-bold text-white">
                      {STORE_INFO.deliveryNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiet Footer */}
        <footer className="mt-12 border-t border-white/8 py-6 text-center text-xs text-[#b8b1c0]">
          <p>
            {STORE_INFO.brandName} · {STORE_INFO.tagline} · رقم الوثيقة{' '}
            <span dir="ltr" className="tabular-nums">{STORE_INFO.documentId}</span> · رقم التوثيق{' '}
            <span className="tabular-nums">{STORE_INFO.verificationId}</span>
          </p>
        </footer>
      </main>

      {/* Mobile Bottom Navigation (compact <= 15% mobile viewport cap) */}
      <nav
        aria-label="التنقل السريع"
        className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-around border-t border-[#ea7ca2]/30 bg-[#0f0e13]/95 px-2 py-2 backdrop-blur-md md:hidden"
      >
        <a
          href="#top"
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-bold text-[#ea7ca2]"
        >
          <Home className="h-4 w-4" />
          <span>الرئيسية</span>
        </a>
        <a
          href="#menu"
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-bold text-[#b8b1c0] hover:text-white"
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>الأطباق</span>
        </a>
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-bold text-[#b8b1c0] hover:text-white"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>السلة</span>
          {totalItems > 0 && (
            <span className="tabular-nums absolute -top-0.5 left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ea7ca2] px-1 text-[10px] font-black text-[#140b0f]">
              {totalItems}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsStoreModalOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-bold text-[#b8b1c0] hover:text-white"
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
