import { ArrowDown, ArrowRight, Check, RefreshCw, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { getListProductsQueryKey, useListProducts } from '@workspace/api-client-react';
import { Footer, Header, ProductCard, categories } from '@/components/storefront';

function ProductSkeleton() {
  return <div className="space-y-4"><div className="skeleton-sheen aspect-[4/5] rounded-[14px]" /><div className="skeleton-sheen h-6 w-2/3 rounded" /><div className="skeleton-sheen h-4 w-1/3 rounded" /></div>;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const { data: products, isLoading, isError, refetch } = useListProducts({ query: { queryKey: getListProductsQueryKey() } });
  const category = new URLSearchParams(location.split('?')[1] ?? '').get('category') ?? 'All pieces';
  const list = useMemo(() => products ?? [], [products]);
  const filtered = useMemo(() => category === 'All pieces' ? list : list.filter((product) => product.category.toLowerCase() === category.toLowerCase()), [category, list]);
  const featured = useMemo(() => list.filter((product) => product.featured), [list]);
  const heroProduct = featured[0] ?? list[0];

  return <div className="noor-shell noor-noise">
    <Header />
    <main>
      <section className="mx-auto max-w-[1320px] px-5 pb-20 pt-10 sm:px-8 sm:pt-16 lg:pb-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="reveal max-w-[680px]">
            <div className="flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-current" /><span className="mono-font text-[10px] font-bold uppercase tracking-[.2em]">A little more you</span></div>
            <h1 className="display-font mt-6 text-[clamp(4.2rem,10vw,8.4rem)] leading-[.83] tracking-[-.055em] text-[hsl(var(--secondary))]">The everyday<br /><em className="text-[hsl(var(--accent))]">edit.</em></h1>
            <p className="mt-8 max-w-[450px] text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">Indian dressing that meets you where you are — unhurried mornings, full calendars, and all the in-between.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4"><a href="#catalog" data-testid="link-browse-catalog" className="inline-flex items-center gap-3 rounded-full bg-[hsl(var(--secondary))] px-6 py-4 text-[11px] font-bold uppercase tracking-[.15em] text-[hsl(var(--background))] transition-transform hover:-translate-y-1">Browse the edit <ArrowDown size={15} /></a><span className="text-xs text-[hsl(var(--muted-foreground))]">COD across India</span></div>
          </div>
          <div className="reveal reveal-delay-2 relative min-h-[430px] overflow-hidden rounded-[22px] bg-[hsl(var(--secondary))] sm:min-h-[500px]">
            {heroProduct ? <img src={heroProduct.imageUrl} alt={heroProduct.name} className="absolute inset-0 h-full w-full object-cover opacity-90" /> : <div className="absolute inset-0 bg-[hsl(var(--accent))]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--secondary)/.7)] via-transparent to-[hsl(var(--secondary)/.05)]" />
            <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-[hsl(var(--background)/.88)] px-3 py-2 text-[10px] font-bold uppercase tracking-[.13em]"><Sparkles size={13} className="text-[hsl(var(--accent))]" /> New season, softly</div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-[hsl(var(--background))]"><div><p className="mono-font text-[10px] uppercase tracking-[.18em] text-[hsl(var(--background)/.65)]">Featured piece</p><p className="display-font mt-1 text-3xl">{heroProduct?.name ?? 'Made for you'}</p></div><span className="display-font text-6xl italic text-[hsl(var(--primary))]">01</span></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--muted)/.42)]" aria-label="Noor values">
        <div className="mx-auto grid max-w-[1320px] divide-y divide-[hsl(var(--border))] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8"><div className="flex items-center gap-3 py-5 sm:justify-center sm:py-6"><Check size={17} className="text-[hsl(var(--accent))]" /><span className="text-sm">Easy fits, considered well</span></div><div className="flex items-center gap-3 py-5 sm:justify-center sm:py-6"><Check size={17} className="text-[hsl(var(--accent))]" /><span className="text-sm">Cash on delivery, always</span></div><div className="flex items-center gap-3 py-5 sm:justify-center sm:py-6"><Check size={17} className="text-[hsl(var(--accent))]" /><span className="text-sm">Made for Indian days</span></div></div>
      </section>

      <section id="catalog" className="mx-auto max-w-[1320px] px-5 pb-20 pt-20 sm:px-8 lg:pt-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mono-font text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent))]">Find your rhythm</p><h2 className="display-font mt-3 text-5xl tracking-[-.04em] sm:text-6xl">Pieces for right now.</h2></div><p className="max-w-[260px] text-sm leading-6 text-[hsl(var(--muted-foreground))]">From first chai to last call, these are the ones you will reach for.</p></div>
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Product categories">{categories.map((item) => <button key={item} type="button" onClick={() => setLocation(item === 'All pieces' ? '/' : `/?category=${encodeURIComponent(item)}`)} data-testid={`button-category-${item.toLowerCase().replaceAll(' ', '-')}`} className={`shrink-0 rounded-full border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.1em] transition-all ${category === item ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))] text-[hsl(var(--background))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))]'}`}>{item}</button>)}</div>
        {isLoading && <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /></div>}
        {isError && <div className="mt-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-16 text-center"><p className="display-font text-3xl">The rails are a little tangled.</p><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">We could not load the edit just now.</p><button type="button" onClick={() => refetch()} data-testid="button-retry-products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.15em] text-[hsl(var(--background))]"><RefreshCw size={14} /> Try again</button></div>}
        {!isLoading && !isError && filtered.length === 0 && <div className="mt-10 rounded-2xl border border-dashed border-[hsl(var(--border))] px-6 py-20 text-center"><p className="display-font text-3xl">Nothing here yet.</p><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Try another corner of the edit.</p><button type="button" onClick={() => setLocation('/')} data-testid="button-reset-category" className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[hsl(var(--accent))]">See all pieces <ArrowRight size={14} className="ml-1 inline" /></button></div>}
        {!isLoading && !isError && filtered.length > 0 && <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((product, index) => <div key={product.id} className={`reveal reveal-delay-${Math.min(index % 4, 3)}`}><ProductCard product={product} /></div>)}</div>}
      </section>
    </main>
    <Footer />
  </div>;
}