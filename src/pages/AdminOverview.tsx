import { useApp } from "../context/AppContext";

export function AdminOverview() {
  const { scams, legitList } = useApp();

  const totalReports = scams.length;
  const pendingReports = scams.filter((s) => s.status === "Đang chờ duyệt").length;
  const approvedReports = scams.filter((s) => s.status === "Đã phê duyệt").length;
  const totalLegit = legitList.length;

  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header section with Forest Green touchpoints */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[#2e7d32] text-xs font-black uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full inline-block mb-1.5">
              Hệ thống cảnh giới tối cao
            </span>
            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h2>
            <p className="text-xs text-slate-500 mt-0.5">Số liệu thống kê thời gian thực từ cơ sở dữ liệu quốc gia Check Zone.</p>
          </div>
          <span className="bg-emerald-55 bg-emerald-50 text-[#2e7d32] px-4 py-2 rounded-2xl font-mono text-xs font-bold border border-emerald-200 shadow-sm inline-flex items-center gap-1.5 self-start sm:self-auto uppercase">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-ping"></span>
            Máy chủ đồng bộ • LIVE
          </span>
        </header>

        {/* Stats Grid section using clean, white minimalist cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Reports */}
          <div className="bg-white border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Tổng tố cáo bị nộp</span>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 text-sm font-bold">gpp_bad</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {totalReports} <span className="text-xs font-medium text-slate-450 text-slate-500 font-sans">đơn nộp</span>
              </p>
            </div>
          </div>

          {/* Card 2: Pending Approval */}
          <div className="bg-white border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Yêu cầu chờ thẩm định</span>
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-600 text-sm font-bold">gpp_maybe</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-amber-600 tracking-tight">
                {pendingReports} <span className="text-xs font-medium text-slate-450 text-slate-500 font-sans">hồ sơ</span>
              </p>
            </div>
          </div>

          {/* Card 3: Approved & Blacklisted */}
          <div className="bg-white border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Đã phê duyệt công khai</span>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-700 text-sm font-bold">shield_with_house</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-red-600 tracking-tight">
                {approvedReports} <span className="text-xs font-medium text-slate-450 text-slate-500 font-sans">đối tượng</span>
              </p>
            </div>
          </div>

          {/* Card 4: Legit Merchant */}
          <div className="bg-white border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Hộ kinh doanh ký quỹ</span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#2e7d32] text-sm font-bold">verified_user</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-[#2e7d32] tracking-tight">
                {totalLegit} <span className="text-xs font-medium text-slate-450 text-slate-500 font-sans">cửa hàng</span>
              </p>
            </div>
          </div>

        </div>

        {/* Detailed Activity table with clean, light design */}
        <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">Chi tiết hoạt động mới nộp</h3>
              <p className="text-xs text-slate-500 mt-0.5">Khớp lệnh tố giác mới từ nguồn cộng đồng Check Zone.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px] text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-light border-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-widest opacity-80">
                  <th className="px-6 py-4 pl-8">Đối tượng lừa đảo</th>
                  <th className="px-6 py-4">Định vị thông tin giao dịch</th>
                  <th className="px-6 py-4 text-center">Trạng thái duyệt</th>
                  <th className="px-6 py-4 text-right pr-8">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {scams.slice(0, 6).map((scam) => {
                  const isWarning = scam.category === "Cảnh báo hành vi";
                  return (
                    <tr key={scam.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 pl-8">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${isWarning ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"} flex items-center justify-center shrink-0 border`}>
                            <span className={`material-symbols-outlined text-sm font-bold ${isWarning ? "text-amber-600" : "text-red-600"}`}>
                              {isWarning ? "warning" : "person_off"}
                            </span>
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-950 text-sm uppercase tracking-tight">{scam.name}</p>
                            <span className={`text-[10px] ${isWarning ? "text-amber-800 bg-amber-50 border-amber-200" : "text-slate-500 bg-slate-100"} capitalize px-1.5 py-0.5 rounded mt-0.5 inline-block`}>
                              {scam.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs font-black text-slate-800">{scam.accountNumber || "N/A"}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{scam.bankName || "Zalo/Mạng xã hội"}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {scam.status === "Đã phê duyệt" ? (
                          isWarning ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-850 border border-amber-200 uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              CẢNH BÁO Hành Vi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-100 uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-650 bg-red-600"></span>
                              ĐÃ BAN Blacklist
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            YÊU CẦU Thẩm Định
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right pr-8 font-mono text-slate-400 text-[10px]">
                        {scam.time || "Cách đây 5 phút"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
