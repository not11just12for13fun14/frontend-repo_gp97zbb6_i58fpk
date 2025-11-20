import { useEffect, useMemo, useRef, useState } from 'react'
import { ShoppingCart, Phone, Calendar, MapPin, Instagram, Facebook, Twitter, ChevronRight, Menu as MenuIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiGet, apiPost } from './components/api'

const COLORS = {
  primary: '#FF6B6B',
  secondary: '#2B3A67',
  background: '#FAFAFB',
  kokum: '#8E3B7E',
}

const INFO_DEFAULT = {
  name: 'Kokum & Coast – Coastal Maharashtra, Reimagined',
  address: 'Shop No. 12, Colaba Causeway, Colaba, Mumbai 400005',
  phone: '+91-22-4000-1234',
  email: 'hello@kokumandcoast.in',
  hours: {},
}

function Navbar({ onReserveClick, onOrderClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav aria-label="Main" className={`fixed top-0 left-0 right-0 z-50 transition ${scrolled ? 'backdrop-blur bg-white/80 shadow' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400">
          <span className="text-xl font-bold" style={{color: COLORS.kokum}}>Kokum & Coast</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href="#menu" className="hover:text-pink-600">Menu</a>
          <a href="#gallery" className="hover:text-pink-600">Gallery</a>
          <a href="#reviews" className="hover:text-pink-600">Reviews</a>
          <a href="#contact" className="hover:text-pink-600">Contact</a>
          <button onClick={onReserveClick} className="px-4 py-2 rounded-full text-white" style={{background: COLORS.secondary}}>Reserve</button>
          <button onClick={onOrderClick} className="px-4 py-2 rounded-full text-white flex items-center gap-2" style={{background: COLORS.primary}}>
            <ShoppingCart size={18}/> Order
          </button>
        </div>
        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>
          {open ? <X/> : <MenuIcon/>}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="md:hidden px-4 pb-4 space-y-3 bg-white/90">
            <a href="#menu" className="block">Menu</a>
            <a href="#gallery" className="block">Gallery</a>
            <a href="#reviews" className="block">Reviews</a>
            <a href="#contact" className="block">Contact</a>
            <button onClick={onReserveClick} className="w-full px-4 py-2 rounded-full text-white" style={{background: COLORS.secondary}}>Reserve</button>
            <button onClick={onOrderClick} className="w-full px-4 py-2 rounded-full text-white flex items-center gap-2 justify-center" style={{background: COLORS.primary}}>
              <ShoppingCart size={18}/> Order
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function Hero({ onReserveClick, onOrderClick }) {
  return (
    <header className="relative pt-20" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only absolute left-2 top-2 bg-white text-black px-3 py-1">Skip to content</a>
      <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-b-[2rem]" aria-label="Mumbai coastal background">
        <img src="https://images.unsplash.com/photo-1599669454699-248893623438?q=80&w=2000&auto=format&fit=crop" alt="Colaba coastline at sunset" className="w-full h-full object-cover" loading="lazy"/>
        <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(43,58,103,0.8), rgba(0,0,0,0.2))'}}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.h1 initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.6}} className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">Kokum & Coast</motion.h1>
          <motion.p initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.1}} className="text-white/90 mt-3 text-lg md:text-2xl">Coastal Maharashtra, reimagined in the heart of Colaba</motion.p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={onReserveClick} className="px-6 py-3 rounded-full text-white" style={{background: COLORS.secondary}}><Calendar className="inline mr-2" size={18}/> Reserve Table</button>
            <button onClick={onOrderClick} className="px-6 py-3 rounded-full text-white" style={{background: COLORS.primary}}><ShoppingCart className="inline mr-2" size={18}/> Order Online</button>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuSection({ addToCart }) {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('All')
  const categories = ['All','Starters','Mains','Beverages','Desserts']
  useEffect(() => { apiGet('/api/menu').then(setItems).catch(()=>{}) }, [])
  const filtered = useMemo(() => filter==='All'? items : items.filter(i=>i.category===filter), [items, filter])
  return (
    <section id="menu" className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold" style={{color: COLORS.secondary}}>Our Menu</h2>
        <div className="flex gap-2">
          {categories.map(c=> (
            <button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 rounded-full border ${filter===c? 'text-white' : ''}`} style={{background: filter===c? COLORS.kokum : 'transparent', borderColor: COLORS.kokum}}>{c}</button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((it)=> (
          <motion.div key={it.id} initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{it.name} {it.veg && <span aria-label="Vegetarian" title="Vegetarian" className="ml-1 text-green-600">•</span>}</h3>
                <p className="text-sm text-slate-600">{it.description}</p>
              </div>
              <span className="font-semibold" style={{color: COLORS.kokum}}>₹{it.price}</span>
            </div>
            <div className="mt-3 flex justify-end">
              <button aria-label={`Add ${it.name} to cart`} onClick={()=>addToCart(it)} className="px-3 py-2 rounded-full text-white" style={{background: COLORS.primary}}>Add</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Cart({ open, setOpen, cart, setCart, onCheckout }) {
  const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0)
  useEffect(()=>{ localStorage.setItem('kokum_cart', JSON.stringify(cart)) }, [cart])
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-black/50">
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 overflow-y-auto">
            <button onClick={()=>setOpen(false)} className="absolute right-4 top-4" aria-label="Close cart"><X/></button>
            <h3 className="text-2xl font-bold mb-4" style={{color: COLORS.secondary}}>Your Order</h3>
            <div className="space-y-3">
              {cart.length===0 && <p className="text-slate-600">Your cart is empty.</p>}
              {cart.map((it, idx)=> (
                <div key={idx} className="flex items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <p className="font-medium">{it.name}</p>
                    <p className="text-sm text-slate-600">₹{it.price} × {it.qty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button aria-label="Decrease" onClick={()=> setCart(c=> c.map((x,i)=> i===idx? {...x, qty: Math.max(1, x.qty-1)} : x))} className="px-2">-</button>
                    <span aria-live="polite">{it.qty}</span>
                    <button aria-label="Increase" onClick={()=> setCart(c=> c.map((x,i)=> i===idx? {...x, qty: x.qty+1} : x))} className="px-2">+</button>
                    <button aria-label="Remove" onClick={()=> setCart(c=> c.filter((_,i)=> i!==idx))} className="px-2 text-red-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <button disabled={cart.length===0} onClick={onCheckout} className="w-full mt-4 px-4 py-3 rounded-full text-white disabled:opacity-50" style={{background: COLORS.primary}}>Proceed to Checkout</button>
          </aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Checkout({ open, setOpen, cart, onPlace }) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'' })
  const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0)
  const taxes = subtotal * 0.05
  const total = subtotal + taxes
  const submit = async () => {
    const payload = {
      items: cart.map(i=> ({ name: i.name, qty: i.qty, price: i.price })),
      subtotal, taxes, total,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email,
      address: form.address,
    }
    await apiPost('/api/orders', payload)
    localStorage.removeItem('kokum_cart')
    setOpen(false)
    onPlace()
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[70] bg-black/50">
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-2xl font-bold mb-4" style={{color: COLORS.secondary}}>Checkout</h3>
              <div className="grid gap-3">
                {['name','phone','email','address'].map(k=> (
                  <input key={k} value={form[k]} onChange={e=> setForm(f=> ({...f, [k]: e.target.value}))} placeholder={k[0].toUpperCase()+k.slice(1)} className="border rounded px-3 py-2"/>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span>Payable</span>
                <strong>₹{total.toFixed(2)}</strong>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={()=>setOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button onClick={submit} className="px-4 py-2 rounded text-white" style={{background: COLORS.primary}}>Place Order</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ReservationForm() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', date:'', time:'', guests:2, special_requests:'' })
  const [status, setStatus] = useState(null)
  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await apiPost('/api/reservations', { ...form, guests: Number(form.guests) })
      setStatus({ ok: true, id: res.id })
      setForm({ name:'', phone:'', email:'', date:'', time:'', guests:2, special_requests:'' })
    } catch (err) {
      setStatus({ ok: false })
    }
  }
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: COLORS.secondary}}>Reserve a Table</h2>
      <form onSubmit={submit} className="grid gap-4 bg-white rounded-2xl p-6 shadow" aria-label="Reservation form">
        <div className="grid md:grid-cols-2 gap-3">
          {['name','phone','email','date','time','guests'].map((k)=> (
            <input key={k} required={k!=='email'} value={form[k]} onChange={e=> setForm(f=> ({...f, [k]: e.target.value}))} placeholder={k[0].toUpperCase()+k.slice(1)} className="border rounded px-3 py-2" aria-label={k}/>
          ))}
        </div>
        <textarea value={form.special_requests} onChange={e=> setForm(f=> ({...f, special_requests: e.target.value}))} placeholder="Special requests" className="border rounded px-3 py-2"/>
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-3 rounded-full text-white" style={{background: COLORS.secondary}}>Submit</button>
          {status && (status.ok ? <p className="text-green-700">Reservation requested ✓</p> : <p className="text-red-700">Something went wrong</p>)}
        </div>
      </form>
    </section>
  )
}

function Reviews() {
  const [rows, setRows] = useState([])
  useEffect(()=>{ apiGet('/api/reviews').then(setRows).catch(()=>{}) }, [])
  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: COLORS.secondary}}>What guests say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {rows.map((r, i)=> (
          <div key={i} className="bg-white rounded-2xl p-5 shadow">
            <div className="flex items-center justify-between mb-2">
              <strong>{r.name}</strong>
              <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
            </div>
            <p className="text-slate-700">{r.comment}</p>
            <p className="text-sm text-slate-500 mt-2">{r.city}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Gallery() {
  const images = [
    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=1200&auto=format&fit=crop',
  ]
  return (
    <section id="gallery" className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: COLORS.secondary}}>Gallery</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i)=> (
          <img key={i} src={src} alt="Restaurant" loading="lazy" className="rounded-2xl h-56 object-cover w-full"/>
        ))}
      </div>
    </section>
  )
}

function Footer({ info }) {
  return (
    <footer id="contact" className="bg-slate-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold">Kokum & Coast</h3>
          <p className="text-slate-300 mt-2">{info.address}</p>
          <p className="text-slate-300 mt-1">{info.phone}</p>
          <a href="mailto:hello@kokumandcoast.in" className="text-slate-300 underline">hello@kokumandcoast.in</a>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Follow us</h4>
          <div className="flex gap-3">
            <a aria-label="Instagram" href="https://instagram.com/kokumandcoast"><Instagram/></a>
            <a aria-label="Facebook" href="https://facebook.com/kokumandcoast"><Facebook/></a>
            <a aria-label="Twitter" href="https://twitter.com/kokumandcoast"><Twitter/></a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Find us</h4>
          <iframe title="Map" className="w-full h-40 rounded" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Colaba%20Causeway%2C%20Mumbai&output=embed"></iframe>
        </div>
      </div>
      <div className="text-center text-slate-400 py-4 text-sm">© {new Date().getFullYear()} Kokum & Coast</div>
    </footer>
  )
}

export default function App(){
  const [info, setInfo] = useState(INFO_DEFAULT)
  const [cart, setCart] = useState(()=> JSON.parse(localStorage.getItem('kokum_cart')||'[]'))
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(()=>{ apiGet('/api/info').then(setInfo).catch(()=>{}) }, [])

  const addToCart = (item)=> {
    setCart(c=> {
      const idx = c.findIndex(x=> x.name===item.name)
      if (idx>-1) return c.map((x,i)=> i===idx? {...x, qty: x.qty+1} : x)
      return [...c, { name: item.name, price: item.price, qty: 1 }]
    })
    setCartOpen(true)
  }

  return (
    <div id="main" className="min-h-screen" style={{background: COLORS.background, color: '#111'}}>
      <Navbar onReserveClick={()=> document.getElementById('reserve')?.scrollIntoView({behavior:'smooth'})} onOrderClick={()=> setCartOpen(true)} />
      <Hero onReserveClick={()=> document.getElementById('reserve')?.scrollIntoView({behavior:'smooth'})} onOrderClick={()=> setCartOpen(true)} />

      <MenuSection addToCart={addToCart} />

      <section id="reserve" className="bg-gradient-to-r from-pink-50 to-purple-50">
        <ReservationForm />
      </section>

      <Gallery />
      <Reviews />
      <Footer info={info} />

      <Cart open={cartOpen} setOpen={setCartOpen} cart={cart} setCart={setCart} onCheckout={()=> setCheckoutOpen(true)} />
      <Checkout open={checkoutOpen} setOpen={setCheckoutOpen} cart={cart} onPlace={()=> alert('Order placed!')} />

      <button onClick={()=> setCartOpen(true)} aria-label="Open cart" className="fixed bottom-6 right-6 p-4 rounded-full text-white shadow-lg" style={{background: COLORS.primary}}>
        <ShoppingCart/>
      </button>
    </div>
  )
}
