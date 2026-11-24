import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `أنت مساعد ذكي لخدمة عملاء متجر "طبخ البيت" لجميع المأكولات الشعبية.

معلومات المتجر:
- الاسم: طبخ البيت — لجميع المأكولات الشعبية
- صاحبة المشروع: أم أحمد — تطبخ بحب ونظافة منزلية
- الموقع: جدة - حي الواحة - مخطط السندس
- رقم الجوال والواتساب: 0539227842
- رقم الوثيقة: FL-025098438 / FL-025098439
- رقم التوثيق: 0000198702
- التوصيل: متاح لجميع أنحاء جدة
- جميع الأطباق طازجة وتُطبخ يوم الطلب بمكونات أصلية ونظيفة

قائمة الأصناف المتوفرة:
- أطباق الرز: كابلي - لحم، برياني - دجاج، بخاري - دجاج، صيادية - سمك، كشري
- الصواني والمقبلات: نودلز، باشميل، محاشي خضار، فوتشيني، رولات التوست، كرات بطاطس، كبة و سبرنغ رول، منتو و سمبوسة و فرموزة
- السلطات: فتة ورق عنب، سلطة سيزر، تبولة، فتوش
- الحلى: كنافة، أم علي، سوفليه نوتيلا، ترافل مانجو، حلى أوريو

أسلوب الرد:
- كن ودوداً وسريعاً ومختصراً (2 إلى 4 جمل واضحة باللغة العربية).
- إذا سأل العميل عن الأسعار أخبره: "يرجى التواصل مباشرة عبر الواتساب لمعرفة الأسعار الحالية على الرقم 0539227842".
- إذا سأل عن طريقة الطلب أخبره: "اختر الأطباق التي تريدها وأضفها للسلة، ثم افتح السلة وأدخل اسمك وحيّك في جدة واضغط إرسال الطلب عبر واتساب، أو تواصل معنا مباشرة على 0539227842".`;

interface ChatInputMessage {
  role: 'user' | 'model';
  text: string;
}

function validateMessages(raw: unknown): ChatInputMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) {
    return null;
  }

  const sanitized: ChatInputMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const role = (item as Record<string, unknown>).role;
    const text = (item as Record<string, unknown>).text;
    if (role !== 'user' && role !== 'model') return null;
    if (typeof text !== 'string') return null;
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 1000) return null;
    sanitized.push({ role, text: trimmed });
  }

  if (sanitized[sanitized.length - 1]?.role !== 'user') {
    return null;
  }

  return sanitized;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/chat', async (req: Request, res: Response) => {
    const messages = validateMessages(req.body?.messages);
    if (!messages) {
      res.status(400).json({ error: 'يرجى إرسال رسالة صالحة.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      res.status(503).json({
        error: 'خدمة المساعد غير مهيأة حالياً. يمكنك التواصل معنا مباشرة عبر واتساب: 0539227842.',
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({
          error: 'لم يتم استلام رد واضح، يرجى المحاولة مرة أخرى.',
        });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      const status =
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        typeof (err as { status?: unknown }).status === 'number'
          ? (err as { status: number }).status
          : 500;

      if (status === 400 || status === 403 || message.includes('API_KEY')) {
        res.status(502).json({
          error: 'تعذر التحقق من خدمة الذكاء الاصطناعي حالياً. تواصل معنا عبر واتساب: 0539227842.',
        });
        return;
      }

      if (status === 429) {
        res.status(429).json({
          error: 'تم تجاوز حد الطلبات مؤقتاً، يرجى الانتظار لحظات والمحاولة مجدداً.',
        });
        return;
      }

      res.status(502).json({
        error: 'حدث خطأ أثناء الاتصال بالمساعد. تواصل معنا عبر واتساب: 0539227842.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use('/tabkh-albeit', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
