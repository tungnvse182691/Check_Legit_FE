import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function Warnings() {
  const { scams } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter scams to get only approved ones from the correct category
  const behaviorWarnings = scams.filter(
    (s) => s.status === "Đã phê duyệt" && s.category === "Cảnh báo hành vi"
  );

  const filteredWarnings = behaviorWarnings.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(term) ||
      (item.phone && item.phone.toLowerCase().includes(term)) ||
      (item.accountNumber && item.accountNumber.toLowerCase().includes(term)) ||
      (item.bankName && item.bankName.toLowerCase().includes(term)) ||
      (item.desc && item.desc.toLowerCase().includes(term)) ||
      (item.type && item.type.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-max-width mx-auto px-6 md:px-margin-desktop py-12 min-h-screen">
      {/* Header Info */}
      <section className="mb-12 animate-fade-in">
        <div className="max-w-3xl">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-amber-600 tracking-tight leading-tight">
            Cảnh báo hành vi thương mại
          </h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            Nơi tập hợp, tra cứu các hành vi bùng hàng (boom hàng), bán hàng giả nhái, hoặc thái độ lồi lõm thiếu hợp tác trong kinh doanh thương mại điện tử và đời sống. Hãy chung tay xây dựng cộng đồng mua bán văn minh, minh bạch hơn.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 relative w-full md:w-2/3 lg:w-1/2">
          <div className="flex items-center bg-white border-2 border-outline-variant rounded-2xl p-2.5 focus-within:border-amber-500 shadow-sm focus-within:ring-4 focus-within:ring-amber-100 transition-all duration-300">
            <span className="material-symbols-outlined px-3 text-amber-600">search</span>
            <input
              type="text"
              className="w-full border-none focus:outline-none bg-transparent text-sm sm:text-base py-2.5 text-on-surface outline-none"
              placeholder="Nhập tên đối tượng bùng hàng, SĐT, số tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-on-surface-variant hover:text-amber-600 mr-2 cursor-pointer focus:outline-none"
              >
                <span className="material-symbols-outlined align-middle">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid of Warning Reports in 3 columns for large screens */}
      {filteredWarnings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWarnings.map((warning) => (
            <div
              key={warning.id}
              className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col justify-between border-l-4 border-l-amber-500 animate-fade-in"
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-2">
                      {warning.type}
                    </span>
                    <h3 className="font-extrabold text-lg text-on-surface line-clamp-1">
                      {warning.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-slate-100 px-2 py-0.5 rounded-full uppercase shrink-0">
                    {warning.time || "Vừa xong"}
                  </span>
                </div>

                <div className="space-y-3 py-3 text-sm border-t border-b border-dashed border-outline-variant my-4">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant text-xs font-semibold">SĐT / Zalo:</span>
                    <span className="font-bold font-mono text-on-surface bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {warning.phone || "Không có"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant text-xs font-semibold">Tài khoản / Kênh nhận diện:</span>
                    <span className="font-bold font-mono text-xs sm:text-sm text-amber-800 bg-amber-50/50 px-2.5 py-1.5 rounded border border-amber-100/60 break-all text-center">
                      {warning.accountNumber} <br />
                      <span className="text-[11px] font-bold text-on-surface font-sans bg-white px-1.5 py-0.5 rounded mt-1 inline-block border border-outline-variant">
                        {warning.bankName}
                      </span>
                    </span>
                  </div>
                </div>

                <p className="text-on-surface-variant text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {warning.desc}
                </p>
              </div>

              <div className="p-6 pt-4 border-t border-outline-variant bg-amber-50/10 flex justify-between items-center mt-auto">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">Thiệt hại</span>
                  <span className="font-mono text-amber-600 font-extrabold text-xs sm:text-sm">
                    Phi tài sản (0đ)
                  </span>
                </div>
                <Link
                  to={`/reports/${warning.id}`}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-4 py-2.5 rounded-xl text-xs font-bold hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
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
          <span className="material-symbols-outlined text-5xl text-amber-500 mb-4 font-bold">gpp_good</span>
          <p className="font-bold text-headline-md text-on-surface mb-2">Chưa ghi nhận cảnh báo xấu nào</p>
          <p className="text-sm max-w-md mx-auto leading-relaxed">
            Hệ thống không phát hiện báo cáo cảnh báo bùng hàng, lồi lõm hoặc bán hàng giả nào trùng khớp với từ khóa tìm kiếm của bạn. Hãy liên tục trao đổi văn minh lịch sự nhé!
          </p>
        </div>
      )}
    </div>
  );
}
