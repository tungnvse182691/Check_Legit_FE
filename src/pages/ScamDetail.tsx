import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export function ScamDetail() {
  const { id } = useParams();
  const { scams } = useApp();
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  // Find matching scam report, default to first approved scam if ID cannot be found
  const matchedScam = scams.find((s) => s.id === id) || scams.find((s) => s.status === "Đã phê duyệt") || scams[0];

  if (!matchedScam) {
    return (
      <div className="max-w-max-width mx-auto px-6 md:px-margin-desktop py-12 text-center">
        <span className="material-symbols-outlined text-6xl text-emerald-600 mb-4">gpp_good</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Không tìm thấy báo cáo</h2>
        <p className="text-body-lg text-on-surface-variant mt-4">Hồ sơ tố cáo này không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link to="/" className="mt-8 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all">
          Về Trang Chủ
        </Link>
      </div>
    );
  }

  const isWarning = matchedScam.category === "Cảnh báo hành vi";

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-margin-desktop py-8 min-h-screen">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex mb-6 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-emerald-700 transition-colors">Trang chủ</Link>
          </li>
          <li><span className="mx-2 text-slate-300">/</span></li>
          <li>
            <Link 
              to={isWarning ? "/warnings" : "/reports"} 
              className="hover:text-emerald-700 transition-colors"
            >
              {isWarning ? "Cảnh báo giao dịch" : "Danh sách đen"}
            </Link>
          </li>
          <li><span className="mx-2 text-slate-300">/</span></li>
          <li className={`${isWarning ? "text-amber-600" : "text-red-600"} font-extrabold`}>
            {isWarning ? `Chi tiết cảnh báo ${matchedScam.id}` : `Chi tiết tố cáo ${matchedScam.id}`}
          </li>
        </ol>
      </nav>

      {/* Prominent WARNING Banner - "Cảnh báo: Đối tượng lừa đảo" or "Cảnh báo: Hành vi giao dịch xấu" */}
      <div className={`mb-8 bg-gradient-to-r ${isWarning ? "from-amber-650 from-amber-600 to-orange-600" : "from-red-600 to-amber-600"} p-0.5 rounded-2xl shadow-md overflow-hidden animate-fade-in`}>
        <div className={`${isWarning ? "bg-amber-50/95 md:bg-amber-50/90" : "bg-red-50/95 md:bg-red-50/90"} backdrop-blur px-6 py-6 sm:py-7 flex flex-col md:flex-row items-center gap-5`}>
          <div className={`${isWarning ? "bg-amber-650 bg-amber-600" : "bg-red-600"} text-white p-3.5 rounded-full flex items-center justify-center shadow-lg animate-pulse`}>
            <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isWarning ? "warning" : "gpp_maybe"}
            </span>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className={`text-2xl sm:text-3xl font-black ${isWarning ? "text-amber-700" : "text-red-600"} uppercase tracking-tight`}>
              {isWarning ? "Cảnh báo: Hành vi giao dịch xấu" : "Cảnh báo: Đối tượng lừa đảo"}
            </h1>
            <p className={`text-sm sm:text-base ${isWarning ? "text-amber-950" : "text-red-955 text-red-950"} font-medium mt-1 leading-relaxed`}>
              {isWarning 
                ? "Hồ sơ này ghi nhận đối tượng có hành vi không lành mạnh khi giao dịch (bùng hàng, thái độ không chuẩn mực, bán hàng lỗi). Vui lòng cẩn trọng."
                : "Hồ sơ này đã được kiểm duyệt và ghi nhận trong hệ thống phòng chống gian lận. Vui lòng dừng mọi giao dịch chuyển khoản đến cá nhân này."}
            </p>
          </div>
          <div className={`shrink-0 font-mono text-[11px] font-extrabold uppercase ${isWarning ? "bg-amber-600 border-amber-500" : "bg-red-600 border-red-500"} text-white px-3 py-1.5 rounded-full tracking-widest border shadow-sm`}>
            Trạng thái: {matchedScam.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Box 1: Thông tin đối tượng */}
          <section className="bg-white border border-outline-variant p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className={`text-xl font-extrabold ${isWarning ? "text-amber-600" : "text-red-600"} mb-6 flex items-center gap-2.5`}>
              <span className={`material-symbols-outlined ${isWarning ? "text-amber-600" : "text-red-600"} font-bold`}>person</span>
              {isWarning ? "Thông tin đối tượng cảnh báo" : "Thông tin đối tượng"}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tên đối tượng</span>
                <span className="text-lg font-black text-on-surface uppercase tracking-tight">{matchedScam.name}</span>
              </div>
              
              <div className={`${isWarning ? "bg-amber-50/30 border-amber-100/60" : "bg-red-50/30 border-red-100/60"} border p-4 rounded-xl`}>
                <span className={`block text-xs font-bold ${isWarning ? "text-amber-700" : "text-red-700"} uppercase tracking-wider mb-1`}>
                  {isWarning ? "Kênh nhận diện / Tài khoản" : "Số tài khoản"}
                </span>
                <span className={`font-mono text-lg font-black ${isWarning ? "text-amber-700" : "text-red-650 text-red-600"} selection:bg-red-200`}>
                  {matchedScam.accountNumber}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Ngân hàng / Nền tảng</span>
                <span className="text-base font-extrabold text-on-surface">{matchedScam.bankName}</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">SĐT / Zalo</span>
                <span className="font-mono text-base font-extrabold text-on-surface">
                  {matchedScam.phone || "Không cung cấp"}
                </span>
              </div>

              {matchedScam.facebook && (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl sm:col-span-2">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Đường dẫn mạng xã hội (Facebook/Social)</span>
                  <a
                    href={matchedScam.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-extrabold text-blue-600 hover:text-blue-800 hover:underline break-all flex items-center gap-1.5 mt-1"
                  >
                    <span className="material-symbols-outlined text-base">link</span>
                    {matchedScam.facebook}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Box 2: Chi tiết vụ việc */}
          <section className="bg-white border border-outline-variant p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className={`text-xl font-extrabold ${isWarning ? "text-amber-600" : "text-red-600"} mb-6 flex items-center gap-2.5`}>
              <span className={`material-symbols-outlined ${isWarning ? "text-amber-600" : "text-red-650 text-red-600"} font-bold`}>assignment_late</span>
              Chi tiết sự việc
            </h2>
            
            <div className="text-on-surface-variant text-sm sm:text-base leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100 mb-6">
              <p className="whitespace-pre-wrap font-medium">{matchedScam.desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-dashed border-outline-variant">
              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                  {isWarning ? "Tính chất ảnh hưởng" : "Tổng Số Tiền Thiệt Hại"}
                </span>
                {isWarning ? (
                  <span className="font-mono text-amber-600 font-black text-lg sm:text-xl bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-2xl inline-block mt-1">
                    Phi tài sản (0đ)
                  </span>
                ) : (
                  <span className="font-mono text-red-600 font-black text-2xl sm:text-3xl bg-red-50 border border-red-100 px-4 py-2.5 rounded-2xl inline-block mt-1">
                    {matchedScam.amount.toLocaleString("vi-VN")} VNĐ
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Hình thức vi phạm</span>
                <span className={`text-sm sm:text-base font-extrabold ${isWarning ? "text-amber-700 bg-amber-50 border-amber-100" : "text-red-700 bg-red-50 border-red-100"} px-4 py-2.5 rounded-2xl inline-block mt-1 capitalize`}>
                  {matchedScam.type}
                </span>
              </div>
            </div>
          </section>

          {/* Box 3: Hình ảnh / Bằng chứng */}
          <section className="bg-white border border-outline-variant p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className={`text-xl font-extrabold ${isWarning ? "text-amber-600" : "text-red-600"} mb-6 flex items-center gap-2.5`}>
              <span className={`material-symbols-outlined ${isWarning ? "text-amber-600" : "text-red-650 text-red-600"} font-bold`}>photo_library</span>
              Hình ảnh / Bằng chứng xác thực
            </h2>

            {matchedScam.images && matchedScam.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedScam.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 relative group cursor-zoom-in hover:shadow-md transition-all duration-300 flex items-center justify-center"
                  >
                    {!brokenImages[idx] ? (
                      <img
                        src={imgUrl}
                        alt={`Minh chứng thiệt hại ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-305"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setBrokenImages((prev) => ({ ...prev, [idx]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-50 text-slate-400">
                        <span className="material-symbols-outlined text-3xl mb-1 text-slate-400">broken_image</span>
                        <span className="text-[10px] font-bold block leading-tight">Hình ảnh không khả dụng</span>
                        <span className="text-[9px] text-slate-450 mt-0.5 block leading-tight">Đã bị gỡ khỏi máy chủ</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 rounded py-0.5 pointer-events-none">
                      Ảnh minh chứng {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">image_not_supported</span>
                <p className="text-sm font-semibold">Chưa đính kèm minh chứng hình ảnh trực tiếp.</p>
                <p className="text-xs text-slate-500 mt-1">Hồ sơ đã được cộng đồng xác minh thông qua các văn bản giao dịch khác.</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Verify Box & Advice */}
        <aside className="lg:col-span-4 space-y-8">
          <section className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-black text-on-surface mb-4">Ghi chú xác thực</h3>
            
            <div className={`${isWarning ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"} border p-5 rounded-2xl text-center mb-5`}>
              <span className={`font-mono text-3xl font-black ${isWarning ? "text-amber-600" : "text-red-600"} tracking-wider`}>
                {isWarning ? "WARNING" : "SCAM"}
              </span>
              <p className={`text-xs ${isWarning ? "text-amber-800" : "text-red-800"} font-bold uppercase tracking-wider mt-2`}>
                ĐÃ ĐƯỢC PHÊ DUYỆT
              </p>
              
              <div className={`mt-4 pt-4 border-t ${isWarning ? "border-amber-250 border-amber-200/50" : "border-red-200/50"} text-left space-y-2 text-xs`}>
                <div className="flex justify-between text-slate-500">
                  <span>Mã hồ sơ:</span>
                  <span className="font-mono font-bold text-slate-700">{matchedScam.id}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Ngày ghi nhận:</span>
                  <span className="font-bold text-slate-700">{matchedScam.date || "22/05/2026"}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Thời gian duyệt:</span>
                  <span className="font-bold text-slate-700">{matchedScam.time || "Vừa xong"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-sm text-slate-900">Khuyến nghị từ ban quản trị:</h4>
              <ul className="text-xs text-slate-600 space-y-2.5 pl-4 list-disc leading-relaxed">
                <li>Luôn tra cứu số tài khoản nhận tiền tại thanh tìm kiếm Check Zone trước khi thực hiện chuyển tiền.</li>
                <li>Không thực hiện giao dịch trung gian qua các cá nhân không thuộc đội ngũ Admin được duyệt.</li>
                <li>Bảo lưu mọi lịch sử trò chuyện, sao kê hóa đơn chuyển khoản đề phòng tranh chấp pháp lý sau này.</li>
              </ul>
            </div>
          </section>

          <div className={`bg-gradient-to-br ${isWarning ? "from-amber-800 to-amber-950" : "from-emerald-800 to-emerald-950"} text-white p-6 rounded-2xl shadow-md space-y-4 relative overflow-hidden`}>
            <span className="material-symbols-outlined text-[100px] text-white/5 absolute -right-4 -bottom-4 pointer-events-none">
              {isWarning ? "warning" : "gpp_good"}
            </span>
            <h3 className="text-base font-black text-emerald-300 uppercase tracking-tight flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">{isWarning ? "warning" : "shield"}</span>
              {isWarning ? "Bạn gặp vi phạm?" : "Bạn bị lừa đảo?"}
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {isWarning 
                ? "Hãy gửi thông tin báo cáo cảnh báo kèm theo bằng chứng chi tiết để hỗ trợ đội ngũ kiểm duyệt đưa đối tượng này vào danh sách cảnh báo của cộng đồng."
                : "Hãy gửi thông tin báo cáo tố giác kèm theo bằng chứng giao dịch chi tiết để hỗ trợ đội ngũ kiểm duyệt đưa đối tượng này vào danh sách đen của cộng đồng."}
            </p>
            <Link
              to="/report"
              state={{ defaultCategory: isWarning ? "Cảnh báo hành vi" : "Lừa đảo tài chính" }}
              className="w-full text-center block bg-white text-emerald-900 font-extrabold text-xs py-3 rounded-xl hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
            >
              {isWarning ? "Gửi Cảnh Báo Ngay" : "Gửi Tố Cáo Ngay"}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

