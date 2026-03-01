import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map as MapIcon, 
  ShoppingBag, 
  User as UserIcon, 
  Home as HomeIcon, 
  Star, 
  Trophy, 
  Menu, 
  X,
  ChevronLeft,
  Lock,
  Play
} from 'lucide-react';
import { User, Site, Product } from './types';

// --- Components ---

const Navbar = ({ user, lang, setLang }: { user: User | null, lang: 'ar' | 'en', setLang: (l: 'ar' | 'en') => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', path: '/', icon: HomeIcon },
    { name: lang === 'ar' ? 'الخريطة' : 'Map', path: '/map', icon: MapIcon },
    { name: lang === 'ar' ? 'المتجر' : 'Shop', path: '/shop', icon: ShoppingBag },
    { name: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', path: '/dashboard', icon: Trophy },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-sand-dark">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-12 h-12 bg-nature rounded-full flex items-center justify-center text-white font-kids text-2xl kids-shadow">
            {lang === 'ar' ? 'د' : 'D'}
          </div>
          <span className="text-3xl font-black text-nature font-kids">{lang === 'ar' ? 'درب' : 'Darb'}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 font-bold text-lg transition-colors ${
                location.pathname === item.path ? 'text-nature' : 'text-stone-500 hover:text-nature'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
          
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="bg-sand-dark/20 px-3 py-1 rounded-lg font-bold hover:bg-sand-dark/40 transition-colors"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {user ? (
            <Link to="/dashboard" className="flex items-center gap-2 bg-sand px-4 py-2 rounded-full font-bold">
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border-2 border-white" />
              <span>{user.points} {lang === 'ar' ? 'نقطة' : 'Pts'}</span>
            </Link>
          ) : (
            <Link to="/login" className="bg-nature text-white px-6 py-2 rounded-full font-bold kids-shadow hover:scale-105 transition-transform">
              {lang === 'ar' ? 'دخول' : 'Login'}
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-stone-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b-4 border-sand-dark p-4 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 font-bold text-xl p-4 rounded-2xl hover:bg-sand"
              >
                <item.icon size={24} />
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const HomePage = () => {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-8 text-center md:text-right"
        >
          <h1 className="text-5xl md:text-7xl font-black text-stone-800 leading-tight">
            استكشف أسرار <span className="text-nature">جنين</span> العظيمة!
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-2xl">
            انضم إلينا في رحلة عبر الزمن لنكتشف معاً أجمل المواقع الأثرية في مدينة جنين. قصص، ألعاب، ومغامرات بانتظارك!
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/map" className="kids-button bg-nature text-white hover:bg-green-600">
              ابدأ الرحلة الآن
            </Link>
            <Link to="/shop" className="kids-button bg-sky text-white hover:bg-blue-400">
              تصفح المتجر
            </Link>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 relative"
        >
          <img 
            src="https://picsum.photos/seed/kids-explore/800/800" 
            alt="Kids exploring" 
            className="rounded-[3rem] border-8 border-white kids-shadow rotate-3"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-6 -left-6 bg-gold w-24 h-24 rounded-full flex items-center justify-center kids-shadow animate-bounce">
            <Star className="text-white" size={48} fill="currentColor" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-sky/20 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">لماذا منصة درب؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'تعلم ممتع', desc: 'قصص مشوقة مكتوبة خصيصاً للأطفال.', icon: Play, color: 'bg-nature' },
              { title: 'خريطة تفاعلية', desc: 'استكشف جنين من خلال خريطة كرتونية رائعة.', icon: MapIcon, color: 'bg-sky' },
              { title: 'جوائز وشارات', desc: 'اجمع النقاط واحصل على شارات المستكشف المتميز.', icon: Trophy, color: 'bg-gold' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="card-kids text-center space-y-4"
              >
                <div className={`${feature.color} w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white kids-shadow`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-stone-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const MapPage = ({ user }: { user: User | null }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  useEffect(() => {
    fetch('/api/sites').then(res => res.json()).then(setSites);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-sky/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black">خريطة الاستكشاف</h1>
          <div className="bg-white px-6 py-2 rounded-full font-bold kids-shadow border-2 border-sand-dark">
            تم استكشاف {user?.progress?.length || 0} من {sites.length} مواقع
          </div>
        </div>

        <div className="relative aspect-[16/9] bg-nature/20 rounded-[3rem] border-8 border-white kids-shadow overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
          
          {/* Ad Placeholder for Free Users */}
          {(!user || user.subscription !== 'premium') && (
            <div className="absolute bottom-4 right-4 z-20 bg-white/90 p-2 rounded-xl border-2 border-sand-dark text-[10px] font-bold text-stone-400 kids-shadow">
              إعلان: اشترِ حقيبة المستكشف الآن!
            </div>
          )}
          
          {/* Site Markers */}
          {sites.map((site) => (
            <motion.button
              key={site.id}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedSite(site)}
              className="absolute z-10 group"
              style={{ 
                top: `${(site.lat - 32.4) * 1000}%`, 
                left: `${(site.lng - 35.2) * 500}%` 
              }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center kids-shadow border-4 border-white ${site.is_premium ? 'bg-gold' : 'bg-nature'}`}>
                {site.is_premium ? <Lock size={20} className="text-white" /> : <MapIcon size={20} className="text-white" />}
              </div>
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap kids-shadow">
                {site.name_ar}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Site Details Modal */}
        <AnimatePresence>
          {selectedSite && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[3rem] max-w-2xl w-full overflow-hidden kids-shadow border-8 border-white"
              >
                <div className="relative h-64">
                  <img src={selectedSite.image_url} alt={selectedSite.name_ar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => setSelectedSite(null)}
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                  {selectedSite.is_premium && (
                    <div className="absolute top-4 left-4 bg-gold text-white px-4 py-1 rounded-full font-bold flex items-center gap-2 kids-shadow">
                      <Lock size={16} /> محتوى متميز
                    </div>
                  )}
                </div>
                <div className="p-8 space-y-6">
                  <h2 className="text-4xl font-black text-nature">{selectedSite.name_ar}</h2>
                  <p className="text-xl text-stone-600 leading-relaxed">{selectedSite.description_ar}</p>
                  
                  {selectedSite.is_premium && user?.subscription !== 'premium' ? (
                    <div className="bg-sand p-6 rounded-2xl text-center space-y-4">
                      <p className="font-bold text-lg">هذا الموقع متاح فقط للمشتركين المتميزين!</p>
                      <Link to="/subscribe" className="kids-button bg-gold text-white inline-block">
                        اشترك الآن لفتح القصة
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Play className="text-nature" /> قصة المكان
                      </h3>
                      <p className="text-lg leading-relaxed bg-sand/50 p-6 rounded-2xl italic">
                        "{selectedSite.story_ar}"
                      </p>
                      <button className="kids-button bg-nature text-white w-full">
                        لقد استكشفت هذا المكان! (+50 نقطة)
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center py-12 space-y-4">
          <h1 className="text-5xl font-black text-terracotta">متجر المستكشفين</h1>
          <p className="text-xl text-stone-600">اقتنِ أدواتك الخاصة وابدأ مغامرتك الحقيقية!</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="card-kids flex flex-col"
            >
              <img src={product.image_url} alt={product.name_ar} className="w-full aspect-square object-cover rounded-2xl mb-6" referrerPolicy="no-referrer" />
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold">{product.name_ar}</h3>
                <p className="text-stone-500">{product.description_ar}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-3xl font-black text-nature">{product.price} شيكل</span>
                <button className="bg-terracotta text-white p-4 rounded-2xl kids-shadow hover:scale-110 transition-transform">
                  <ShoppingBag size={24} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const navigate = navigateTo();

  function navigateTo() {
    const location = useLocation();
    return (path: string) => {
      window.location.href = path; // Simple for demo
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const user = await res.json();
    onLogin(user);
    window.location.href = '/dashboard';
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-kids max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-nature rounded-full mx-auto flex items-center justify-center text-white font-kids text-4xl kids-shadow">
            د
          </div>
          <h1 className="text-3xl font-black">مرحباً بك يا بطل!</h1>
          <p className="text-stone-600">أدخل اسمك لتبدأ رحلة الاستكشاف</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            placeholder="اسم المستكشف"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-4 border-sand bg-sand/20 text-xl font-bold focus:border-nature outline-none transition-colors"
            required
          />
          <button type="submit" className="kids-button bg-nature text-white w-full">
            دخول
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const DashboardPage = ({ user }: { user: User | null }) => {
  if (!user) return <div className="pt-32 text-center">يرجى تسجيل الدخول أولاً</div>;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="card-kids text-center space-y-6">
            <div className="relative inline-block">
              <img src={user.avatar} alt="avatar" className="w-32 h-32 rounded-full border-8 border-sand mx-auto" />
              <div className="absolute -bottom-2 -right-2 bg-gold p-2 rounded-full kids-shadow">
                <Trophy size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-black">{user.username}</h2>
            <div className="bg-sand p-4 rounded-2xl">
              <p className="text-stone-600 font-bold">رصيد النقاط</p>
              <p className="text-4xl font-black text-nature">{user.points}</p>
            </div>
            <div className={`p-4 rounded-2xl font-bold ${user.subscription === 'premium' ? 'bg-gold text-white' : 'bg-stone-200 text-stone-600'}`}>
              عضوية {user.subscription === 'premium' ? 'متميزة' : 'عادية'}
            </div>
          </div>

          {/* Progress & Badges */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-kids">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Star className="text-gold" fill="currentColor" /> إنجازاتي
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-sand rounded-2xl flex flex-col items-center justify-center p-4 text-center gap-2 opacity-50 grayscale">
                    <Trophy size={40} className="text-stone-400" />
                    <span className="text-xs font-bold text-stone-500">وسام قريباً</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-kids">
              <h3 className="text-2xl font-black mb-6">المواقع التي زرتها</h3>
              {user.progress && user.progress.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.progress.map(site => (
                    <div key={site.id} className="flex items-center gap-4 bg-sand/30 p-4 rounded-2xl">
                      <img src={site.image_url} alt={site.name_ar} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold">{site.name_ar}</p>
                        <p className="text-xs text-stone-500">تم الاستكشاف بنجاح</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <p className="text-stone-500">لم تستكشف أي موقع بعد!</p>
                  <Link to="/map" className="kids-button bg-sky text-white inline-block">
                    ابدأ الاستكشاف الآن
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscribePage = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <header className="py-12 space-y-4">
          <h1 className="text-5xl font-black text-gold">العضوية المتميزة</h1>
          <p className="text-xl text-stone-600">افتح جميع الأسرار والمغامرات في جنين!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card-kids border-stone-200 opacity-80">
            <h3 className="text-2xl font-bold mb-4">المستكشف العادي</h3>
            <p className="text-4xl font-black mb-6">مجاناً</p>
            <ul className="text-right space-y-4 mb-8">
              <li className="flex items-center gap-2"><Star size={16} className="text-nature" /> بعض المواقع الأثرية</li>
              <li className="flex items-center gap-2"><Star size={16} className="text-nature" /> قصص أساسية</li>
              <li className="flex items-center gap-2"><Star size={16} className="text-nature" /> إعلانات بسيطة</li>
            </ul>
            <button className="kids-button bg-stone-400 text-white w-full cursor-default">أنت هنا</button>
          </div>

          <div className="card-kids border-gold relative overflow-hidden">
            <div className="absolute top-4 -left-12 bg-gold text-white px-12 py-1 rotate-[-45deg] font-bold text-sm kids-shadow">
              الأكثر طلباً
            </div>
            <h3 className="text-2xl font-bold mb-4">المستكشف الذهبي</h3>
            <p className="text-4xl font-black mb-6">20 شيكل <span className="text-lg text-stone-500">/ شهر</span></p>
            <ul className="text-right space-y-4 mb-8">
              <li className="flex items-center gap-2"><Star size={16} className="text-gold" fill="currentColor" /> فتح جميع المواقع</li>
              <li className="flex items-center gap-2"><Star size={16} className="text-gold" fill="currentColor" /> قصص تفاعلية متقدمة</li>
              <li className="flex items-center gap-2"><Star size={16} className="text-gold" fill="currentColor" /> أوراق عمل للطباعة</li>
              <li className="flex items-center gap-2"><Star size={16} className="text-gold" fill="currentColor" /> بدون إعلانات</li>
            </ul>
            <button className="kids-button bg-gold text-white w-full">اشترك الآن</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    // Mock session check
    const savedUser = localStorage.getItem('darb_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      fetch(`/api/user/${parsed.id}`).then(res => res.json()).then(setUser);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('darb_user', JSON.stringify(u));
  };

  return (
    <Router>
      <div className={`min-h-screen font-sans ${lang === 'en' ? 'font-kids' : ''}`}>
        <Navbar user={user} lang={lang} setLang={setLang} />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage user={user} />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        </main>

        <footer className="bg-stone-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
            <div className="space-y-4">
              <h4 className="text-2xl font-kids font-bold text-nature">درب</h4>
              <p className="text-stone-400">نحن نؤمن أن التاريخ هو أعظم مغامرة يمكن للطفل أن يخوضها.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">روابط سريعة</h4>
              <ul className="space-y-2 text-stone-400">
                <li><Link to="/map">خريطة جنين</Link></li>
                <li><Link to="/shop">المتجر التعليمي</Link></li>
                <li><Link to="/subscribe">الاشتراكات</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">تواصل معنا</h4>
              <p className="text-stone-400">جنين، فلسطين</p>
              <p className="text-stone-400">info@darb.ps</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-700 text-center text-stone-500">
            &copy; 2026 منصة درب - جميع الحقوق محفوظة
          </div>
        </footer>
      </div>
    </Router>
  );
}
