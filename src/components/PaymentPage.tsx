import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Hash,
  QrCode,
  UserCheck,
} from 'lucide-react';
import { PAYMENT_INFO, STORE_INFO } from '@/src/data/menu';

interface PaymentPageProps {
  onBackToMenu: () => void;
}

const TRANSFER_STEPS = [
  {
    step: '١',
    title: 'تأكيد الطلب أولاً',
    description:
      'اختر أطباقك من القائمة وأرسل الطلب عبر السلة أو واتساب لتأكيد التوفر وتحديد وقت التوصيل.',
  },
  {
    step: '٢',
    title: 'إجراء التحويل البنكي',
    description:
      'افتح تطبيق مصرف الراجحي أو تطبيق بنكك المحلي، وحوّل المبلغ باستخدام رقم الحساب أو رقم الآيبان أو بمسح رمز الباركود (QR).',
  },
  {
    step: '٣',
    title: 'حفظ إيصال التحويل',
    description:
      'التقط لقطة شاشة واضحة أو احفظ ملف إيصال التحويل البنكي بعد إتمام العملية بنجاح.',
  },
  {
    step: '٤',
    title: 'إرسال الإيصال عبر واتساب',
    description: `اضغط على زر الإرسال أدناه وأرفق صورة الإيصال عبر واتساب (${STORE_INFO.phoneDisplay}) مع كتابة الاسم ليتم اعتماد طلبك وتجهيزه فوراً.`,
  },
];

