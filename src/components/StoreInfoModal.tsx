import { X, Phone, MapPin, Mail, ShieldCheck, FileText, Truck, ExternalLink } from 'lucide-react';
import { STORE_INFO } from '@/src/data/menu';
import { BrandMark } from './BrandMark';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreInfoModal({ isOpen, onClose }: StoreInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-info-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-[20px] border border-[#ea7ca2]/45 bg-[#141318] p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-6 w-8" />
            <h2 id="store-info-title" className="text-lg font-extrabold">
              بيانات المتجر والتواصل
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة بيانات المتجر"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#b8b1c0] transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-[#b8b1c0]">
          أهلاً بك في مطبخ{' '}
          <strong className="font-extrabold text-white">{STORE_INFO.brandName}</strong>{' '}
          — {STORE_INFO.tagline}
        </p>

        <dl className="mt-4 space-y-3 divide-y divide-white/8 text-sm">
          <div className="flex items-center justify-between pt-2">
            <dt className="flex items-center gap-2 text-[#b8b1c0]">
              <FileText className="h-4 w-4 text-[#ea7ca2]" />
              <span>رقم الوثيقة</span>
            </dt>
            <dd dir="ltr" className="font-bold tabular-nums text-white">
              {STORE_INFO.documentId}
            </dd>
          </div>
          <div className="flex items-center justify-between pt-3">
            <dt className="flex items-center gap-2 text-[#b8b1c0]">
              <ShieldCheck className="h-4 w-4 text-[#ea7ca2]" />
              <span>رقم التوثيق</span>
            </dt>
            <dd className="font-bold tabular-nums text-white">
              {STORE_INFO.verificationId}
            </dd>
          </div>
          <div className="flex items-center justify-between pt-3">
            <dt className="flex items-center gap-2 text-[#b8b1c0]">
              <MapPin className="h-4 w-4 text-[#ea7ca2]" />
              <span>الموقع</span>
            </dt>
            <dd className="font-bold text-white">{STORE_INFO.location}</dd>
          </div>
          <div className="flex items-center justify-between pt-3">
            <dt className="flex items-center gap-2 text-[#b8b1c0]">
              <Phone className="h-4 w-4 text-[#ea7ca2]" />
              <span>الجوال</span>
            </dt>
            <dd dir="ltr" className="font-bold tabular-nums text-white">
              <a
                href={`tel:${STORE_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                className="hover:text-[#ea7ca2]"
              >
                {STORE_INFO.phoneDisplay}
              </a>
            </dd>
          </div>
          <div className="flex items-center justify-between pt-3">
            <dt className="flex items-center gap-2 text-[#b8b1c0]">
              <Mail className="h-4 w-4 text-[#ea7ca2]" />
              <span>البريد</span>
            </dt>
            <dd className="font-bold text-white">
              <a
                href={`mailto:${STORE_INFO.email}`}
                className="hover:text-[#ea7ca2]"
              >
                {STORE_INFO.email}
              </a>
            </dd>
          </div>
          <div className="flex items-center justify-between pt-3">
            <dt className="flex items-center gap-2 text-[#b8b1c0]">
              <Truck className="h-4 w-4 text-[#ea7ca2]" />
              <span>التوصيل</span>
            </dt>
            <dd className="font-bold text-white">{STORE_INFO.deliveryNote}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href={`https://wa.me/${STORE_INFO.phoneWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#ea7ca2] to-[#c95b82] px-4 py-3 text-sm font-extrabold text-[#140b0f] transition-opacity hover:opacity-95"
          >
            <span>تواصل واتساب مباشر</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${STORE_INFO.email}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#140b0f] transition-colors hover:bg-white/90"
          >
            <span>راسلنا عبر البريد الإلكتروني</span>
          </a>
        </div>
      </div>
    </div>
  );
}
