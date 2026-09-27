import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, LockKeyhole, MessageCircle, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'wouter';
import { z } from 'zod';
import type { OrderInput, OrderResult } from '@workspace/api-client-react';
import { useCreateOrder } from '@workspace/api-client-react';
import { FieldLabel, Header } from '@/components/storefront';
import { useCart } from '@/hooks/use-cart';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Please add your full name.'),
  phone: z.string().min(10, 'Add a 10-digit phone number.').max(15, 'That number looks too long.'),
  address: z.string().min(8, 'Please add your complete address.'),
  city: z.string().min(2, 'Add your city.'),
  pincode: z.string().length(6, 'Pincode should be 6 digits.').regex(/^\d+$/, 'Use numbers only.'),
  notes: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

function OrderConfirmation({ result }: { result: OrderResult }) {
  return <main className="mx-auto max-w-[760px] px-5 py-16 text-center sm:py-24">
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--secondary))]"><Check size={34} strokeWidth={2.5} /></div>
    <p className="mono-font mt-7 text-[10px] uppercase tracking-[.22em] text-[hsl(var(--accent))]">Order received</p>
    <h1 className="display-font mt-4 text-[clamp(3.6rem,8vw,6.5rem)] leading-[.88] tracking-[-.05em]">A good choice,<br /><em>on its way.</em></h1>
    <p className="mx-auto mt-6 max-w-[470px] text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">Thank you for choosing Noor. We will call to confirm your cash-on-delivery order before dispatch.</p>
    <div className="mx-auto mt-9 max-w-[440px] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-left"><div className="flex items-center justify-between"><span className="mono-font text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Order number</span><span className="font-mono text-sm font-bold">{result.orderId}</span></div><div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4"><span className="text-sm text-[hsl(var(--muted-foreground))]">Cash on delivery total</span><strong data-testid="text-confirmation-total">₹{result.total.toLocaleString('en-IN')}</strong></div></div>
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href={result.whatsappUrl} target="_blank" rel="noreferrer" data-testid="link-order-whatsapp" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3c7654] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.13em] text-white transition-transform hover:-translate-y-0.5"><MessageCircle size={16} /> Confirm on WhatsApp</a><a href={result.emailUrl} target="_blank" rel="noreferrer" data-testid="link-order-email" className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.13em] transition-colors hover:border-[hsl(var(--secondary))]"><Mail size={16} /> Keep via email</a></div>
    <Link href="/" data-testid="link-confirmation-shop" className="mt-9 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary))]"><ArrowLeft size={14} /> Keep browsing</Link>
  </main>;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [result, setResult] = useState<OrderResult | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: '', phone: '', address: '', city: '', pincode: '', notes: '' },
  });

  if (result) return <div className="noor-shell noor-noise"><Header /><OrderConfirmation result={result} /></div>;
  if (items.length === 0) return <div className="noor-shell noor-noise"><Header /><main className="mx-auto max-w-[620px] px-5 py-28 text-center sm:py-40"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))]"><MapPin size={24} className="text-[hsl(var(--accent))]" /></div><h1 className="display-font mt-6 text-5xl">Your bag is waiting.</h1><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Add a piece before you check out. We will keep it safe here.</p><Link href="/" data-testid="link-empty-checkout-shop" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-6 py-4 text-[11px] font-bold uppercase tracking-[.15em] text-[hsl(var(--background))]">Browse pieces <ArrowRight size={15} /></Link></main></div>;

  async function onSubmit(values: CheckoutValues) {
    const payload: OrderInput = {
      ...values,
      items: items.map(({ product, size, quantity }) => ({ productId: product.id, productName: product.name, size, quantity, unitPrice: product.price })),
      total,
    };
    createOrder.mutate({ data: payload }, { onSuccess: (order) => { setResult(order); clearCart(); } });
  }

  return <div className="noor-shell noor-noise">
    <Header />
    <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 sm:py-14">
      <Link href="/" data-testid="link-checkout-back" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary))]"><ArrowLeft size={14} /> Back to the edit</Link>
      <div className="mt-9 grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">
        <section><div className="flex items-end justify-between"><div><p className="mono-font text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent))]">Step 02 / 02</p><h1 className="display-font mt-3 text-6xl leading-[.9] tracking-[-.04em] sm:text-7xl">Where should<br /><em>we send it?</em></h1></div><div className="hidden items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] sm:flex"><LockKeyhole size={15} /> Secure checkout</div></div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 max-w-[680px] space-y-7" noValidate>
            <div><FieldLabel htmlFor="customerName">Full name</FieldLabel><input id="customerName" data-testid="input-customer-name" {...register('customerName')} placeholder="Your name" className="noor-input" />{errors.customerName && <p className="noor-error">{errors.customerName.message}</p>}</div>
            <div><FieldLabel htmlFor="phone">Phone number</FieldLabel><div className="relative"><Phone size={16} className="noor-input-icon" /><input id="phone" data-testid="input-phone" {...register('phone')} placeholder="+91 98765 43210" className="noor-input pl-11" /></div>{errors.phone && <p className="noor-error">{errors.phone.message}</p>}<p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">We will call once to confirm your order.</p></div>
            <div><FieldLabel htmlFor="address">Delivery address</FieldLabel><textarea id="address" data-testid="input-address" {...register('address')} placeholder="House / flat, street, landmark" rows={3} className="noor-input resize-none" />{errors.address && <p className="noor-error">{errors.address.message}</p>}</div>
            <div className="grid gap-5 sm:grid-cols-2"><div><FieldLabel htmlFor="city">City</FieldLabel><input id="city" data-testid="input-city" {...register('city')} placeholder="Mumbai" className="noor-input" />{errors.city && <p className="noor-error">{errors.city.message}</p>}</div><div><FieldLabel htmlFor="pincode">Pincode</FieldLabel><input id="pincode" inputMode="numeric" data-testid="input-pincode" {...register('pincode')} placeholder="400001" className="noor-input" />{errors.pincode && <p className="noor-error">{errors.pincode.message}</p>}</div></div>
            <div><FieldLabel htmlFor="notes">Note for us <span className="font-normal normal-case tracking-normal">(optional)</span></FieldLabel><textarea id="notes" data-testid="input-notes" {...register('notes')} placeholder="A landmark, preferred call time..." rows={2} className="noor-input resize-none" /></div>
            {createOrder.isError && <div className="rounded-lg border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.06)] px-4 py-3 text-sm text-[hsl(var(--destructive))]" data-testid="status-order-error">We could not place that order just yet. Please check your details and try again.</div>}
            <button type="submit" disabled={createOrder.isPending} data-testid="button-place-order" className="flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] py-4 text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{createOrder.isPending ? 'Placing your order…' : <>Place COD order <ArrowRight size={16} /></>}</button>
          </form>
        </section>
        <aside className="h-fit rounded-2xl bg-[hsl(var(--secondary))] p-6 text-[hsl(var(--background))] sm:p-8 lg:sticky lg:top-28"><p className="mono-font text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Your order</p><div className="mt-6 space-y-5">{items.map((item) => <div key={`${item.product.id}-${item.size}`} className="flex gap-4" data-testid={`checkout-item-${item.product.id}`}><div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--background)/.12)]"><img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" /></div><div className="flex-1"><p className="display-font text-xl leading-none">{item.product.name}</p><p className="mt-2 text-xs text-[hsl(var(--background)/.58)]">Size {item.size} · Qty {item.quantity}</p></div><p className="text-sm font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p></div>)}</div><div className="mt-7 border-t border-[hsl(var(--background)/.16)] pt-5"><div className="flex items-center justify-between"><span className="text-sm text-[hsl(var(--background)/.65)]">Total to pay</span><strong className="text-2xl">₹{total.toLocaleString('en-IN')}</strong></div><p className="mt-3 text-xs leading-5 text-[hsl(var(--background)/.55)]">Pay in cash when your Noor parcel arrives. No advance payment.</p></div><div className="mt-7 space-y-3 border-t border-[hsl(var(--background)/.16)] pt-5 text-xs text-[hsl(var(--background)/.72)]"><div className="flex gap-3"><ShieldCheck size={16} className="shrink-0 text-[hsl(var(--primary))]" /><span>Your details stay private and are only used to deliver your order.</span></div><div className="flex gap-3"><MapPin size={16} className="shrink-0 text-[hsl(var(--primary))]" /><span>Delivery in 4–7 working days across India.</span></div></div></aside>
      </div>
    </main>
  </div>;
}