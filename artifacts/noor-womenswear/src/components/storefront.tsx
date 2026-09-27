import { ArrowRight, Check, ChevronDown, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type { Product } from '@workspace/api-client-react';
import { useCart } from '@/hooks/use-cart';
import { useState, type ReactNode } from 'react';

const categories = ['All pieces', 'Kurtis', 'Long kurtis', 'Short kurtis', 'Night suits', 'Cord sets', 'Everyday wear'];

export function Header() {
  const [location] = useLocation();
  const { count, items, total, updateQuantity, removeItem } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const isCheckout = location === '/checkout';

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.92)] backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <Link href="/" data-testid="link-brand" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] transition-transform group-hover:rotate-[-12deg]">
              <span className="display-font text-xl italic">N</span>
            </span>
            <span className="display-font text-[27px] leading-none tracking-[-.03em] text-[hsl(var(--secondary))]">noor</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <Link href="/" data-testid="link-shop" className={`text-[11px] font-semibold uppercase tracking-[.18em] transition-colors ${location === '/' ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary))]'}`}>Shop all</Link>
            <Link href="/?category=Kurtis" data-testid="link-kurtis" className="text-[11px] font-semibold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--secondary))]">Kurtis</Link>
            <Link href="/?category=Everyday wear" data-testid="link-everyday" className="text-[11px] font-semibold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--secondary))]">Everyday edit</Link>
          </nav>
          <button type="button" onClick={() => setCartOpen(true)} data-testid="button-open-cart" className="group flex items-center gap-2 text-[hsl(var(--secondary))]">
            <span className="hidden text-[11px] font-semibold uppercase tracking-[.15em] sm:inline">{isCheckout ? 'Your bag' : 'Bag'}</span>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--secondary)/.2)] transition-colors group-hover:bg-[hsl(var(--secondary))] group-hover:text-[hsl(var(--background))]">
              <ShoppingBag size={17} strokeWidth={1.7} />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[hsl(var(--primary))] px-1 text-[10px] font-bold">{count}</span>}
            </span>
          </button>
        </div>
      </header>
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[hsl(var(--secondary)/.35)] backdrop-blur-sm" role="dialog" aria-label="Shopping bag">
          <button type="button" aria-label="Close shopping bag" data-testid="button-close-cart-overlay" className="absolute inset-0 cursor-default" onClick={() => setCartOpen(false)} />
          <aside className="relative flex h-full w-full max-w-[460px] flex-col bg-[hsl(var(--background))] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-5">
              <div>
                <p className="mono-font text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Your edit</p>
                <h2 className="display-font mt-1 text-3xl">Shopping bag <span className="text-[hsl(var(--accent))]">({count})</span></h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} data-testid="button-close-cart" className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted))]"><X size={17} /></button>
            </div>
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--accent))]"><ShoppingBag size={25} strokeWidth={1.4} /></div>
                <h3 className="display-font mt-5 text-3xl">It is a little quiet here.</h3>
                <p className="mt-2 max-w-[240px] text-sm leading-6 text-[hsl(var(--muted-foreground))]">Find a piece that feels like you and it will wait here.</p>
                <Link href="/" onClick={() => setCartOpen(false)} data-testid="link-empty-cart-shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-5 py-3 text-[11px] font-bold uppercase tracking-[.14em] text-[hsl(var(--background))]">Explore Noor <ArrowRight size={14} /></Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto py-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-4" data-testid={`cart-item-${item.product.id}`}>
                      <div className="h-[100px] w-[78px] shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--muted))]">
                        <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3"><div><p className="display-font text-xl leading-tight">{item.product.name}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{item.product.color} · Size {item.size}</p></div><button type="button" onClick={() => removeItem(item.product.id, item.size)} data-testid={`button-remove-cart-${item.product.id}`} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]"><Trash2 size={15} /></button></div>
                        <div className="mt-4 flex items-center justify-between"><div className="flex items-center rounded-full border border-[hsl(var(--border))]"><button type="button" onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} data-testid={`button-decrease-cart-${item.product.id}`} className="p-2"><Minus size={12} /></button><span className="w-6 text-center text-xs font-bold">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} data-testid={`button-increase-cart-${item.product.id}`} className="p-2"><Plus size={12} /></button></div><p className="font-semibold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[hsl(var(--border))] pt-5">
                  <div className="flex items-center justify-between"><span className="text-sm text-[hsl(var(--muted-foreground))]">Subtotal</span><strong className="text-lg">₹{total.toLocaleString('en-IN')}</strong></div>
                  <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Cash on delivery available across India.</p>
                  <Link href="/checkout" onClick={() => setCartOpen(false)} data-testid="link-go-checkout" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] py-4 text-xs font-bold uppercase tracking-[.15em] text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5">Continue to checkout <ArrowRight size={15} /></Link>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return <footer className="mt-24 border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary))] text-[hsl(var(--background))]">
    <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><p className="display-font text-4xl">Dress into your day.</p><p className="mt-4 max-w-[280px] text-sm leading-6 text-[hsl(var(--background)/.65)]">Thoughtful Indian clothing for the many little plans that make up a life.</p></div>
      <div><p className="mono-font text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Explore</p><div className="mt-4 flex flex-col gap-3 text-sm text-[hsl(var(--background)/.72)]"><Link href="/" data-testid="footer-link-shop">Shop all pieces</Link><Link href="/?category=Kurtis" data-testid="footer-link-kurtis">Kurtis</Link><Link href="/?category=Night suits" data-testid="footer-link-nightwear">Night suits</Link></div></div>
      <div><p className="mono-font text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">The Noor promise</p><p className="mt-4 text-sm leading-6 text-[hsl(var(--background)/.72)]">Easy silhouettes. Honest fabrics. Cash on delivery, because trust takes time.</p></div>
    </div>
    <div className="mx-auto flex max-w-[1320px] justify-between border-t border-[hsl(var(--background)/.12)] px-5 py-5 text-[10px] uppercase tracking-[.14em] text-[hsl(var(--background)/.5)] sm:px-8"><span>© Noor Womenswear</span><span>Made for everyday India</span></div>
  </footer>;
}

export function ProductCard({ product }: { product: Product }) {
  return <Link href={`/product/${product.slug}`} data-testid={`link-product-${product.id}`} className="product-card group block">
    <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[hsl(var(--muted))]">
      <img src={product.imageUrl} alt={product.name} className="product-card-image h-full w-full object-cover" />
      {product.featured && <span className="absolute left-3 top-3 rounded-full bg-[hsl(var(--background)/.9)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em]">Selected</span>}
      <span className="product-arrow absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--background)/.86)]"><ArrowRight size={15} /></span>
    </div>
    <div className="flex items-start justify-between gap-3 pt-4"><div><h3 className="display-font text-[22px] leading-none">{product.name}</h3><p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">{product.color} · {product.fabric}</p></div><div className="text-right"><p className="text-sm font-bold">₹{product.price.toLocaleString('en-IN')}</p>{product.originalPrice > product.price && <p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>}</div></div>
  </Link>;
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return <label htmlFor={htmlFor} className="mb-2 block text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">{children}</label>;
}

export { categories, Check, ChevronDown };