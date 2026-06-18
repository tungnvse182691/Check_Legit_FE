import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function LegitProfileDetail() {
  const { id } = useParams();
  const { legitList } = useApp();

  // Find merchant, fallback to first if not found
  const merchant = legitList.find((l) => l.id === Number(id)) || legitList[0];

  if (!merchant) {
    return (
      <div className="max-w-max-width mx-auto px-6 md:px-margin-desktop py-12 text-center">
        <span className="material-symbols-outlined text-6xl text-emerald-600 mb-4">gpp_good</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Không tìm thấy tiểu thương</h2>
        <p className="text-body-lg text-on-surface-variant mt-4">Thông tin hồ sơ uy tín này không tồn tại hoặc đã bị ẩn.</p>
        <Link to="/" className="mt-8 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-sm transition-all">
          Trở Về Trang Chủ
        </Link>
      </div>
    );
  }

  // Tier System (based on insurance level)
  function getTierBadgeInfo(insurance: number) {
    if (insurance >= 500000000) {
      return {
        label: "Hạng Kim Cương",
        className: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 font-black px-5 py-2.5 rounded-2xl shadow-md text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2",
        icon: "diamond"
      };
    } else if (insurance >= 100000000) {
      return {
        label: "Hạng Bạch Kim",
        className: "bg-gradient-to-r from-slate-500 to-stone-700 text-white border border-slate-400/30 font-black px-5 py-2.5 rounded-2xl shadow-md text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2",
        icon: "military_tech"
      };
    } else {
      return {
        label: "Hạng Vàng",
        className: "bg-gradient-to-r from-amber-500 to-yellow-600 text-white border border-amber-400/30 font-black px-5 py-2.5 rounded-2xl shadow-md text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2",
        icon: "stars"
      };
    }
  }

  const tier = getTierBadgeInfo(merchant.insurance);

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-margin-desktop py-12 min-h-screen">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-on-surface-variant font-bold text-xs uppercase tracking-wider">
        <Link to="/" className="hover:text-emerald-700 transition-colors">TRANG CHỦ</Link>
        <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
        <span className="text-emerald-700">{merchant.name}</span>
      </nav>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Main Merchant Information */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white border border-outline-variant p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden animate-fade-in">
            {/* Ambient Background Badge Grid */}
            <div className="absolute top-0 right-0 w-40 h-40 opacity-5 pointer-events-none transform translate-x-8 -translate-y-8">
              <span className="material-symbols-outlined text-[160px] text-emerald-800">verified</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center pb-8 border-b border-dashed border-outline-variant">
              {/* Profile Image & Verification Badge */}
              <div className="relative shrink-0">
                <img
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-emerald-50 shadow-md"
                  src={merchant.img}
                  alt={merchant.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-700 text-white p-2 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <span className="material-symbols-outlined text-[18px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
              </div>

              {/* Basic Meta Details */}
              <div className="flex-1 space-y-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight leading-tight">
                    {merchant.name}
                  </h1>
                </div>

                {/* Role / Business Type Display */}
                <div className="flex items-center gap-1.5 text-emerald-805 text-emerald-800 font-extrabold text-sm uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full inline-flex border border-emerald-100/60">
                  <span className="material-symbols-outlined text-base">category</span>
                  Ngành: {merchant.role}
                </div>

                {/* Tier Badge */}
                <div className="pt-1 flex">
                  <span className={tier.className}>
                    <span className="material-symbols-outlined text-base align-middle">{tier.icon}</span>
                    {tier.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="pt-8">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">info</span>
                Mô tả tiểu thương
              </h3>
              <p className="text-on-surface-variant text-base leading-relaxed bg-slate-5( bg-slate-50 border border-slate-100 p-6 rounded-2xl whitespace-pre-line font-medium text-slate-700">
                {merchant.desc}
              </p>
            </div>
          </section>
        </div>

        {/* Right Card: Verified Contact Channels (No score or insurance value shown!) */}
        <aside className="lg:col-span-4">
          <section className="bg-gradient-to-b from-stone-900 to-emerald-950 text-white p-6 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
            <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none transform translate-x-12 -translate-y-12">
              <span className="material-symbols-outlined text-[200px] text-emerald-200">lock_open</span>
            </div>

            <div className="space-y-6">
              <div>
                <span className="bg-emerald-700/60 text-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-3">
                  Check Zone Verified
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
                  Kênh Liên Hệ Đã Xác Minh
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Để đảm bảo giao dịch an toàn và tránh các tài khoản lừa đảo giả mạo danh nghĩa của tiểu thương, xin vui lòng chỉ trao đổi trực tiếp qua các thông tin định danh dưới đây.
                </p>
              </div>

              {/* Verified Contacts Checklist */}
              <div className="space-y-4 pt-2">
                
                {/* Telegram */}
                {merchant.telegram && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-white text-base font-bold">send</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telegram chính chủ</div>
                        <div className="font-bold text-white text-sm tracking-wide">{merchant.telegram}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {merchant.phone && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-white text-base font-bold">call</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotline / Zalo</div>
                        <div className="font-bold text-white text-sm tracking-wide">{merchant.phone}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Secure Action Button */}
            <div className="pt-8">
              <a
                href={merchant.telegram ? `https://t.me/${merchant.telegram.replace("@", "")}` : `tel:${merchant.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-650 bg-emerald-600 hover:bg-emerald-700 text-white text-center block font-black text-xs sm:text-sm py-4 rounded-2xl shadow-md min-h-[44px] transition-all duration-300 active:scale-[0.98] select-none hover:scale-[1.01]"
              >
                Liên Hệ Giao Dịch Ngay
              </a>
              <div className="text-[10px] text-center text-slate-400 mt-3 font-semibold flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs text-emerald-500 fill-1">verified_user</span>
                Bảo hộ bằng quỹ ký quỹ Check Zone
              </div>
            </div>
          </section>
        </aside>

      </div>
    </div>
  );
}