export function PaymentPage({ onBackToMenu }: PaymentPageProps) {
  const [copiedField, setCopiedField] = useState<'account' | 'iban' | null>(null);

  const handleCopy = async (value: string, field: 'account' | 'iban') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 2000);
    } catch {
      // Clipboard might be unavailable in restricted contexts
    }
  };

  const whatsappReceiptUrl = `https://wa.me/${STORE_INFO.phoneWhatsapp}?text=${encodeURIComponent(
    `السلام عليكم، قمت بإجراء التحويل البنكي لطلبي من ${STORE_INFO.brandName} وأرفق لكم إيصال التحويل:`
  )}`;

  return (
    <section aria-labelledby="payment-page-title" className="mt-2.5 space-y-6">
      {/* Page Title Banner */}
      <div className="wire-box rounded-[10px] bg-[#121010]/38 px-4 py-6 text-center backdrop-blur-[6px] sm:px-8 sm:py-8">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#FF8FAB]/45 bg-[#1E1A1E]/55 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:border-[#FF8FAB] hover:text-[#FF8FAB]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>العودة إلى المنيو</span>
          </button>
        </div>

        <div className="mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#FF8FAB]/70 bg-[#1E1A1E]/60 text-[#FF8FAB]">
          <CreditCard className="h-5 w-5" />
        </div>

        <h1
          id="payment-page-title"
          className="mt-3 text-2xl font-black text-white sm:text-4xl"
        >
          {PAYMENT_INFO.pageTitle}
        </h1>
        <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-[#d6cfdf] sm:text-base">
          نستقبل في{' '}
          <strong className="font-extrabold text-[#FF8FAB]">
            {STORE_INFO.brandName}
          </strong>{' '}
          مدفوعاتكم بكل يسر وأمان عبر التحويل البنكي المباشر إلى حسابنا الرسمي في{' '}
          <strong className="font-extrabold text-white">
            {PAYMENT_INFO.bankName}
          </strong>
          .
        </p>
      </div>

      {/* Bank Details + Official QR Card */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Account Details */}
        <div className="wire-box rounded-[10px] bg-[#121010]/40 p-5 backdrop-blur-[6px] sm:p-6 lg:col-span-7">
          <div className="border-b border-[#FF8FAB]/20 pb-3">
            <h2 className="text-xl font-black text-[#FF8FAB]">
              بيانات الحساب البنكي
            </h2>
            <p className="mt-0.5 text-xs text-[#d6cfdf]">
              يمكنك نسخ رقم الحساب أو رقم الآيبان مباشرة بضغطة واحدة
            </p>
          </div>

          <dl className="mt-4 space-y-3">
            {/* Bank Name */}
            <div className="flex flex-col gap-1 rounded-[8px] border border-[#FF8FAB]/25 bg-[#1E1A1E]/45 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <dt className="flex items-center gap-2 text-xs font-bold text-[#FFD700] sm:text-sm">
                <Building2 className="h-4 w-4 text-[#FF8FAB]" />
                <span>اسم البنك</span>
              </dt>
              <dd className="text-sm font-black text-white sm:text-base">
                {PAYMENT_INFO.bankName}
              </dd>
            </div>

            {/* Account Holder */}
            <div className="flex flex-col gap-1 rounded-[8px] border border-[#FF8FAB]/25 bg-[#1E1A1E]/45 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <dt className="flex items-center gap-2 text-xs font-bold text-[#FFD700] sm:text-sm">
                <UserCheck className="h-4 w-4 text-[#FF8FAB]" />
                <span>اسم صاحب الحساب</span>
              </dt>
              <dd className="text-sm font-black text-white sm:text-base">
                {PAYMENT_INFO.accountHolder}
              </dd>
            </div>

            {/* Account Number */}
            <div className="flex flex-col gap-2 rounded-[8px] border border-[#FF8FAB]/25 bg-[#1E1A1E]/45 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <dt className="flex items-center gap-2 text-xs font-bold text-[#FFD700] sm:text-sm">
                  <Hash className="h-4 w-4 text-[#FF8FAB]" />
                  <span>رقم الحساب</span>
                </dt>
                <dd
                  dir="ltr"
                  className="break-all text-right text-sm font-extrabold tracking-wide tabular-nums text-white sm:text-base"
                >
                  {PAYMENT_INFO.accountNumber}
                </dd>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(PAYMENT_INFO.accountNumber, 'account')}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-[8px] border border-[#FF8FAB]/45 bg-[#121010]/60 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-[#FF8FAB] hover:text-[#FF8FAB] sm:self-center"
              >
                {copiedField === 'account' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#FF8FAB]" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#FF8FAB]" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>

            {/* IBAN */}
            <div className="flex flex-col gap-2 rounded-[8px] border border-[#FF8FAB]/25 bg-[#1E1A1E]/45 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <dt className="flex items-center gap-2 text-xs font-bold text-[#FFD700] sm:text-sm">
                  <CreditCard className="h-4 w-4 text-[#FF8FAB]" />
                  <span>رقم الآيبان (IBAN)</span>
                </dt>
                <dd
                  dir="ltr"
                  className="break-all text-right text-sm font-extrabold tracking-wide tabular-nums text-white sm:text-base"
                >
                  {PAYMENT_INFO.ibanDisplay}
                </dd>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(PAYMENT_INFO.ibanCompact, 'iban')}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-[8px] border border-[#FF8FAB]/45 bg-[#121010]/60 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-[#FF8FAB] hover:text-[#FF8FAB] sm:self-center"
              >
                {copiedField === 'iban' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#FF8FAB]" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#FF8FAB]" />
                    <span>نسخ الآيبان</span>
                  </>
                )}
              </button>
            </div>

            {/* SWIFT */}
            <div className="flex items-center justify-between rounded-[8px] border border-[#FF8FAB]/20 bg-[#1E1A1E]/35 px-3.5 py-2.5 text-xs">
              <span className="font-bold text-[#b8b1c0]">كود سويفت (SWIFT)</span>
              <span dir="ltr" className="font-extrabold tracking-wider text-white">
                {PAYMENT_INFO.swiftCode}
              </span>
            </div>
          </dl>
        </div>

        {/* Official Bank QR Code Card */}
        <div className="wire-box flex flex-col items-center justify-center rounded-[10px] bg-[#121010]/40 p-5 text-center backdrop-blur-[6px] sm:p-6 lg:col-span-5">
          <div className="inline-flex items-center gap-1.5 text-sm font-black text-[#FF8FAB]">
            <QrCode className="h-4 w-4" />
            <span>باركود التحويل السريع</span>
          </div>
          <p className="mt-1 text-xs text-[#d6cfdf]">
            امسح الرمز عبر تطبيق مصرف الراجحي لإتمام التحويل مباشرة
          </p>

          <div className="mt-4 w-full max-w-[260px] overflow-hidden rounded-[12px] border border-[#FF8FAB]/45 bg-white p-2 shadow-[0_0_24px_rgba(255,143,171,0.18)]">
            <img
              src={PAYMENT_INFO.qrImage}
              alt={`باركود التحويل البنكي لحساب ${PAYMENT_INFO.accountHolder} في ${PAYMENT_INFO.bankName}`}
              referrerPolicy="no-referrer"
              className="h-auto w-full rounded-[8px] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Simple Transfer & Receipt Steps */}
      <div className="wire-box rounded-[10px] bg-[#121010]/40 p-5 backdrop-blur-[6px] sm:p-6">
        <div className="border-b border-[#FF8FAB]/20 pb-3">
          <h2 className="text-xl font-black text-[#FF8FAB]">
            خطوات التحويل وإرسال الإيصال عبر واتساب
          </h2>
          <p className="mt-0.5 text-xs text-[#d6cfdf]">
            اتبع الخطوات التالية لإتمام الدفع وتأكيد طلبك بسرعة
          </p>
        </div>

        <ol className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {TRANSFER_STEPS.map((item) => (
            <li
              key={item.step}
              className="flex flex-col rounded-[10px] border border-[#FF8FAB]/30 bg-[#1E1A1E]/45 p-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF8FAB] text-sm font-black text-[#140b0f]">
                {item.step}
              </span>
              <h3 className="mt-3 text-sm font-black text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#d6cfdf]">
                {item.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappReceiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-[#FF8FAB] px-6 py-2.5 text-sm font-black text-[#140b0f] transition-opacity duration-150 hover:opacity-90"
          >
            <span>إرسال إيصال التحويل عبر واتساب</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] border border-[#FF8FAB] bg-transparent px-5 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-[#FF8FAB]/15"
          >
            <span>العودة لتصفح الأطباق</span>
          </button>
        </div>
      </div>
    </section>
  );
}
