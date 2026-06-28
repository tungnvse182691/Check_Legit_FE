import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function ScamList() {
  const { scams } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const approvedScams = scams.filter(s => s.status === "Đã phê duyệt" && s.category === "Lừa đảo tài chính");

  const filteredScams = approvedScams.filter((scam) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      scam.name.toLowerCase().includes(term) ||
      (scam.phone && scam.phone.toLowerCase().includes(term)) ||
      (scam.accountNumber && scam.accountNumber.toLowerCase().includes(term)) ||
      (scam.bankName && scam.bankName.toLowerCase().includes(term)) ||
      (scam.desc && scam.desc.toLowerCase().includes(term)) ||
      (scam.type && scam.type.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-max-width mx-auto px-6 md:px-margin-desktop py-12 min-h-screen">
      {/* Header Info */}
      <section className="mb-12">
        <div className="max-w-3xl">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-red-600 tracking-tight leading-tight">
            Danh sách đen tố cáo
          </h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            Danh sách các đối tượng, số điện thoại, và tài khoản ngân hàng đã được cộng đồng kiểm duyệt, xác thực hành vi lừa đảo trực tuyến. Hãy tra cứu kỹ thông tin trước khi thực hiện giao dịch chuyển tiền.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 relative w-full md:w-2/3 lg:w-1/2">
          <div className="flex items-center bg-white border-2 border-outline-variant rounded-2xl p-2.5 focus-within:border-red-500 shadow-sm focus-within:ring-4 focus-within:ring-red-100 transition-all duration-300">
            <span className="material-symbols-outlined px-3 text-red-600">search</span>
            <input
              type="text"
              className="w-full border-none focus:outline-none bg-transparent text-sm sm:text-base py-2.5 text-on-surface outline-none"
              placeholder="Nhập số điện thoại, tài khoản, tên đối tượng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-on-surface-variant hover:text-red-600 mr-2 cursor-pointer focus:outline-none"
              >
                <span className="material-symbols-outlined align-middle">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid of Scam Reports in 3 columns for large screens */}
      {filteredScams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScams.map((scam) => (
            <div
              key={scam.id}
              className="bg-white border border-[#e5e7eb] rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:border-red-500 hover:shadow-[0_10px_25px_-5px_rgba(239,68,68,0.1)] hover:-translate-y-0.5 animate-fade-in"
            >
              <div className="flex justify-between items-start gap-2.5">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold capitalize leading-normal">
                  {scam.type}
                </span>
                <span className="text-[#9ca3af] text-[11px] shrink-0 text-right mt-1 whitespace-nowrap">
                  {scam.time} - {scam.date}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug m-0 line-clamp-1">
                {scam.name}
              </h3>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 px-4 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[#6b7280] text-xs mb-1 block">SĐT / Zalo:</span>
                  <span className="text-slate-800 text-sm font-semibold truncate block">
                    {scam.phone || "Không có"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#6b7280] text-xs mb-1 block">Tài khoản ngân hàng:</span>
                  <span className="text-slate-800 text-sm font-semibold truncate block">
                    {scam.accountNumber}
                  </span>
                  <span className="text-slate-600 text-xs mt-0.5 block">
                    {scam.bankName}
                  </span>
                </div>
              </div>

              <p className="text-slate-650 text-sm leading-relaxed m-0 line-clamp-2 grow">
                {scam.desc}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-dashed border-[#e5e7eb]">
                <div>
                  <span className="text-[#6b7280] text-xs uppercase">Thiệt hại</span>
                  <span className="text-red-500 text-lg font-bold ml-2">
                    {scam.amount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <Link
                  to={`/reports/${scam.id}`}
                  className="flex items-center gap-1.5 bg-transparent border border-red-500 text-red-500 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-550/5 hover:bg-red-50 transition-colors duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-outline-variant rounded-2xl p-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-emerald-600 mb-4 font-bold">gpp_good</span>
          <p className="font-bold text-headline-md text-on-surface mb-2 animate-pulse">Không tìm thấy báo cáo trùng khớp</p>
          <p className="text-sm max-w-md mx-auto leading-relaxed">
            Hệ thống chưa ghi nhận bất kỳ báo cáo lừa đảo nào trùng khớp với từ khóa tìm kiếm của bạn. Hãy liên tục cảnh giác khi thực hiện giao dịch mới.
          </p>
        </div>
      )}
    </div>
  );
}
