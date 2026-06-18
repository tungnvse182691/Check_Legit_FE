import React, { useState } from "react";
import { Link } from "react-router-dom";

export function About() {
  // Contact state
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !senderMessage.trim()) {
      alert("Vui lòng điền đầy đủ tất cả thông tin liên lạc trước khi gửi bưu chính.");
      return;
    }
    setSubmitSuccess(true);
    setSenderName("");
    setSenderEmail("");
    setSenderMessage("");
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-margin-desktop py-12 min-h-screen space-y-16 animate-fade-in">
      {/* Visual Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-emerald-50 text-[#2e7d32] border border-emerald-100 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
          Bảo vệ giao dịch Việt Nam
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-tight">
          Sứ mệnh làm sạch không gian mạng
        </h1>
        <p className="text-body-lg text-on-surface-variant leading-relaxed font-medium">
          Check Zone là nền tảng tiên phong phi lợi nhuận cung cấp giải pháp tra cứu số tài khoản gian lận và xác thực ký quỹ tiền mặt đối với tiểu thương uy tín trên internet.
        </p>
      </section>

      {/* Grid: 3 Distinct Modules based on requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Về chúng tôi + Chính sách (8/12 width) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Về chúng tôi (About Us) */}
          <section id="about-us" className="bg-white border border-outline-variant p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none transform translate-x-6 -translate-y-6">
              <span className="material-symbols-outlined text-[120px] text-[#2e7d32]">groups</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#2e7d32] mb-6 flex items-center gap-2.5">
              <span className="material-symbols-outlined font-bold text-2xl">info</span>
              Về Chúng Tôi
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-on-surface-variant leading-relaxed">
              <p className="font-medium">
                Hình thành từ cuối năm 2024 bởi dự án liên minh an ninh mạng phi lợi nhuận Việt Nam, Check Zone đã hỗ trợ hàng triệu lượt tra cứu an toàn, giúp ngăn chặn hàng vạn giao dịch chuyển nhầm tiền đến ví của các thực thể lừa đảo công nghệ cao.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[#2e7d32] font-black uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-sm font-bold">shield</span> Sức mạnh bảo vệ
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    Các biên lai thanh toán và bằng chứng số do nạn nhân cung cấp đều được thẩm duyệt kỹ càng trước khi đưa thương nhân vào Sổ đen (Blacklist).
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[#2e7d32] font-black uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-sm font-bold">handshake</span> Thúc đẩy uy tín
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    Bảo chứng cho các tiểu thương chân chính thông qua quỹ đóng băng ký quỹ bảo hiểm, triệt tiêu động cơ quỵt tiền mặt hoặc giả danh lừa đảo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Chính sách & Pháp lý (Policy Terms) */}
          <section id="policies" className="bg-white border border-outline-variant p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl sm:text-2xl font-black text-[#2e7d32] mb-6 flex items-center gap-2.5">
              <span className="material-symbols-outlined font-bold text-2xl">policy</span>
              Chính Sách & Điều Khoản Sử Dụng
            </h2>

            <div className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
              <div>
                <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
                  1. Miễn trừ trách nhiệm bồi hoàn tự ý
                </h3>
                <p className="pl-2.5 text-slate-650 text-slate-600">
                  Check Zone tổng hợp thông tin tố cáo từ cộng đồng. Chúng tôi cung cấp giá trị tham khảo phòng bị rủi ro phi lợi nhuận và hoàn toàn miễn trừ trách nhiệm pháp lý nếu các cá nhân tự ý thương lượng chuyển tiền không thông qua cổng bảo lãnh.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
                  2. Cơ chế xử lý bồi thường Quỹ Ký Quỹ
                </h3>
                <p className="pl-2.5 text-slate-650 text-slate-600">
                  Đối với tiểu thương thuộc danh sách uy tín: Bất kỳ vi phạm thỏa thuận giao dịch nào được làm sáng tỏ bằng chứng từ rõ ràng sẽ được bồi hoàn tiền trực tiếp trích xuất từ Quỹ đóng băng ký quỹ tương ứng với bậc Kim Cương, Bạch Kim, Vàng.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
                  3. Chính sách bảo mật nguồn tố giác
                </h3>
                <p className="pl-2.5 text-slate-650 text-slate-600">
                  Tuyệt đối bảo mật vĩnh viễn địa chỉ Email, Số điện thoại và IP của người gửi đơn tố giác nhằm loại bỏ rủi ro bị các đối tượng xấu quấy phá và đe dọa ngoài đời thực.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT PANEL: Liên hệ chúng tôi (4/12 width) */}
        <aside id="contact" className="lg:col-span-4">
          <section className="bg-white border border-outline-variant p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#2e7d32] flex items-center gap-2">
                <span className="material-symbols-outlined font-bold text-xl">contact_page</span>
                Liên Hệ Ban Vận Hành
              </h2>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Nếu bạn có nhu cầu xin rút khỏi danh sách đen khi đã giải tỏa tranh chấp tiền bạc, hoặc đăng ký đóng quỹ ký quỹ uy tín, hãy điền thư liên lạc dưới đây.
              </p>
            </div>

            {/* Success feedback Toast inside contact wrapper */}
            {submitSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse shadow-sm">
                <span className="material-symbols-outlined text-[#2e7d32] font-bold text-sm">mail</span>
                <span>Thông điệp liên hệ đã được gửi thành công đến Admin.</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Họ tên của bạn *</label>
                <input
                  type="text"
                  className="w-full border-2 border-outline-variant focus:border-[#2e7d32] rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:ring-emerald-50"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Địa chỉ Email nhận thư phản hồi *</label>
                <input
                  type="email"
                  className="w-full border-2 border-outline-variant focus:border-[#2e7d32] rounded-xl px-3.5 py-2.5 text-sm outline-none font-mono transition-all focus:ring-4 focus:ring-emerald-50"
                  placeholder="name@email.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Chi tiết nội dung yêu cầu đóng góp *</label>
                <textarea
                  className="w-full border-2 border-outline-variant focus:border-[#2e7d32] rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none transition-all focus:ring-4 focus:ring-emerald-50 text-slate-705"
                  placeholder="Mô tả cụ thể nội dung khiếu nại bồi hoàn hoặc nhu cầu hợp tác..."
                  rows={4}
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white font-extrabold uppercase py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer text-center text-xs flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Gửi Thông Tin Liên Hệ
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <p className="font-extrabold text-[#2e7d32] text-[10px] uppercase tracking-widest">Kênh liên thông khẩn cấp</p>
              <div className="flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-sm">support_agent</span>
                <span>Hotline: support@checkzone.vn</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Telegram: @checkzone_mmo</span>
              </div>
            </div>
          </section>
        </aside>

      </div>
    </div>
  );
}
