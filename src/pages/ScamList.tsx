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
          <span className="bg-red-50 text-red-800 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-4 border border-red-200">
            Cơ sở dữ liệu phòng chống gian lận
          </span>
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
              className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col justify-between border-l-4 border-l-red-600 animate-fade-in"
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-2">
                      {scam.type}
                    </span>
                    <h3 className="font-extrabold text-lg text-on-surface line-clamp-1">
                      {scam.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-slate-100 px-2 py-0.5 rounded-full uppercase shrink-0">
                    {scam.time}
                  </span>
                </div>

                <div className="space-y-3 py-3 text-sm border-t border-b border-dashed border-outline-variant my-4">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant text-xs font-semibold">SĐT / Zalo:</span>
                    <span className="font-bold font-mono text-on-surface bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {scam.phone || "Không có"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant text-xs font-semibold">Tài khoản ngân hàng:</span>
                    <span className="font-bold font-mono text-xs sm:text-sm text-red-600 bg-red-50/50 px-2.5 py-1.5 rounded border border-red-100/60 break-all text-center">
                      {scam.accountNumber} <br />
                      <span className="text-[11px] font-bold text-on-surface font-sans bg-white px-1.5 py-0.5 rounded mt-1 inline-block border border-outline-variant">
                        {scam.bankName}
                      </span>
                    </span>
                  </div>
                </div>

                <p className="text-on-surface-variant text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {scam.desc}
                </p>
              </div>

              <div className="p-6 pt-4 border-t border-outline-variant bg-slate-50/50 flex justify-between items-center mt-auto">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">Thiệt hại</span>
                  <span className="font-mono text-red-600 font-extrabold text-base">
                    {scam.amount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <Link
                  to={`/reports/${scam.id}`}
                  className="bg-red-550 hover:bg-red-600 hover:text-white border border-red-100 text-red-800 bg-red-50 px-4 py-2.5 rounded-xl text-xs font-bold hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
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
