import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function LegitList() {
  const { legitList } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLegit = legitList.filter((item) => {
    const query = searchTerm.toLowerCase().trim();
    return (
      query === "" ||
      item.name.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      (item.telegram && item.telegram.toLowerCase().includes(query)) ||
      (item.phone && item.phone.toLowerCase().includes(query))
    );
  });


  function getTierBadge(insurance: number) {
    if (insurance >= 500000000) {
      return {
        label: "Kim Cương",
        className: "bg-cyan-50 text-cyan-800 border bg-cyan-100/30 border-cyan-200/80 pr-3.5 pl-3 py-1 rounded-full flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-wider shadow-sm",
        icon: "diamond"
      };
    } else if (insurance >= 100000000) {
      return {
        label: "Bạch Kim",
        className: "bg-slate-50 text-slate-700 border bg-slate-100 border-slate-300 pr-3.5 pl-3 py-1 rounded-full flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-wider shadow-sm",
        icon: "military_tech"
      };
    } else {
      return {
        label: "Vàng",
        className: "bg-amber-50 text-amber-800 border bg-amber-100/40 border-amber-300 pr-3.5 pl-3 py-1 rounded-full flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-wider shadow-sm",
        icon: "stars"
      };
    }
  }

  return (
    <div className="max-w-max-width mx-auto px-6 md:px-margin-desktop py-12 min-h-screen">
      {/* Search & Filter Section */}
      <section className="mb-12">
        <div className="flex flex-col gap-8">
          <div className="max-w-3xl">

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-on-surface leading-tight">
              Danh sách uy tín
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Những người kinh doanh, seller, admin, cửa hàng và đơn vị được xét duyệt kỹ lưỡng và xác minh giao dịch thành công. Toàn bộ thông tin được ghi nhận minh bạch và bảo mật cao.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative w-full md:w-2/3 lg:w-1/2">
              <div className="flex items-center bg-white border-2 border-outline rounded-2xl p-2.5 focus-within:border-primary shadow-sm focus-within:ring-4 focus-within:ring-emerald-50 transition-all duration-300">
                <span className="material-symbols-outlined px-3 text-emerald-750">search</span>
                <input 
                  className="w-full border-none focus:outline-none bg-transparent text-sm sm:text-base py-2.5 outline-none text-on-surface" 
                  placeholder="Tìm theo tên cửa hàng, sản phẩm hoặc định danh..." 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="px-2 text-on-surface-variant hover:text-primary text-xs sm:text-sm font-bold cursor-pointer focus:outline-none"
                  >
                    Xoá
                  </button>
                )}
              </div>
            </div>
            
            <Link
              to="/legit/register"
              className="bg-primary hover:bg-emerald-800 text-white font-black px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">verified</span>
              <span>ĐĂNG KÝ LÀM HỒ SƠ UY TÍN</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <div className="bg-white border border-outline-variant p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] sm:text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-bold">Đã xác minh</p>
          <p className="font-label-numeric text-lg sm:text-xl md:text-2xl font-extrabold text-primary">{legitList.length} Hồ sơ</p>
        </div>
        <div className="bg-white border border-outline-variant p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] sm:text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-bold">Tier cao nhất</p>
          <p className="font-label-numeric text-base sm:text-lg md:text-xl font-extrabold text-cyan-800 uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm align-middle">diamond</span> Kim Cương
          </p>
        </div>
        <div className="bg-white border border-outline-variant p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] sm:text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-bold">Bảo chứng</p>
          <p className="font-label-numeric text-xs sm:text-sm md:text-base font-extrabold text-emerald-800">Bảo Hiểm Ký Quỹ</p>
        </div>
        <div className="bg-white border border-outline-variant p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] sm:text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-bold">Hệ số tin cậy</p>
          <p className="font-label-numeric text-lg sm:text-xl md:text-2xl font-extrabold text-primary">Tối đa</p>
        </div>
      </div>

      {filteredLegit.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
          <p className="font-bold text-headline-md text-on-surface">Không tìm thấy thương hiệu</p>
          <p className="text-on-surface-variant mt-2 text-sm">Vui lòng thử tìm kiếm bằng từ khoá khác hoặc lọc tất cả danh sách.</p>
        </div>
      ) : (
        /* Legit Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLegit.map((item) => {
            const tier = getTierBadge(item.insurance);
            return (
              <div key={item.id} className="bg-white border border-outline-variant rounded-2xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex flex-col justify-between shadow-sm animate-fade-in">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100 p-0.5 shadow-sm" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="bg-emerald-50 text-primary p-2.5 rounded-full flex items-center justify-center border border-emerald-100">
                      <span className="material-symbols-outlined shrink-0 text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                  <div>
                    {/* Tier badge above title */}
                    <div className="mb-3.5 flex">
                      <span className={tier.className}>
                        <span className="material-symbols-outlined text-sm align-middle">{tier.icon}</span>
                        {tier.label}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-on-surface mb-3 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-4 border-t border-outline-variant flex items-center justify-end bg-emerald-50/20">
                  <Link 
                    to={`/legit/${item.slug || item.id}`} 
                    className="text-xs sm:text-sm font-bold border border-outline px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    Xem hồ sơ
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
