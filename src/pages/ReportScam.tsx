import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function ReportScam() {
  const { addScamReport } = useApp();
  const navigate = useNavigate();

  // Form Inputs
  const [category, setCategory] = useState<"Lừa đảo tài chính" | "Cảnh báo hành vi">("Lừa đảo tài chính");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [facebook, setFacebook] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");

  // Feedback States
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // File Upload States & Refs
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category === "Cảnh báo hành vi") {
      setAmount(0);
      setType(""); // Clear type selection to match custom options
    } else {
      setType("");
    }
  }, [category]);

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    setErrorMsg("");
    const newFiles = Array.from(filesList);

    if (selectedFiles.length + newFiles.length > 5) {
      setErrorMsg("Tối đa chỉ được tải lên 5 ảnh bằng chứng.");
      return;
    }

    const validFiles: File[] = [];
    for (const file of newFiles) {
      if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
        setErrorMsg("Chỉ hỗ trợ ảnh định dạng JPG hoặc PNG.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Mỗi ảnh phải có dung lượng nhỏ hơn 5MB.");
        return;
      }
      validFiles.push(file);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Không thể tải ảnh minh chứng lên máy chủ. Vui lòng thử lại sau.");
      }

      const resData = await response.json();
      if (resData.success && resData.data && resData.data.url) {
        return resData.data.url;
      } else {
        throw new Error("Không thể xử lý đường dẫn ảnh minh chứng.");
      }
    } catch (err: any) {
      throw new Error(err.message || "Không thể tải ảnh minh chứng lên máy chủ. Vui lòng thử lại sau.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const showError = (msg: string) => {
      setErrorMsg(msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!name.trim()) {
      showError("Vui lòng nhập tên đối tượng hoặc biệt hiệu.");
      return;
    }
    if (!accountNumber.trim()) {
      showError("Vui lòng nhập số tài khoản ngân hàng của đối tượng.");
      return;
    }
    if (bankName === "Chọn ngân hàng" || !bankName) {
      showError("Vui lòng chọn ngân hàng giao dịch.");
      return;
    }
    if (category === "Lừa đảo tài chính" && amount <= 0) {
      showError("Vui lòng nhập đúng số tiền đã bị thiệt hại.");
      return;
    }
    if (type === "Chọn loại hình" || type === "Chọn loại hành vi" || !type) {
      showError(category === "Lừa đảo tài chính" ? "Vui lòng chọn loại hình lừa đảo." : "Vui lòng chọn loại hành vi.");
      return;
    }
    if (!desc.trim() || desc.length < 10) {
      showError("Vui lòng mô tả chi tiết diễn biến sự việc (Tối thiểu 10 ký tự).");
      return;
    }
    if (!isCaptchaChecked) {
      showError("Vui lòng xác minh bạn không phải là người máy.");
      return;
    }

    setSubmitting(true);

    try {
      // Upload files to ImgBB
      const imageUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadToImgBB(file);
        imageUrls.push(url);
      }

      // Submit Report
      await addScamReport({
        name,
        phone,
        bankName,
        accountNumber,
        desc,
        type,
        amount: category === "Cảnh báo hành vi" ? 0 : amount,
        victim: "Ẩn danh",
        facebook,
        images: imageUrls,
        category
      });

      // Show Success Modal
      setShowSuccess(true);

      // Clear Form
      setCategory("Lừa đảo tài chính");
      setName("");
      setPhone("");
      setAccountNumber("");
      setBankName("");
      setFacebook("");
      setAmount(0);
      setType("");
      setDesc("");
      setSelectedFiles([]);
      setIsCaptchaChecked(false);
    } catch (err: any) {
      console.error("Error uploading images or submitting report:", err);
      setErrorMsg(err.message || "Đã xảy ra lỗi trong quá trình gửi báo cáo.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="max-w-max-width mx-auto px-6 md:px-margin-desktop py-12">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-display-lg font-bold mb-2 tracking-tight text-on-surface">Gửi Tố Cáo & Cảnh Báo</h1>
        <p className="text-on-surface-variant max-w-2xl text-body-lg">Bằng cách cung cấp thông tin chính xác, bạn đang giúp cộng đồng phòng tránh những kẻ lừa đảo và các hành vi gian lận. Mọi thông tin sẽ được kiểm duyệt kỹ lưỡng trước khi công khai.</p>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-primary max-w-lg w-full p-8 rounded-2xl shadow-2xl text-center">
            <span className="material-symbols-outlined text-red-600 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_maybe</span>
            <h3 className="text-headline-md font-bold text-on-surface mb-2">ĐỀ XUẤT ĐÃ ĐƯỢC GỬI THÀNH CÔNG!</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Hệ thống đã ghi nhận hồ sơ của bạn. Ban quản trị sẽ đối chất bằng chứng, xác thực thông tin và duyệt đăng tải lên mạng lưới tìm kiếm công khai trong vòng 24h.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-white font-bold px-6 py-3 rounded-xl cursor-pointer hover:brightness-105 active:scale-95 transition-all w-full sm:w-auto text-sm"
              >
                VỀ TRANG CHỦ
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                className="border border-outline text-on-surface hover:bg-slate-50 font-bold px-6 py-3 rounded-xl cursor-pointer transition-all w-full sm:w-auto text-sm"
              >
                GỬI TIẾP BẢO CÁO KHÁC
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-gutter">
          {errorMsg && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-bold text-sm">
              🚨 {errorMsg}
            </div>
          )}

          {/* Group 0: Category Selector */}
          <section className="bg-surface-container-lowest p-8 border border-outline-variant rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined font-bold">rule</span>
              <h2 className="text-headline-md font-bold">Phân loại báo cáo</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer select-none transition-all ${category === "Lừa đảo tài chính"
                  ? "border-red-500 bg-red-50/50 text-red-900 ring-1 ring-red-500"
                  : "border-outline hover:bg-slate-100"
                }`}>
                <input
                  type="radio"
                  name="reportCategory"
                  value="Lừa đảo tài chính"
                  checked={category === "Lừa đảo tài chính"}
                  onChange={() => setCategory("Lừa đảo tài chính")}
                  className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <div>
                  <p className="font-bold text-sm text-red-900">Tố cáo lừa đảo tài chính</p>
                  <p className="text-xs text-on-surface-variant mt-1">Giao dịch mất tiền cọc, đầu tư sàn ảo, hack tài khoản chiếm giữ số tiền...</p>
                </div>
              </label>

              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer select-none transition-all ${category === "Cảnh báo hành vi"
                  ? "border-amber-500 bg-amber-50/50 text-amber-900 ring-1 ring-amber-500"
                  : "border-outline hover:bg-slate-100"
                }`}>
                <input
                  type="radio"
                  name="reportCategory"
                  value="Cảnh báo hành vi"
                  checked={category === "Cảnh báo hành vi"}
                  onChange={() => setCategory("Cảnh báo hành vi")}
                  className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                />
                <div>
                  <p className="font-bold text-sm text-amber-900">Cảnh báo hành vi xấu</p>
                  <p className="text-xs text-on-surface-variant mt-1">Boom hàng (bom hàng), giao hàng giả nhái, thái độ lồi lõm toxic khi giao dịch...</p>
                </div>
              </label>
            </div>
          </section>

          {/* Group 1: Scam Object Info */}
          <section className="bg-surface-container-lowest p-8 border border-outline-variant rounded-xl">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">person_search</span>
              <h2 className="text-headline-md font-bold">Thông tin đối tượng</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant">Tên đối tượng / Biệt hiệu</label>
                <input
                  className="border-outline border px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant">Số điện thoại / Zalo</label>
                <input
                  className="border-outline border px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="090x xxx xxx"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant">Số tài khoản ngân hàng</label>
                <input
                  className="border-outline border px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Nhập số tài khoản"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant">Tên ngân hàng</label>
                <select
                  className="border-outline border px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                >
                  <option>Chọn ngân hàng</option>
                  <option>Vietcombank</option>
                  <option>Techcombank</option>
                  <option>MB Bank</option>
                  <option>Agribank</option>
                  <option>Momo (Ví điện tử)</option>
                  <option>ZaloPay</option>
                  <option>Viettel Money</option>
                  <option>Vietinbank</option>
                  <option>BIDV</option>
                </select>
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant">Link Facebook / TikTok / Telegram</label>
                <input
                  className="border-outline border px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="https://facebook.com/username"
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Group 2: Report Content */}
          <section className="bg-surface-container-lowest p-8 border border-outline-variant rounded-xl">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">description</span>
              <h2 className="text-headline-md font-bold">Nội dung tố cáo</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category === "Lừa đảo tài chính" ? (
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm text-on-surface-variant">Số tiền bị lừa (VND)</label>
                  <div className="relative">
                    <input
                      className="w-full border-outline border px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-label-numeric pl-4 pr-12"
                      placeholder="0"
                      type="number"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">VND</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 opacity-60 select-none">
                  <label className="text-label-sm text-on-surface-variant">Số tiền thiệt hại (VND)</label>
                  <div className="relative">
                    <input
                      className="w-full border-outline border px-4 py-3 bg-slate-100 rounded-lg cursor-not-allowed font-label-numeric pl-4 pr-12 text-slate-500 font-bold"
                      value="0 VND"
                      disabled
                      type="text"
                    />
                  </div>
                  <p className="text-xs text-amber-700 italic">Mặc định là 0 VND đối với báo cáo cảnh báo hành vi phi tài chính.</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant">
                  {category === "Lừa đảo tài chính" ? "Loại hình lừa đảo" : "Loại hành vi cảnh báo"}
                </label>
                <select
                  className="border-outline border px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white WebkitAppearance-none"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {category === "Lừa đảo tài chính" ? (
                    <>
                      <option>Chọn loại hình</option>
                      <option>Mua bán online</option>
                      <option>Đầu tư tài chính</option>
                      <option>Giả danh cơ quan nhà nước</option>
                      <option>Tuyển cộng tác viên</option>
                      <option>Khác</option>
                    </>
                  ) : (
                    <>
                      <option>Chọn loại hành vi</option>
                      <option>Boom hàng / Bom hàng</option>
                      <option>Bán hàng giả / Nhái</option>
                      <option>Thái độ lồi lõm / Toxic</option>
                      <option>Giao sai mẫu / Lừa đảo nhẹ</option>
                      <option>Khác</option>
                    </>
                  )}
                </select>
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant">Chi tiết vụ việc</label>
                <textarea
                  className="border-outline border px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y"
                  placeholder={category === "Lừa đảo tài chính" ? "Mô tả chi tiết quá trình bị lừa đảo tài chính..." : "Mô tả chi tiết vụ việc boom hàng, bán hàng lỗi giả nhái hay thái độ giao dịch..."}
                  rows={5}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>
            </div>
          </section>

          {/* Group 3: Evidence Upload */}
          <section className="bg-surface-container-lowest p-8 border border-outline-variant rounded-xl">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">photo_library</span>
              <h2 className="text-headline-md font-bold">Bằng chứng hình ảnh</h2>
            </div>
            <div
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-colors group ${isDragging
                  ? "border-primary bg-primary/10"
                  : "border-outline-variant bg-surface-container-low hover:bg-surface-variant"
                }`}
            >
              <span className="material-symbols-outlined text-4xl text-outline mb-4 group-hover:text-primary transition-colors">cloud_upload</span>
              <p className="font-bold mb-1 col-span-1 border-none bg-transparent">Kéo và thả ảnh vào đây hoặc nhấp để chọn</p>
              <p className="text-on-surface-variant text-label-sm">Hỗ trợ JPG, PNG (Tối đa 5 ảnh, mỗi ảnh &lt; 5MB)</p>
              <input
                ref={fileInputRef}
                className="hidden"
                multiple
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                {selectedFiles.map((file, idx) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="aspect-square bg-surface-container rounded-lg border border-outline-variant relative overflow-hidden group">
                      <img className="w-full h-full object-cover" src={previewUrl} alt={`preview-${idx}`} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-650 bg-red-600 text-white rounded-full p-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  );
                })}
                {selectedFiles.length < 5 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                    className="aspect-square bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center cursor-pointer hover:bg-surface-container-highest transition-colors"
                  >
                    <span className="material-symbols-outlined text-outline">add</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Security & CTA */}
          <div className="bg-surface-container-lowest p-8 border border-outline-variant rounded-xl flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => setIsCaptchaChecked(!isCaptchaChecked)}
              className="w-full max-w-sm py-4 bg-surface border border-outline-variant rounded flex items-center justify-start gap-4 hover:bg-slate-50 cursor-pointer px-4 select-none"
            >
              <div className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center transition-all ${isCaptchaChecked ? "bg-emerald-500 border-emerald-500 text-white animate-scale-up" : "border-primary"}`}>
                {isCaptchaChecked && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
              </div>
              <span className="text-label-sm text-on-surface">Tôi không phải là người máy</span>
              <img alt="reCAPTCHA" className="w-6 h-6 ml-auto opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOPi49Q7wSHb5tlZ-cNrKywqf9_9Evb5743OOgOXhIsS2DsJZFxqnweB8It8wi1T94hfMUoAj1tQpumN0503dd4DhR8_BqWhWKfhbZPyaOlNjiV6Mto1aPJkHBsHxQMSeCTQiA7VzME0gWCF_h3A4xQd8qbP1pKWjqNfFMqehuPGe-PWzzmOu-xQVrPg48h9Y6Ufc85IF_7zpqTn_9zXAESZkzLzCu4gIuJRHExdH_JJm9EQKDefc-zeSLItMIGFMFeX1QKIn6ukSX" />
            </button>
            <button
              disabled={submitting}
              className={`w-full text-headline-md py-5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer ${submitting
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : category === "Cảnh báo hành vi"
                  ? "bg-amber-600 hover:bg-amber-700 text-white active:scale-[0.98]"
                  : "bg-primary-container text-on-primary-container hover:brightness-110 active:scale-[0.98]"
                }`}
              type="submit"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {submitting ? "sync" : (category === "Cảnh báo hành vi" ? "warning" : "gpp_maybe")}
              </span>
              {submitting ? "Đang xử lý hồ sơ..." : (category === "Cảnh báo hành vi" ? "GỬI CẢNH BÁO NGAY" : "GỬI TỐ CÁO NGAY")}
            </button>
            <p className="text-on-surface-variant text-label-sm text-center">
              Bằng việc nhấn "{category === "Cảnh báo hành vi" ? "Gửi Cảnh Báo" : "Gửi Tố Cáo"}", bạn cam đoan những thông tin trên là đúng sự thật và chịu trách nhiệm trước pháp luật.
            </p>
          </div>
        </form>

        <aside className="lg:col-span-4 space-y-gutter">
          <div className="bg-surface-container-high border-l-4 border-primary p-6 rounded-r-xl">
            <h3 className="font-bold mb-3 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined">info</span>
              Lưu ý quan trọng
            </h3>
            <ul className="space-y-3 text-on-surface-variant text-body-md list-disc ml-4">
              <li>Cung cấp ảnh chụp màn hình tin nhắn hoặc lịch sử chuyển tiền.</li>
              <li>Đảm bảo số tài khoản ngân hàng được nhập chính xác.</li>
              <li>Thông tin của người báo cáo sẽ được bảo mật tuyệt đối.</li>
              <li>Hệ thống sẽ tự động quét trùng lặp với cơ sở dữ liệu hiện có.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
