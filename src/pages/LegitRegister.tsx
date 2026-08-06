import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp, API_BASE_URL } from "../context/AppContext";

export function LegitRegister() {
  const navigate = useNavigate();
  const { systemSettings } = useApp();

  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [phoneZalo, setPhoneZalo] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Gói Vàng: 500,000 VND");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const plans = [
    { id: "gold", name: "Gói Vàng", price: "500,000 VND", badge: "Bảo chứng cơ bản", color: "border-amber-400 bg-amber-50/40 text-amber-900" },
    { id: "platinum", name: "Gói Bạch Kim", price: "1,000,000 VND", badge: "Bảo chứng tiêu chuẩn", color: "border-slate-400 bg-slate-50/40 text-slate-900" },
    { id: "diamond", name: "Gói Kim Cương", price: "2,000,000 VND", badge: "Bảo chứng cao cấp", color: "border-cyan-400 bg-cyan-50/40 text-cyan-900" },
    { id: "elite", name: "Gói Elite", price: "3,000,000 VND", badge: "Bảo chứng tối đa", color: "border-emerald-500 bg-emerald-50/40 text-emerald-900" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Vui lòng nhập Tên của bạn.");
      return;
    }
    if (!phoneZalo.trim()) {
      setErrorMsg("Vui lòng nhập SĐT / Zalo liên hệ.");
      return;
    }
    if (!category.trim()) {
      setErrorMsg("Vui lòng nhập Lĩnh vực hoạt động.");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Vui lòng nhập Mô tả chi tiết hồ sơ năng lực.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try Discord Webhook if configured
      const discordUrl = systemSettings?.discordWebhookUrl || import.meta.env.VITE_DISCORD_WEBHOOK_URL;
      if (discordUrl) {
        await fetch(discordUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "🌟 ĐĂNG KÝ HỒ SƠ UY TÍN MỚI!",
                color: 3066993, // Emerald green
                fields: [
                  { name: "Họ & Tên", value: fullName, inline: true },
                  { name: "Thương hiệu", value: brandName || "Không có", inline: true },
                  { name: "SĐT / Zalo", value: phoneZalo, inline: true },
                  { name: "Lĩnh vực", value: category, inline: true },
                  { name: "Gói lựa chọn", value: selectedPlan, inline: true },
                  { name: "Mô tả năng lực", value: description },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        }).catch((err) => console.warn("Discord Webhook post error:", err));
      }

      // 2. Post to Backend API if available
      try {
        await fetch(`${API_BASE_URL}/public/legit/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            brandName,
            phoneZalo,
            category,
            description,
            selectedPlan,
          }),
        });
      } catch (apiErr) {
        console.warn("Backend API register fallback warning:", apiErr);
      }

      setShowSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg("Đã xảy ra lỗi trong quá trình gửi hồ sơ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-margin-desktop py-12 min-h-screen space-y-10 animate-fade-in">
      {/* Back link */}
      <Link
        to="/legit"
        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:underline bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl transition-all uppercase tracking-wider"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Quay lại Danh sách Uy tín
      </Link>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 sm:p-10 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 inline-block mb-3">
            XÁC MINH THƯƠNG HIỆU
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
            Đăng Ký Hồ Sơ Uy Tín
          </h1>
          <p className="text-body-md opacity-90 leading-relaxed font-medium">
            “Bạn muốn tăng độ tin cậy cho thương hiệu của mình trong mắt khách hàng? Hãy tạo Hồ sơ Uy tín để được xác minh và hiển thị trên CheckZone - Được xác minh, tăng niềm tin và giúp khách hàng an tâm giao dịch”
          </p>
        </div>
        <span className="material-symbols-outlined absolute right-6 bottom-6 text-[140px] text-white/10 pointer-events-none">
          verified
        </span>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-emerald-500 max-w-lg w-full p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
            <span className="material-symbols-outlined text-emerald-600 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <h3 className="text-headline-md font-bold text-on-surface mb-2">ĐĂNG KÝ HỒ SƠ THÀNH CÔNG!</h3>
            <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
              Thông tin đăng ký của bạn đã được ghi nhận. Ban quản trị CheckZone sẽ liên hệ qua Zalo / SĐT <strong className="text-emerald-700 font-mono">{phoneZalo}</strong> trong vòng 24h để hoàn tất thủ tục xác minh ký quỹ.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/legit")}
                className="bg-primary text-white font-bold px-6 py-3 rounded-xl cursor-pointer hover:bg-emerald-800 transition-all w-full text-sm"
              >
                VỀ DANH SÁCH UY TÍN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-outline-variant p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-on-surface flex items-center gap-2 border-b border-slate-100 pb-4">
          <span className="material-symbols-outlined text-primary font-bold">assignment</span>
          Thông tin đăng ký
        </h2>

        {errorMsg && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-bold text-sm">
            🚨 {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên của bạn */}
          <div className="flex flex-col gap-2">
            <label className="text-label-sm font-bold text-on-surface-variant">
              Tên của bạn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập họ và tên đầy đủ..."
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-outline border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>

          {/* Tên thương hiệu */}
          <div className="flex flex-col gap-2">
            <label className="text-label-sm font-bold text-on-surface-variant">
              Tên thương hiệu <span className="text-xs font-normal text-slate-400">(nếu có)</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Shop Giày Sneaker Chính Hãng"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="border-outline border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>

          {/* SĐT / Zalo */}
          <div className="flex flex-col gap-2">
            <label className="text-label-sm font-bold text-on-surface-variant">
              SĐT / Zalo liên hệ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="09x xxx xxxx"
              value={phoneZalo}
              onChange={(e) => setPhoneZalo(e.target.value)}
              className="border-outline border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
            />
          </div>

          {/* Lĩnh vực hoạt động */}
          <div className="flex flex-col gap-2">
            <label className="text-label-sm font-bold text-on-surface-variant">
              Lĩnh vực hoạt động <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Mua bán tài khoản game, MMO, Đồ điện tử..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-outline border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Mô tả chi tiết hồ sơ năng lực */}
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-bold text-on-surface-variant">
            Mô tả chi tiết hồ sơ năng lực <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            placeholder="Mô tả tóm tắt kinh nghiệm hoạt động, các kênh giao dịch chính, quy mô khách hàng..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-outline border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-y"
          />
        </div>

        {/* Chọn gói hồ sơ muốn đăng ký */}
        <div className="space-y-3 pt-2">
          <label className="text-label-sm font-bold text-on-surface-variant block">
            Chọn gói hồ sơ muốn đăng ký <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((plan) => {
              const fullPlanName = `${plan.name}: ${plan.price}`;
              const isSelected = selectedPlan === fullPlanName;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(fullPlanName)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? `${plan.color} ring-2 ring-emerald-500 shadow-md`
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-base text-slate-900">{plan.name}</span>
                    <input
                      type="radio"
                      name="plan"
                      checked={isSelected}
                      onChange={() => setSelectedPlan(fullPlanName)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <p className="font-mono text-lg font-black text-emerald-700">{plan.price}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1 block">
                      {plan.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-emerald-800 text-white font-extrabold text-base py-4 rounded-2xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-2xl">verified</span>
            <span>{isSubmitting ? "Đang gửi đăng ký..." : "GỬI ĐĂNG KÝ HỒ SƠ UY TÍN"}</span>
          </button>
        </div>
      </form>

      {/* Explanatory Policy Section */}
      <section className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 text-slate-700 text-sm leading-relaxed">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl font-bold">shield</span>
            Về gói Hồ sơ Uy tín
          </h3>
          <div className="space-y-3 text-slate-600 text-xs sm:text-sm font-medium">
            <p>
              Khoản phí đăng ký Hồ sơ Uy tín là <strong className="text-slate-900">khoản ký quỹ bảo chứng</strong> do chủ hồ sơ nộp vào nền tảng CheckZone nhằm tăng mức độ tin cậy khi tham gia giao dịch.
            </p>
            <p>
              Khoản ký quỹ này được CheckZone quản lý và <strong className="text-slate-900">có thể được sử dụng để hỗ trợ giải quyết các tranh chấp, bồi hoàn hoặc bảo vệ quyền lợi của người giao dịch</strong>, theo đúng <strong>Chính sách Ký quỹ và Bảo vệ giao dịch</strong> của nền tảng.
            </p>
            <p>
              Việc tham gia Hồ sơ Uy tín <strong>không đồng nghĩa CheckZone bảo lãnh cho mọi giao dịch</strong>, mà là cơ chế tăng cường niềm tin và hỗ trợ xử lý khi phát sinh sự cố theo phạm vi và điều kiện được quy định.
            </p>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div>
          <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl font-bold">gavel</span>
            Chính sách sử dụng khoản ký quỹ
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-600 text-xs sm:text-sm font-medium">
            <li>Khoản ký quỹ thuộc quyền quản lý của CheckZone trong thời gian Hồ sơ Uy tín còn hiệu lực.</li>
            <li>Chỉ được sử dụng theo các trường hợp quy định trong <strong>Chính sách Ký quỹ và Bảo vệ giao dịch</strong>.</li>
            <li>Chủ hồ sơ có quyền yêu cầu hoàn trả khoản ký quỹ khi chấm dứt tham gia chương trình, sau khi hoàn tất các nghĩa vụ và không còn tranh chấp hoặc khiếu nại đang xử lý theo quy định của chính sách ký quỹ.</li>
            <li>Tài khoản ký quỹ được xử lý theo quy định của <strong>Chính sách Ký quỹ</strong>.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
