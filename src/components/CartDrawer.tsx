import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Check, Copy, ExternalLink } from 'lucide-react';
import { STORE_INFO } from '@/src/data/menu';

export interface CartItem {
  id: string;
  name: string;
  categoryLabel: string;
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onChangeQty: (id: string, delta: number) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onChangeQty,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [copied, setCopied] = useState(false);
  const [orderDispatched, setOrderDispatched] = useState(false);

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  const buildOrderMessage = () => {
    let msg = `طلب جديد من ${STORE_INFO.brandName}\n\n`;
    msg += `الاسم: ${customerName.trim()}\n`;
    msg += `العنوان: ${customerAddress.trim()}\n\n`;
    msg += `الطلب:\n`;
    items.forEach((item, index) => {
      msg += `${index + 1}. ${item.name} (الكمية: ${item.qty})\n`;
    });
    msg += `\nإجمالي الأصناف: ${totalCount} صنف`;
    if (customerNotes.trim()) {
      msg += `\nملاحظات: ${customerNotes.trim()}`;
    }
    return msg;
  };

  const whatsappUrl =
    items.length > 0 && customerName.trim() && customerAddress.trim()
      ? `https://wa.me/${STORE_INFO.phoneWhatsapp}?text=${encodeURIComponent(
          buildOrderMessage()
        )}`
      : null;

  const handleSubmitCheck = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (items.length === 0) {
      e.preventDefault();
      setValidationError('السلة فارغة، أضف أطباقك المفضلة أولاً.');
      return;
    }
    if (!customerName.trim()) {
      e.preventDefault();
      setValidationError('يرجى إدخال الاسم الكريم لإتمام الطلب.');
      return;
    }
    if (!customerAddress.trim()) {
      e.preventDefault();
      setValidationError('يرجى إدخال العنوان أو الحي في جدة.');
      return;
    }
    setValidationError('');
    setOrderDispatched(true);
  };

  const handleCopyOrder = async () => {
    if (items.length === 0) {
      setValidationError('السلة فارغة، أضف أطباقك المفضلة أولاً.');
      return;
    }
    if (!customerName.trim() || !customerAddress.trim()) {
      setValidationError('يرجى إدخال الاسم والعنوان قبل نسخ الطلب.');
      return;
    }
    setValidationError('');
    try {
      await navigator.clipboard.writeText(buildOrderMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setValidationError('تعذر النسخ التلقائي، يمكنك الإرسال مباشرة عبر واتساب.');
    }
  };

  const handleResetAndClose = () => {
    setOrderDispatched(false);
    setValidationError('');
    onClearCart();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full max-w-md flex-col border-r border-[#ea7ca2]/30 bg-[#141318] text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#ea7ca2]" />
            <h2 id="cart-drawer-title" className="text-lg font-extrabold">
              سلة الطلبات
            </h2>
            <span className="tabular-nums text-sm text-[#b8b1c0]">
              ({totalCount} صنف)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق السلة"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#b8b1c0] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ea7ca2]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {orderDispatched ? (
            <div className="rounded-xl border border-[#ea7ca2]/35 bg-[#1b1821] p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ea7ca2] text-[#140b0f]">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-white">
                تم تجهيز طلبك لإرساله عبر واتساب
              </h3>
              <p className="mt-1.5 text-sm text-[#b8b1c0]">
                إذا لم تُفتح نافذة واتساب تلقائياً، يمكنك الضغط على الزر أدناه أو نسخ تفاصيل الطلب وإرسالها إلى{' '}
                <span dir="ltr" className="font-bold text-white tabular-nums">
                  {STORE_INFO.phoneDisplay}
                </span>
                .
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ea7ca2] px-4 py-3 text-sm font-extrabold text-[#140b0f] transition-colors hover:bg-[#f093b3]"
                  >
                    <span>فتح محادثة واتساب</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
                >
                  تفريغ السلة والعودة للمنيو
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ea7ca2]/25 bg-[#1b1821] text-[#ea7ca2]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-bold text-white">السلة فارغة حالياً</p>
              <p className="mt-1 text-sm text-[#b8b1c0]">
                اختر أطباقك الشعبية المفضلة من القائمة لإضافتها هنا.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-xl bg-[#ea7ca2] px-5 py-2.5 text-sm font-extrabold text-[#140b0f] transition-colors hover:bg-[#f093b3]"
              >
                تصفح المنيو
              </button>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-white/8">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#b8b1c0]">{item.categoryLabel}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onChangeQty(item.id, -1)}
                        aria-label={`إنقاص كمية ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ea7ca2]/30 bg-white/5 text-white transition-colors hover:bg-white/10"
                      >
                        {item.qty === 1 ? (
                          <Trash2 className="h-3.5 w-3.5 text-[#ea7ca2]" />
                        ) : (
                          <Minus className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <span className="w-6 text-center text-sm font-extrabold tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onChangeQty(item.id, 1)}
                        aria-label={`زيادة كمية ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ea7ca2]/30 bg-white/5 text-white transition-colors hover:bg-white/10"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Customer Delivery Details */}
              <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                <div>
                  <label
                    htmlFor="custName"
                    className="mb-1.5 block text-xs font-semibold text-[#b8b1c0]"
                  >
                    الاسم الكريم
                  </label>
                  <input
                    id="custName"
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="أدخل اسمك الكريم"
                    className="w-full rounded-xl border border-white/15 bg-[#0d0c10] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#ea7ca2] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="custAddr"
                    className="mb-1.5 block text-xs font-semibold text-[#b8b1c0]"
                  >
                    العنوان / الحي في جدة
                  </label>
                  <input
                    id="custAddr"
                    type="text"
                    value={customerAddress}
                    onChange={(e) => {
                      setCustomerAddress(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="مثال: جدة - حي الواحة - مخطط السندس"
                    className="w-full rounded-xl border border-white/15 bg-[#0d0c10] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#ea7ca2] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="custNotes"
                    className="mb-1.5 block text-xs font-semibold text-[#b8b1c0]"
                  >
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    id="custNotes"
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="موعد التوصيل المفضل أو أي تفاصيل إضافية..."
                    className="w-full rounded-xl border border-white/15 bg-[#0d0c10] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#ea7ca2] focus:outline-none"
                  />
                </div>

                {validationError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200"
                  >
                    {validationError}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && !orderDispatched && (
          <div className="border-t border-white/10 bg-[#100f14] px-5 py-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-[#b8b1c0]">إجمالي الأصناف</span>
              <span className="tabular-nums text-[#ea7ca2]">
                {totalCount} صنف
              </span>
            </div>

            <a
              href={
                whatsappUrl ??
                `https://wa.me/${STORE_INFO.phoneWhatsapp}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSubmitCheck}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#ea7ca2] to-[#c95b82] px-4 py-3 text-sm font-extrabold text-[#140b0f] transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-white"
            >
              <span>إرسال الطلب عبر واتساب</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={handleCopyOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[#ea7ca2]" />
                  <span>تم نسخ تفاصيل الطلب</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#b8b1c0]" />
                  <span>نسخ نص الطلب</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
