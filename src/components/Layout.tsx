import { Link, useLocation } from "react-router-dom";
import { useState, ReactNode } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);
  const location = useLocation();

  const navItemClass = (path: string) => {
    const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
    return isActive 
      ? "text-primary border-b-2 border-primary font-extrabold pb-2 text-sm sm:text-base tracking-wider transition-all duration-300"
      : "text-on-surface-variant hover:text-primary transition-colors text-sm sm:text-base font-bold pb-2 tracking-wider";
  };

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50 shadow-sm">
      <div className="w-full px-6 md:px-12 lg:px-20 xl:px-32 mx-auto flex justify-between items-center h-20 relative">
        <Link to="/" className="text-headline-md font-extrabold text-primary tracking-tight hover:scale-105 transition-transform duration-300">
          CHECK ZONE
        </Link>
        
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center gap-8">
            <li className="flex items-center">
              <Link to="/" className={navItemClass("/")}>TRANG CHỦ</Link>
            </li>
            <li className="flex items-center">
              <Link to="/reports" className={navItemClass("/reports")}>DANH SÁCH TỐ CÁO</Link>
            </li>
            <li className="flex items-center">
              <Link to="/warnings" className={navItemClass("/warnings")}>CẢNH BÁO GIAO DỊCH</Link>
            </li>
            <li className="flex items-center">
              <Link to="/legit" className={navItemClass("/legit")}>HỒ SƠ UY TÍN</Link>
            </li>
            <li className="flex items-center">
              {/* Information Dropdown for THÔNG TIN */}
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button 
                  type="button"
                  className="flex items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm sm:text-base font-bold pb-2 tracking-wider cursor-pointer focus:outline-none uppercase"
                >
                  <span>THÔNG TIN</span>
                  <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-outline-variant rounded-xl shadow-lg py-2 w-48 z-50 animate-fade-in">
                    <Link 
                      to="/about" 
                      className="block px-4 py-2 text-sm text-on-surface hover:bg-emerald-50 hover:text-primary transition-colors font-bold uppercase"
                    >
                      GIỚI THIỆU
                    </Link>
                    <Link 
                      to="/about" 
                      className="block px-4 py-2 text-sm text-on-surface hover:bg-emerald-50 hover:text-primary transition-colors font-bold uppercase"
                    >
                      LIÊN HỆ
                    </Link>
                    <Link 
                      to="/about" 
                      className="block px-4 py-2 text-sm text-on-surface hover:bg-emerald-50 hover:text-primary transition-colors font-bold uppercase"
                    >
                      CHÍNH SÁCH
                    </Link>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            to="/report" 
            className="hidden lg:flex bg-primary text-on-primary px-6 py-2.5 rounded-xl text-label-sm font-bold hover:scale-[1.05] hover:shadow-md active:scale-95 transition-all duration-300"
          >
            TỐ CÁO NGAY
          </Link>
          <button 
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block lg:!hidden material-symbols-outlined text-on-surface-variant p-2 hover:bg-slate-100 rounded-lg active:scale-95 transition-all cursor-pointer focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? "close" : "menu"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-outline-variant absolute top-20 left-0 w-full shadow-lg z-50 transition-all origin-top animate-fade-in">
          <nav className="flex flex-col p-6 space-y-3">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={`text-body-md py-2 font-bold border-b border-slate-100 uppercase tracking-wider ${location.pathname === "/" ? "text-primary font-extrabold" : "text-on-surface-variant"}`}
            >
              TRANG CHỦ
            </Link>
            <Link 
              to="/reports" 
              onClick={() => setIsMenuOpen(false)}
              className={`text-body-md py-2 font-bold border-b border-slate-100 uppercase tracking-wider ${location.pathname.startsWith("/reports") ? "text-primary font-extrabold" : "text-on-surface-variant"}`}
            >
              DANH SÁCH TỐ CÁO
            </Link>
            <Link 
              to="/warnings" 
              onClick={() => setIsMenuOpen(false)}
              className={`text-body-md py-2 font-bold border-b border-slate-100 uppercase tracking-wider ${location.pathname.startsWith("/warnings") ? "text-primary font-extrabold" : "text-on-surface-variant"}`}
            >
              CẢNH BÁO GIAO DỊCH
            </Link>
            <Link 
              to="/legit" 
              onClick={() => setIsMenuOpen(false)}
              className={`text-body-md py-2 font-bold border-b border-slate-100 uppercase tracking-wider ${location.pathname.startsWith("/legit") ? "text-primary font-extrabold" : "text-on-surface-variant"}`}
            >
              HỒ SƠ UY TÍN
            </Link>
            
            {/* Mobile collapsible Information group */}
            <div>
              <button
                type="button"
                onClick={() => setIsMobileInfoOpen(!isMobileInfoOpen)}
                className="w-full text-left text-body-md py-2 font-medium border-b border-slate-100 text-on-surface-variant flex justify-between items-center"
              >
                <span>THÔNG TIN</span>
                <span className="material-symbols-outlined text-base">
                  {isMobileInfoOpen ? "expand_less" : "expand_more"}
                </span>
              </button>
              {isMobileInfoOpen && (
                <div className="pl-4 mt-2 mb-2 flex flex-col space-y-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Link 
                    to="/about" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm py-1.5 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    • Giới thiệu
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm py-1.5 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    • Liên hệ
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm py-1.5 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    • Chính sách
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/report" 
              onClick={() => setIsMenuOpen(false)}
              className="bg-primary text-on-primary text-center py-3.5 rounded-xl text-label-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all block mt-4"
            >
              TỐ CÁO NGAY
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant pt-16 pb-8">
      <div className="max-w-max-width mx-auto px-6 md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
        <div className="md:col-span-1">
          <div className="text-headline-md text-primary font-extrabold mb-4 tracking-tight">CHECK ZONE</div>
          <p className="text-body-md text-on-surface-variant">© 2024 CHECK ZONE. Uncompromising Vigilance.</p>
        </div>
        <div>
          <div className="font-bold mb-4 uppercase text-xs tracking-widest text-on-surface">THÔNG TIN</div>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-on-surface-variant hover:underline text-label-sm">Giới thiệu</Link></li>
            <li><Link to="/about" className="text-on-surface-variant hover:underline text-label-sm">Liên hệ</Link></li>
            <li><Link to="/about" className="text-on-surface-variant hover:underline text-label-sm">Chính sách bảo mật</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-4 uppercase text-xs tracking-widest text-on-surface">Pháp lý</div>
          <ul className="space-y-2">
            <li><Link to="#" className="text-on-surface-variant hover:underline text-label-sm">Điều khoản sử dụng</Link></li>
            <li><Link to="#" className="text-on-surface-variant hover:underline text-label-sm">Cơ chế khiếu nại</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-4 uppercase text-xs tracking-widest text-on-surface">Kết nối</div>
          <div className="flex gap-4">
            <a href="#" className="bg-on-surface-variant/10 p-2 rounded-full hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-primary">public</span>
            </a>
            <a href="#" className="bg-on-surface-variant/10 p-2 rounded-full hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-primary">share</span>
            </a>
          </div>
        </div>
      </div>
      <div className="text-center border-t border-outline-variant pt-8 text-on-surface-variant text-label-sm px-4">
        Nền tảng được bảo vệ bởi hệ thống an ninh đa lớp. Mọi hành vi tấn công dữ liệu sẽ bị truy cứu trách nhiệm pháp lý.
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
