import { useState } from "react";
import { useApp } from "../context/AppContext";

export function AdminScamManagement() {
  const { scams, approveScamReport, deleteScamReport } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(scams.length > 0 ? scams[0].id : null);
  const [successNotif, setSuccessNotif] = useState("");

  const selectedScam = scams.find((s) => s.id === selectedId) || (scams.length > 0 ? scams[0] : null);

  const showNotification = (msg: string) => {
    setSuccessNotif(msg);
    setTimeout(() => {
      setSuccessNotif("");
    }, 3500);
  };

  const handleApprove = (id: string, name: string) => {
    approveScamReport(id);
    showNotification(`Đã duyệt báo cáo đối tượng "${name}" lên hệ thống cảnh báo công khai thành công.`);
  };

  const handleReject = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn bác bỏ và gỡ hoàn toàn tố cáo của đối tượng: "${name}"?`)) {
      deleteScamReport(id);
      if (selectedId === id) {
        const remaining = scams.filter(s => s.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      }
      showNotification(`Đã bác bỏ & hoàn toàn xoá bỏ báo cáo của đối tượng "${name}".`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <header className="bg-white border-b border-outline-variant px-6 py-6 md:px-margin-desktop sticky top-0 z-10 shadow-sm shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[#2e7d32] text-xs font-black uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full inline-block mb-1.5">
              Hệ thống thẩm định tối cao
            </span>
            <h1 className="text-2xl md:text-3.5xl font-black text-on-surface tracking-tight">
              Quản lý báo cáo lừa đảo
            </h1>
          </div>
          <span className="bg-[#2e7d32] text-white px-4 py-2 rounded-2xl font-mono text-xs font-bold shadow-sm inline-flex items-center gap-1.5 self-start sm:self-auto uppercase">
            <span className="material-symbols-outlined text-xs">database</span>
            {scams.length} Hồ sơ tố cáo
          </span>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="max-w-6xl mx-auto w-full px-6 md:px-margin-desktop py-8 pb-20 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Main List Section (2/3 width on desktop) */}
        <section className="flex-1 space-y-6">
          {successNotif && (
            <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined text-[#2e7d32] font-bold">check_circle</span>
              <p className="text-xs sm:text-sm font-bold leading-relaxed">{successNotif}</p>
            </div>
          )}

          {scams.length === 0 ? (
            <div className="text-center py-24 bg-white border border-outline-variant rounded-2xl p-8 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-emerald-600 mb-4 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_good</span>
              <h3 className="font-extrabold text-xl text-on-surface mb-2">Hộp thư báo cáo trống</h3>
              <p className="text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Check Zone tạm thời chưa ghi nhận bất kỳ đơn nộp tố cáo lừa đảo nào cần phê duyệt từ cộng đồng.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px] text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-outline-variant text-slate-700 text-[10px] font-bold uppercase tracking-widest opacity-80">
                      <th className="p-4 pl-6">Mã tố cáo</th>
                      <th className="p-4">Đối tượng bị tố</th>
                      <th className="p-4">Số tài khoản / SĐT</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 pr-6 text-right">Thẩm duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {scams.map((scam, idx) => {
                      const isRowWarning = scam.category === "Cảnh báo hành vi";
                      return (
                        <tr
                          key={scam.id}
                          onClick={() => setSelectedId(scam.id)}
                          className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${selectedId === scam.id ? "bg-emerald-50/50 font-medium" : ""}`}
                        >
                          <td className="p-4 pl-6 font-mono font-black text-slate-500">
                            {scam.id}
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-900 text-sm capitalize">{scam.name}</p>
                            <span className={`text-[10px] ${isRowWarning ? "text-amber-800 bg-amber-50 border-amber-200" : "text-slate-500 bg-slate-100 border-slate-200"} capitalize px-2 py-0.5 rounded border mt-1 inline-block`}>
                              {scam.type}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className={`font-mono text-xs font-bold ${isRowWarning ? "text-amber-600" : "text-red-600"}`}>{scam.accountNumber || "N/A"}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{scam.bankName || "Zalo/Mạng xã hội"}</p>
                          </td>
                          <td className="p-4">
                            {scam.status === "Đã phê duyệt" ? (
                              isRowWarning ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-850 border border-amber-200 uppercase tracking-wide">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                  Cảnh báo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
                                  Đã duyệt
                                </span>
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-850 border border-amber-200 uppercase tracking-wide animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                Chờ duyệt
                              </span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex gap-2 justify-end items-center" onClick={(e) => e.stopPropagation()}>
                              {scam.status !== "Đã phê duyệt" && (
                                <button
                                  onClick={() => handleApprove(scam.id, scam.name)}
                                  className={`hover:brightness-105 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition-colors shrink-0 shadow-sm cursor-pointer ${isRowWarning ? "bg-amber-600 hover:bg-amber-700" : "bg-[#2e7d32] hover:bg-[#205c22]"}`}
                                >
                                  Duyệt
                                </button>
                              )}
                              <button
                                onClick={() => handleReject(scam.id, scam.name)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition-colors shrink-0 cursor-pointer"
                              >
                                Xoá
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar Information View (1/3 width on desktop) */}
        <aside className="w-full lg:w-[400px] shrink-0">
          {selectedScam ? (
            (() => {
              const isDetailWarning = selectedScam.category === "Cảnh báo hành vi";
              return (
                <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm sticky top-28 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto animate-fade-in">
                  <div className="border-b border-outline-variant pb-4">
                    <span className={`text-[10px] font-bold ${isDetailWarning ? "bg-amber-50 text-amber-800 border-amber-100" : "bg-red-50 text-red-700 border-red-100"} px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block`}>
                      {isDetailWarning ? "Cảnh báo chờ phê chuẩn" : "Hồ sơ chờ phê chuẩn"}
                    </span>
                    <h3 className="text-lg font-black text-on-surface uppercase tracking-tight">Chi tiết hồ sơ nộp</h3>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">ID: {selectedScam.id}</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Visual Identity */}
                    <div className={`border p-4 rounded-xl ${isDetailWarning ? "bg-amber-50/30 border-amber-100" : "bg-red-50/30 border-red-100"}`}>
                      <span className={`text-[10px] ${isDetailWarning ? "text-amber-850 text-amber-800" : "text-red-800"} uppercase tracking-widest font-extrabold block mb-1`}>
                        {isDetailWarning ? "Đối tượng bị cảnh báo" : "Đối tượng bị tố cáo"}
                      </span>
                      <span className={`font-black text-sm uppercase tracking-tight ${isDetailWarning ? "text-amber-700" : "text-red-600"}`}>{selectedScam.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">Ngân hàng</span>
                        <span className="font-extrabold text-on-surface">{selectedScam.bankName || "Không rõ"}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">Số tài khoản</span>
                        <span className={`font-mono font-black ${isDetailWarning ? "text-amber-600" : "text-red-600"}`}>{selectedScam.accountNumber || "N/A"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">Số điện thoại</span>
                        <span className="font-mono font-bold text-on-surface">{selectedScam.phone || "Không có"}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">Thời gian tố</span>
                        <span className="font-bold text-on-surface">{selectedScam.time || "Vừa xong"}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1">
                        {isDetailWarning ? "Tính chất hành vi" : "Thiệt hại ước tính"}
                      </span>
                      {isDetailWarning ? (
                        <span className="font-mono font-bold text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          Phi tài sản (0đ)
                        </span>
                      ) : (
                        <span className="font-mono font-black text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          {selectedScam.amount ? `${Number(selectedScam.amount).toLocaleString("vi-VN")}đ` : "Không khai báo"}
                        </span>
                      )}
                    </div>

                    {selectedScam.facebook && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1">Đường dẫn MXH</span>
                        <a href={selectedScam.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold break-all flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">link</span> {selectedScam.facebook}
                        </a>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1">Nhật trình cáo giác</span>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed text-slate-700 font-medium whitespace-pre-line max-h-32 overflow-y-auto mb-1">
                        {selectedScam.desc}
                      </div>
                    </div>

                    {selectedScam.images && selectedScam.images.length > 0 && (
                      <div>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1.5">Ảnh bằng chứng ({selectedScam.images.length})</span>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedScam.images.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                              <img
                                src={imgUrl}
                                alt="minh chứng tố cáo"
                                className="w-full h-full object-cover hover:scale-110 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Approval & reject controls inside sidebar */}
                  <div className="pt-4 border-t border-slate-150 space-y-2.5">
                    {selectedScam.status !== "Đã phê duyệt" ? (
                      <button
                        onClick={() => handleApprove(selectedScam.id, selectedScam.name)}
                        className={`w-full text-white text-xs uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-black shadow-sm tracking-wider cursor-pointer ${isDetailWarning ? "bg-amber-600 hover:bg-amber-700" : "bg-[#2e7d32] hover:bg-[#205c22]"}`}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">verified</span>
                        {isDetailWarning ? "Phê duyệt lên Cảnh Báo Giao Dịch" : "Phê duyệt lên Danh Sách Đen"}
                      </button>
                    ) : (
                      <div className={`w-full text-xs font-bold py-3 px-4 rounded-xl border flex items-center justify-center gap-1.5 ${isDetailWarning ? "bg-amber-50 text-amber-800 border-amber-100" : "bg-emerald-50 text-emerald-800 border-emerald-100"}`}>
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Hồ sơ này đã hiển thị trên web
                      </div>
                    )}

                    <button
                      onClick={() => handleReject(selectedScam.id, selectedScam.name)}
                      className="w-full py-3.5 border border-red-200 text-red-650 hover:bg-red-50 text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors font-extrabold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">gpp_bad</span>
                      Bác bỏ & Gỡ hoàn toàn tố cáo
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-slate-50 border border-outline-variant rounded-2xl p-6 text-center text-on-surface-variant text-xs">
              Vui lòng chọn một báo cáo lừa đảo ở bảng bên cạnh để nghiên cứu và thẩm định hồ sơ nộp.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
