import { ArrowLeft, Check, Minus, Plus, RefreshCw, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { getGetProductQueryKey, useGetProduct } from '@workspace/api-client-react';
import { useCart } from '@/hooks/use-cart';
import { Footer, Header } from '@/components/storefront';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const { data: product, isLoading, isError, refetch } = useGetProduct(slug ?? '', { query: { enabled: Boolean(slug), queryKey: getGetProductQueryKey(slug ?? '') } });
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) return <div className="noor-shell"><Header /><main className="mx-auto grid max-w-[1320px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2"><div className="skeleton-sheen aspect-[4/5] rounded-2xl" /><div className="space-y-5 pt-8"><div className="skeleton-sheen h-5 w-1/3 rounded" /><div className="skeleton-sheen h-16 w-4/5 rounded" /><div className="skeleton-sheen h-5 w-1/4 rounded" /><div className="skeleton-sheen h-36 rounded" /></div></main></div>;
  if (isError || !product) return <div className="noor-shell"><Header /><main className="mx-auto max-w-[600px] px-5 py-32 text-center"><p className="display-font text-5xl">This piece slipped away.</p><p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">We could not find what you were looking for.</p><button type="button" onClick={() => refetch()} data-testid="button-retry-product" className="mt-7 mr-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.14em]"><RefreshCw size={14} /> Try again</button><Link href="/" data-testid="link-back-to-shop-error" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.14em] text-[hsl(var(--background))]">Back to shop</Link></main></div>;
  const availableProduct = product;
  const selectedSize = size || product.sizes[0] || 'Free size';

  function handleAdd() {
    addItem(availableProduct, selectedSize, quantity);
    setAdded(true);
  }

  return <div className="noor-shell noor-noise">
    <Header />
    <main className="mx-auto max-w-[1320px] px-5 py-7 sm:px-8 sm:py-12">
      <Link href="/" data-testid="link-back-to-catalog" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--secondary))]"><ArrowLeft size={14} /> Back to the edit</Link>
      <div className="mt-7 grid gap-10 lg:grid-cols-[1.03fr_.97fr] lg:gap-20">
        <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--muted))]"><img src={product.imageUrl} alt={product.name} className="aspect-[4/5] h-full w-full object-cover lg:aspect-auto lg:min-h-[680px]" /><span className="absolute bottom-5 left-5 rounded-full bg-[hsl(var(--background)/.9)] px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em]">{product.category}</span></div>
        <div className="flex flex-col justify-center py-2 lg:py-10">
          <p className="mono-font text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent))]">{product.color} / {product.fabric}</p>
          <h1 className="display-font mt-4 max-w-[560px] text-[clamp(3.4rem,7vw,6.4rem)] leading-[.86] tracking-[-.05em]">{product.name}</h1>
          <div className="mt-6 flex items-baseline gap-3"><span className="text-xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>{product.originalPrice > product.price && <span className="text-sm text-[hsl(var(--muted-foreground))] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>}<span className="ml-1 rounded-full bg-[hsl(var(--primary)/.3)] px-2 py-1 text-[10px] font-bold text-[hsl(var(--secondary))]">COD available</span></div>
          <p className="mt-7 max-w-[540px] text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">{product.description}</p>
          <div className="my-8 h-px bg-[hsl(var(--border))]" />
          <div><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.16em]">Choose your size</p><span className="text-xs text-[hsl(var(--muted-foreground))]">True to size</span></div><div className="mt-3 flex flex-wrap gap-2">{product.sizes.map((item) => <button key={item} type="button" onClick={() => setSize(item)} data-testid={`button-size-${item}`} className={`min-w-12 rounded-full border px-4 py-3 text-xs font-bold transition-colors ${selectedSize === item ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))] text-[hsl(var(--background))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--secondary))]'}`}>{item}</button>)}</div></div>
          <div className="mt-7 flex gap-3"><div className="flex items-center rounded-full border border-[hsl(var(--border))]"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} data-testid="button-decrease-quantity" className="p-3.5"><Minus size={14} /></button><span className="w-7 text-center text-sm font-bold" data-testid="text-quantity">{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} data-testid="button-increase-quantity" className="p-3.5"><Plus size={14} /></button></div><button type="button" onClick={handleAdd} data-testid="button-add-to-cart" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-4 text-xs font-bold uppercase tracking-[.15em] text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5">{added ? <><Check size={16} /> Added to your bag</> : <><ShoppingBag size={16} /> Add to bag</>}</button></div>
          {added && <button type="button" onClick={() => setLocation('/checkout')} data-testid="button-buy-now" className="mt-3 w-full rounded-full border border-[hsl(var(--secondary))] py-3 text-[11px] font-bold uppercase tracking-[.15em] transition-colors hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--background))]">Go to checkout <span aria-hidden="true">→</span></button>}
          <div className="mt-8 grid gap-3 border-t border-[hsl(var(--border))] pt-6 text-sm text-[hsl(var(--muted-foreground))] sm:grid-cols-2"><div className="flex gap-3"><Truck size={18} className="shrink-0 text-[hsl(var(--accent))]" /><span>Delivery in 4–7 working days</span></div><div className="flex gap-3"><Check size={18} className="shrink-0 text-[hsl(var(--accent))]" /><span>Easy exchange within 7 days</span></div></div>
          <div className="mt-8 space-y-3">{product.details.map((detail, index) => <div key={detail} className="flex gap-4 border-t border-[hsl(var(--border))] py-4 text-sm"><span className="mono-font text-[10px] text-[hsl(var(--accent))]">0{index + 1}</span><span>{detail}</span></div>)}</div>
        </div>
      </div>
    </main>
    <Footer />
  </div>;
}