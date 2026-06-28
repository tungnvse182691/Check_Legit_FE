import React, { useState, useEffect } from "react";
import { useApp, ScamReport } from "../context/AppContext";
import { AnimatedTable, ColumnDef, BulkAction } from "../components/AnimatedTable";
import { Check, Trash2 } from "lucide-react";

export function AdminScamManagement() {
  const { scams, approveScamReport, deleteScamReport, updateScamReport } = useApp();
  const [successNotif, setSuccessNotif] = useState("");
  const [editedScams, setEditedScams] = useState<Record<string, ScamReport>>({});
  const [selectionInfo, setSelectionInfo] = useState<{
    scamId: string;
    field: keyof ScamReport;
    start: number;
    end: number;
    text: string;
    rect: { top: number; left: number; width: number; height: number };
  } | null>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".redact-btn-container")) {
        setSelectionInfo(null);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const getEditedScam = (scam: ScamReport) => {
    return editedScams[scam.id] || scam;
  };

  const updateField = (id: string, field: keyof ScamReport, value: any) => {
    setEditedScams(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || scams.find(s => s.id === id) || {}),
        [field]: value
      }
    }));
  };

  const isScamModified = (scam: ScamReport) => {
    const edited = editedScams[scam.id];
    if (!edited) return false;
    return (
      edited.name !== scam.name ||
      edited.phone !== scam.phone ||
      edited.bankName !== scam.bankName ||
      edited.accountNumber !== scam.accountNumber ||
      edited.desc !== scam.desc ||
      edited.victim !== scam.victim ||
      edited.facebook !== scam.facebook
    );
  };

  const handleSaveEdits = async (id: string) => {
    const edited = editedScams[id];
    if (!edited) return;
    const success = await updateScamReport(id, edited);
    if (success) {
      showNotification("Đã lưu các thay đổi thành công!");
      setEditedScams(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleCancelEdits = (id: string) => {
    setEditedScams(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSelectionMouseUp = (e: React.MouseEvent, scamId: string) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
    if (!element) return;

    const fieldElement = (element as HTMLElement).closest("[data-redact-field]");
    if (!fieldElement) return;

    const field = fieldElement.getAttribute("data-redact-field") as keyof ScamReport;
    const start = range.startOffset;
    const end = range.endOffset;
    const text = selection.toString();

    if (!text.trim()) return;

    const rect = range.getBoundingClientRect();
    setSelectionInfo({
      scamId,
      field,
      start,
      end,
      text,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    });
  };

  const applyRedaction = () => {
    if (!selectionInfo) return;
    const { scamId, field, start, end } = selectionInfo;
    const currentScam = scams.find(s => s.id === scamId);
    if (!currentScam) return;

    const originalRecord = getEditedScam(currentScam);
    const currentValue = (originalRecord[field] || "") as string;
    const newValue = currentValue.substring(0, start) + "****" + currentValue.substring(end);

    updateField(scamId, field, newValue);
    setSelectionInfo(null);
    window.getSelection()?.removeAllRanges();
  };

  const showNotification = (msg: string) => {
    setSuccessNotif(msg);
    setTimeout(() => {
      setSuccessNotif("");
    }, 3500);
  };

  const handleApprove = async (id: string, name: string) => {
    await approveScamReport(id);
    showNotification(`Đã duyệt báo cáo đối tượng "${name}" lên hệ thống cảnh báo công khai thành công.`);
  };

  const handleReject = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn bác bỏ và gỡ hoàn toàn tố cáo của đối tượng: "${name}"?`)) {
      await deleteScamReport(id);
      showNotification(`Đã bác bỏ & hoàn toàn xoá bỏ báo cáo đối tượng "${name}".`);
    }
  };

  const columns: ColumnDef<ScamReport>[] = [
    {
      key: "id",
      header: "Mã tố cáo",
      sortable: true,
      className: "w-16 min-w-[70px]",
      cell: (scam) => <span className="font-mono font-black text-slate-500">{scam.id}</span>
    },
    {
      key: "name",
      header: "Đối tượng bị tố",
      sortable: true,
      className: "w-60 min-w-[220px]",
      cell: (scam) => {
        const isRowWarning = scam.category === "Cảnh báo hành vi";
        return (
          <div className="flex flex-col">
            <p className="font-extrabold text-slate-900 capitalize text-xs whitespace-nowrap" title={scam.name}>{scam.name}</p>
            <span className={`text-[9px] ${isRowWarning ? "text-amber-800 bg-amber-50 border-amber-200" : "text-slate-550 bg-slate-100 border-slate-200 text-slate-500"} capitalize px-1.5 py-0.5 rounded border mt-1 inline-block font-black`}>
              {scam.type}
            </span>
          </div>
        );
      }
    },
    {
      key: "accountNumber",
      header: "Số tài khoản / SĐT",
      sortable: true,
      className: "w-28 min-w-[110px]",
      cell: (scam) => {
        const isRowWarning = scam.category === "Cảnh báo hành vi";
        return (
          <div>
            <p className={`font-mono text-xs font-black ${isRowWarning ? "text-amber-600" : "text-red-650"} whitespace-nowrap`}>
              {scam.accountNumber || "N/A"}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap font-semibold">
              {scam.bankName || "Zalo/Mạng xã hội"}
            </p>
          </div>
        );
      }
    },
    {
      key: "amount",
      header: "Số tiền thiệt hại",
      sortable: true,
      className: "w-24 min-w-[100px]",
      cell: (scam) => {
        const isRowWarning = scam.category === "Cảnh báo hành vi";
        return (
          <span className={`font-mono font-black text-xs ${isRowWarning ? "text-amber-600" : "text-red-600"}`}>
            {isRowWarning ? "Phi tài sản (0đ)" : scam.amount ? `${Number(scam.amount).toLocaleString("vi-VN")}đ` : "Không khai báo"}
          </span>
        );
      }
    },
    {
      key: "createdAt",
      header: "Thời gian",
      sortable: true,
      className: "w-20 min-w-[80px]",
      sortAccessor: (scam) => new Date(`${scam.date} ${scam.time}`).getTime(),
      cell: (scam) => (
        <div className="font-semibold">
          <p className="text-slate-800 text-xs">{scam.date}</p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{scam.time}</p>
        </div>
      )
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      className: "w-20 min-w-[80px]",
      cell: (scam) => {
        const isRowWarning = scam.category === "Cảnh báo hành vi";
        return scam.status === "Đã phê duyệt" ? (
          isRowWarning ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-850 border border-amber-200 uppercase tracking-wide whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              Cảnh báo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wide whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
              Đã duyệt
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-850 border border-amber-200 uppercase tracking-wide animate-pulse whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Chờ duyệt
          </span>
        );
      }
    },
    {
      key: "actions",
      header: "Thẩm duyệt",
      className: "w-24 min-w-[100px] text-right",
      cell: (scam) => (
        <div className="flex gap-1.5 justify-end items-center" onClick={(e) => e.stopPropagation()}>
          {scam.status !== "Đã phê duyệt" && (
            <button
              onClick={() => handleApprove(scam.id, scam.name)}
              className={`hover:brightness-105 text-white font-bold px-2 py-1 rounded text-[10px] uppercase transition-colors shrink-0 shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-0.5 ${
                scam.category === "Cảnh báo hành vi" ? "bg-amber-600 hover:bg-amber-700" : "bg-[#2e7d32] hover:bg-[#205c22]"
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Duyệt</span>
            </button>
          )}
          <button
            onClick={() => handleReject(scam.id, scam.name)}
            className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 hover:text-red-700 font-bold px-2 py-1 rounded text-[10px] uppercase transition-colors shrink-0 cursor-pointer whitespace-nowrap flex items-center gap-0.5"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xoá</span>
          </button>
        </div>
      )
    }
  ];

  // Define Expandable View
  const renderExpandableScam = (scam: ScamReport) => {
    const isRowWarning = scam.category === "Cảnh báo hành vi";
    const editedScam = getEditedScam(scam);
    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 font-medium select-text"
        onMouseUp={(e) => handleSelectionMouseUp(e, scam.id)}
      >
        
        {/* Left Column - General Details */}
        <div className="space-y-4">
          <div className={`p-4 border rounded-xl ${isRowWarning ? "bg-amber-50/20 border-amber-100" : "bg-red-50/20 border-red-100"}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isRowWarning ? "text-amber-800" : "text-red-700"}`}>
              {isRowWarning ? "Đối tượng bị cảnh báo" : "Đối tượng bị tố cáo"}
            </span>
            <span 
              data-redact-field="name"
              className={`font-black text-sm uppercase tracking-tight ${isRowWarning ? "text-amber-700" : "text-red-650"}`}
            >
              {editedScam.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Ngân hàng</span>
              <span data-redact-field="bankName" className="font-extrabold text-slate-800">
                {editedScam.bankName || "Không rõ"}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Số tài khoản</span>
              <span 
                data-redact-field="accountNumber"
                className={`font-mono font-black ${isRowWarning ? "text-amber-600" : "text-red-650"}`}
              >
                {editedScam.accountNumber || "N/A"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Số điện thoại</span>
              <span data-redact-field="phone" className="font-mono font-bold text-slate-800">
                {editedScam.phone || "Không có"}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Nạn nhân / Người tố</span>
              <span data-redact-field="victim" className="font-bold text-slate-800">
                {editedScam.victim || "Ẩn danh"}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Column - Narrative & Social links */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Nhật trình cáo giác</span>
            <div className="leading-relaxed text-slate-700 font-medium whitespace-pre-line max-h-36 overflow-y-auto">
              <span data-redact-field="desc">{editedScam.desc}</span>
            </div>
          </div>

          {editedScam.facebook && (
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Đường dẫn mạng xã hội</span>
              <a 
                href={editedScam.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline font-bold break-all flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span data-redact-field="facebook">{editedScam.facebook}</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column - Images & Bottom Actions */}
        <div className="flex flex-col justify-between gap-4">
          {editedScam.images && editedScam.images.length > 0 ? (
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-2">Bằng chứng hình ảnh ({editedScam.images.length})</span>
              <div className="grid grid-cols-3 gap-2">
                {editedScam.images.map((imgUrl, imgIdx) => (
                  <div 
                    key={imgIdx} 
                    className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={imgUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={imgUrl}
                        alt="minh chứng tố cáo"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 font-bold">
              Không có ảnh bằng chứng đính kèm
            </div>
          )}

          {/* Actions at the bottom of the drawer */}
          <div className="flex flex-col gap-2 pt-2">
            {isScamModified(scam) && (
              <div className="flex gap-2.5 w-full border-b border-slate-100 pb-2.5 mb-1 bg-amber-50/50 p-2 rounded-xl border border-amber-200" onClick={(e) => e.stopPropagation()}>
                <div className="text-[10px] text-amber-800 font-bold flex items-center gap-1 flex-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  Có thay đổi chưa lưu!
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdits(scam.id);
                  }}
                  className="bg-[#2e7d32] hover:bg-[#205c22] text-white text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Lưu chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdits(scam.id);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-colors border border-slate-300"
                >
                  Hủy bỏ
                </button>
              </div>
            )}

            <div className="flex gap-2.5">
              {scam.status !== "Đã phê duyệt" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isScamModified(scam)) {
                      alert("Vui lòng lưu chỉnh sửa trước khi phê duyệt.");
                      return;
                    }
                    handleApprove(scam.id, scam.name);
                  }}
                  className={`flex-1 text-white text-[10px] uppercase font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm tracking-wide cursor-pointer ${
                    isRowWarning ? "bg-amber-600 hover:bg-amber-700" : "bg-[#2e7d32] hover:bg-[#205c22]"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Phê duyệt</span>
                </button>
              ) : (
                <div className={`flex-1 text-[10px] font-bold py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1 ${
                  isRowWarning ? "bg-amber-50 text-amber-800 border-amber-100" : "bg-emerald-50 text-emerald-800 border-emerald-100"
                }`}>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Đã duyệt công khai
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(scam.id, scam.name);
                }}
                className="flex-1 py-2.5 border border-red-200 text-red-650 hover:bg-red-50 text-[10px] uppercase rounded-xl flex items-center justify-center gap-1 transition-colors font-bold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Xoá / Bác bỏ</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  };

  // Define Bulk Actions
  const bulkActions: BulkAction<ScamReport>[] = [
    {
      label: "Duyệt đã chọn",
      icon: <Check className="w-3.5 h-3.5" />,
      variant: "success",
      onClick: async (items) => {
        const pendingItems = items.filter(item => item.status !== "Đã phê duyệt");
        if (pendingItems.length === 0) {
          alert("Không có hồ sơ nào chưa duyệt trong danh sách chọn.");
          return;
        }

        if (confirm(`Bạn có chắc chắn muốn duyệt ${pendingItems.length} báo cáo đã chọn?`)) {
          let count = 0;
          for (const item of pendingItems) {
            await approveScamReport(item.id);
            count++;
          }
          showNotification(`Đã duyệt thành công ${count} báo cáo lên danh sách đen.`);
        }
      }
    },
    {
      label: "Xoá đã chọn",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      variant: "danger",
      onClick: async (items) => {
        if (confirm(`Bạn có chắc chắn muốn Xoá / Bác bỏ hoàn toàn ${items.length} báo cáo đã chọn?`)) {
          for (const item of items) {
            await deleteScamReport(item.id);
          }
          showNotification(`Đã xóa thành công ${items.length} hồ sơ báo cáo.`);
        }
      }
    }
  ];

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <header className="bg-white border-b border-outline-variant px-6 py-6 md:px-6 sticky top-0 z-10 shadow-sm">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3.5xl font-black text-on-surface tracking-tight">
              Quản lý báo cáo lừa đảo
            </h1>
          </div>
          <span className="bg-[#2e7d32] text-white px-4 py-2 rounded-2xl font-mono text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto uppercase shadow-sm">
            <span className="material-symbols-outlined text-xs">database</span>
            {scams.length} Hồ sơ tố cáo
          </span>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="w-full px-6 md:px-6 py-8 pb-20 flex-1 flex flex-col gap-6">

        {successNotif && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-[#2e7d32] font-bold">check_circle</span>
            <p className="text-xs sm:text-sm font-bold leading-relaxed">{successNotif}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <AnimatedTable
            data={scams}
            columns={columns}
            searchPlaceholder="Tìm tên, số tài khoản, số điện thoại, ngân hàng..."
            searchKeys={["name", "accountNumber", "phone", "bankName", "id", "type"]}
            expandableRender={renderExpandableScam}
            bulkActions={bulkActions}
            rowKey={(item) => item.id}
          />
        </div>
      </div>

      {selectionInfo && (
        <div
          className="redact-btn-container fixed z-[9999] bg-slate-900 text-white rounded-lg shadow-xl px-2.5 py-1.5 flex items-center gap-1.5 border border-slate-700 animate-fade-in"
          style={{
            top: `${selectionInfo.rect.top - 40}px`,
            left: `${selectionInfo.rect.left + selectionInfo.rect.width / 2 - 45}px`,
          }}
        >
          <button
            type="button"
            onClick={applyRedaction}
            className="bg-red-650 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-0.5"
          >
            <span>Che (*)</span>
          </button>
        </div>
      )}
    </div>
  );
}
