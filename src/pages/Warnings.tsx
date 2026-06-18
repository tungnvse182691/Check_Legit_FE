import React, { useState } from "react";
import { Link } from "react-router-dom";

interface CardDetail {
  id: string;
  title: string;
  shortDesc: string;
  desc: string;
  tactics: string[];
  prevention: string[];
  severity: "High" | "Critical" | "Warning";
  icon: string;
}

export function Warnings() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  // Interactive Risk Assessment Questionnaire State
  const [riskAnswers, setRiskAnswers] = useState({
    noVerify: false,
    prepay: false,
    tooCheap: false,
    rushed: false,
    weirdLink: false,
    refuseMiddleman: false,
    bankMismatch: false,
    editedBill: false,
  });

  const assessRiskScore = () => {
    const keys = Object.keys(riskAnswers) as Array<keyof typeof riskAnswers>;
    const checkedCount = keys.filter(key => riskAnswers[key]).length;
    const totalItems = keys.length;
    if (totalItems === 0) return 0;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const getRiskLevel = (score: number) => {
    if (score === 0) return { label: "An toàn", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (score <= 25) return { label: "Rủi ro thấp", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score <= 60) return { label: "Rủi ro trung bình", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { label: "NGUY HIỂM CAO", color: "text-red-600 bg-red-50 border-red-200 animate-pulse" };
  };

  const riskScore = assessRiskScore();
  const riskLevel = getRiskLevel(riskScore);

  const guides = [
    {
      step: "01",
      title: "Xác minh danh tính",
      desc: "Luôn tra cứu số điện thoại, số tài khoản ngân hàng của đối phương trên CHECK ZONE trước khi thực hiện giao dịch.",
      icon: "verified_user",
    },
    {
      step: "02",
      title: "Không chuyển tiền trước",
      desc: "Tránh tuyệt đối việc cọc tiền hoặc thanh toán 100% trước cho các bên bán hàng tự phát trên mạng xã hội không có bảo đảm.",
      icon: "gpp_maybe",
    },
    {
      step: "03",
      title: "Dùng giao dịch trung gian",
      desc: "Sử dụng các quản trị viên trung gian uy tín hoặc nền tảng thương mại điện tử có chính sách hoàn tiền và giữ tiền đảm bảo an toàn.",
      icon: "handshake",
    },
    {
      step: "04",
      title: "Kiểm tra kỹ thông tin",
      desc: "Đặc biệt chú ý kiểm tra tên người thụ hưởng trên ứng dụng ngân hàng trùng khớp với tên người đang trò chuyện thương thảo.",
      icon: "fact_check",
    },
  ];

  const scamCards: CardDetail[] = [
    {
      id: "shipper",
      title: "Giả danh nhân viên giao hàng đòi tiền thu hộ (COD)",
      shortDesc: "Mạo danh nhân viên giao hàng yêu cầu chuyển khoản thanh toán khi không có nhà.",
      desc: "Kẻ gian thường theo dõi các buổi phát trực tiếp (livestream) bán hàng hoặc thông tin công khai của bạn, sau đó lập tài khoản giả mạo tổng đài hoặc lấy danh nghĩa người giao hàng gọi điện thông báo đơn hàng của bạn đã đến. Khi thấy bạn bận hoặc không có nhà, họ sẽ yêu cầu thanh toán chuyển khoản trước vào tài khoản lạ rồi cắt đứt mọi liên lạc.",
      tactics: [
        "Thu thập địa chỉ, số điện thoại từ các bình luận công khai.",
        "Gọi điện vào giờ hành chính khi nạn nhân thường đi làm dễ mất cảnh giác.",
        "Sử dụng giọng điệu hối thúc, giả vờ đang vội để nạn nhân nhanh chóng chuyển tiền."
      ],
      prevention: [
        "Tuyệt đối không nhận các đơn hàng lạ mà bản thân không hề đặt trên ứng dụng sàn thương mại điện tử.",
        "Kiểm tra mã vận đơn trùng khớp hiển thị trong mục lịch sử mua sắm của bạn.",
        "Gọi trực tiếp cho người nhà để xác nhận nếu có người nhận hộ, hoặc yêu cầu người giao hàng mang tới lại vào thời điểm khác."
      ],
      severity: "Warning",
      icon: "local_shipping"
    },
    {
      id: "online_task",
      title: "Lừa đảo làm nhiệm vụ trực tuyến nhận hoa hồng",
      shortDesc: "Tuyển cộng tác viên chốt đơn hàng ảo, thích video, đánh giá sản phẩm hứa hẹn thu nhập cao.",
      desc: "Đối tượng tiếp cận nạn nhân qua các mạng xã hội như Zalo, Telegram, hoặc các hội nhóm tìm việc. Ban đầu chúng giao các nhiệm vụ nhỏ dễ dàng và gửi tiền hoa hồng thật từ mười nghìn đến năm mươi nghìn đồng để lấy lòng tin. Tiếp theo, dụ dỗ nạn nhân nạp tiền với đơn hàng có giá trị cao hơn, giả vờ lỗi hệ thống không cho rút gốc, yêu cầu đóng thêm phí bảo lãnh rồi chiếm đoạt toàn bộ.",
      tactics: [
        "Dụ dỗ bằng các nhiệm vụ đơn giản trả tiền hoa hồng cực kỳ nhanh ngay trên thiết bị di động.",
        "Tạo các nhóm trò chuyện có các tài khoản ảo giả vờ gửi ảnh giao dịch thành công để kích thích lòng tham.",
        "Đưa ra các điều khoản phạt, tuyên bố có lỗi tài khoản để ép nạn nhân liên tục nạp thêm tiền cứu vốn."
      ],
      prevention: [
        "Từ bỏ ngay tư duy tìm kiếm các công việc nhẹ nhàng có mức lương hay hoa hồng cao một cách dễ dàng.",
        "Không bao giờ chuyển tiền ký quỹ hoặc nạp tiền vào các ví điện tử lạ để nhận đơn hàng ảo.",
        "Cảnh giác tuyệt đối với các lời mời tham gia nhóm Telegram kín kiếm tiền trực tuyến."
      ],
      severity: "Critical",
      icon: "work_history"
    },
    {
      id: "qr_swap",
      title: "Chiêu trò dán đè mã QR thanh toán",
      shortDesc: "Trộm dán đè mã QR cá nhân của kẻ gian lên trên mã QR nhận tiền tại các cửa hàng.",
      desc: "Lợi dụng giờ cao điểm đông khách hoặc lúc chủ cửa hàng bận rộn mất cảnh giác, đối tượng cơ hội dán đè mã QR của họ lên trên bảng mã QR nhận tiền của quầy thu ngân. Số tiền khách quét chuyển khoản sau đó sẽ trực tiếp chảy vào túi kẻ lừa đảo thay vì doanh thu cửa hàng.",
      tactics: [
        "In sẵn decal mã QR kích thước tương tự rồi lén dán đè trong tích tắc.",
        "Nhắm vào các quầy hàng tự do, quán nước vỉa hè không có camera giám sát liên tục.",
        "Mạo danh nhân viên tiếp thị ngân hàng đến hỗ trợ dán bảng QR mới."
      ],
      prevention: [
        "Chủ cửa hàng cần thường xuyên kiểm tra trực tiếp mã QR đặt tại bàn giao dịch.",
        "Luôn bật thông báo biến động số dư bằng âm thanh thông tin để nghe xác nhận người nhận.",
        "Khuyên người dùng kiểm tra thật kỹ tên chủ tài khoản thụ hưởng hiển thị trùng khớp với tên cửa hàng trước khi bấm Xác nhận giao dịch."
      ],
      severity: "High",
      icon: "qr_code_2"
    }
  ];

  return (
    <div className="bg-surface-variant min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner Section */}
        <div id="warnings-hero" className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
            <span className="material-symbols-outlined text-[240px]">shield_alert</span>
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4 border border-amber-500/30">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              CÁC THỦ ĐOẠN KHẨN CẤP
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Cảnh báo thủ đoạn lừa đảo mới nhất
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mb-6 leading-relaxed">
              Hãy chủ động trang bị kiến thức để bảo vệ ví tiền và thông tin cá nhân của bạn. Không chuyển tiền khi chưa xác minh, không tải các ứng dụng lạ theo yêu cầu, luôn kiểm tra tên tài khoản thụ hưởng trước khi quét mã phản hồi nhanh (mã QR).
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/report" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105">
                <span className="material-symbols-outlined font-bold text-sm">gavel</span>
                TỐ CÁO HÀNH VI LỪA ĐẢO
              </Link>
              <a href="#quick-risk-assesser" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">psychology</span>
                ĐO MỨC ĐỘ RỦI RO
              </a>
            </div>
          </div>
        </div>

        {/* Section 1: Guide / Checklist */}
        <section id="safety-checklist" className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-200 pb-4">
            <div>
              <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">QUY TRÌNH AN TOÀN TRỰC TUYẾN</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Cẩm nang giao dịch an toàn</h2>
            </div>
            <p className="text-on-surface-variant text-sm max-w-md mt-2 md:mt-0">
              Chỉ với 4 bước đơn giản, bạn có thể tự mình giảm thiểu hơn 99% các nguy cơ giao dịch gian lận trên mạng xã hội hàng ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((item, index) => (
              <div 
                key={index}
                className="bg-surface rounded-2xl p-6 border border-outline-variant hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary-container text-primary font-black text-lg bg-emerald-50 px-3 py-1 rounded-lg">
                      {item.step}
                    </span>
                    <span className="material-symbols-outlined text-primary text-2xl bg-emerald-50/50 p-2 rounded-xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-on-surface text-base mb-2">{item.title}</h3>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Scam Grid */}
        <section id="popular-scam-tactics" className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-200 pb-4">
            <div>
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">TẤT CẢ PHƯƠNG THỨC LỪA ĐẢO</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Các thủ đoạn phổ biến nhất</h2>
            </div>
            <p className="text-on-surface-variant text-sm max-w-md mt-2 md:mt-0">
              Nhấn trực tiếp vào từng thẻ thủ đoạn để tra cứu chi tiết kịch bản tiếp cận, mánh khóe tâm lý và quy trình phòng vệ chuẩn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scamCards.map((card) => {
              const isSelected = selectedCard === card.id;
              return (
                <div 
                  key={card.id}
                  onClick={() => setSelectedCard(isSelected ? null : card.id)}
                  className={`bg-surface rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden p-6 flex flex-col justify-between hover:scale-[1.02] ${
                    isSelected 
                      ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xl" 
                      : "border-outline-variant hover:border-amber-500/40 hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                        <span className="material-symbols-outlined text-2xl block">{card.icon}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        card.severity === "Critical" 
                          ? "bg-red-50 text-red-600 border border-red-200" 
                          : card.severity === "High"
                            ? "bg-orange-50 text-orange-600 border border-orange-200"
                            : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}>
                        {card.severity === "Critical" ? "Rất nghiêm trọng" : card.severity === "High" ? "Nghiêm trọng" : "Cảnh báo"}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-on-surface mb-2">{card.title}</h3>
                    <p className="text-on-surface-variant text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                      {card.shortDesc}
                    </p>

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-slate-100 animate-slide-down space-y-4 text-xs sm:text-sm text-on-surface">
                        <div>
                          <h4 className="font-extrabold text-red-600 flex items-center gap-1 mb-1.5">
                            <span className="material-symbols-outlined text-sm">history_edu</span>
                            Kịch bản chiêu trò:
                          </h4>
                          <p className="text-on-surface-variant leading-relaxed mb-2 bg-slate-55 p-3 rounded-xl border border-slate-50">{card.desc}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-extrabold text-amber-700 flex items-center gap-1 mb-1.5">
                            <span className="material-symbols-outlined text-sm">campaign</span>
                            Cách thức tiếp cận tinh vi:
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-on-surface-variant pl-1">
                            {card.tactics.map((tac, idx) => (
                              <li key={idx} className="leading-relaxed">{tac}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-emerald-700 flex items-center gap-1 mb-1.5">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            Phương án phòng ngừa triệt để:
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-on-surface-variant pl-1">
                            {card.prevention.map((pre, idx) => (
                              <li key={idx} className="leading-relaxed">{pre}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs font-bold text-primary">
                    <span className="flex items-center gap-1">
                      {isSelected ? "Thu gọn thông tin" : "Xem chi tiết hướng dẫn"}
                      <span className="material-symbols-outlined text-sm">
                        {isSelected ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                      </span>
                    </span>
                    <span className="text-on-surface-variant/50 font-normal">Độ tin cậy: 100%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Interactive Risk Calculator */}
        <section id="quick-risk-assesser" className="bg-surface rounded-3xl border border-outline-variant p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-1">CÔNG CỤ PHÒNG THỦ</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-4">Tự đánh giá mức độ rủi ro</h2>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                Bạn đang chuẩn bị chốt một đơn hàng hoặc giao dịch trực tuyến với người lạ và thấy băn khoăn? 
                Hãy chọn các dấu hiệu nguy cơ bên cạnh để hệ thống CHECK ZONE chấm điểm độ tin cậy và đo lường cảnh báo bảo mật tức thì.
              </p>
              
              {/* Risk Indicator Panel */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${riskLevel.color}`}>
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-widest opacity-85 mb-1">MỨC ĐỘ NGUY HIỂM ƯỚC TÍNH</div>
                  <div className="text-2xl font-black mb-3">{riskLevel.label}</div>
                  <div className="text-4xl font-extrabold mb-4">{riskScore}% <span className="text-base font-normal tracking-normal text-on-surface-variant/90">chỉ số nguy cơ</span></div>
                </div>
                
                <p className="text-xs text-on-surface leading-normal opacity-90">
                  {riskScore === 0 && "Tuyệt vời! Giao dịch có vẻ an toàn. Vui lòng vẫn giữ tinh thần cảnh giác để tránh các biến số mới phát sinh."}
                  {riskScore > 0 && riskScore <= 25 && "Cảnh báo mức độ thấp. Hãy hỏi thêm những câu hỏi trực diện để chắc chắn đối chiếu thông tin cá nhân."}
                  {riskScore > 25 && riskScore <= 60 && "Mức độ rủi ro tương đối cao. Khuyến khích sử dụng giao dịch trung gian có bảo lãnh hoặc yêu cầu đồng kiểm hàng hóa."}
                  {riskScore > 60 && "CỰC KỲ NGUY HIỂM! Giao dịch mang đầy đủ đặc trưng của một vụ lừa đảo chiếm đoạt tài sản điển hình. TUYỆT ĐỐI KHÔNG gửi tiền trước."}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <h3 className="text-base sm:text-lg font-extrabold text-on-surface">Đánh dấu mọi dấu hiệu bạn nhìn thấy ở đối phương:</h3>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4.5 h-4.5"
                    checked={riskAnswers.noVerify}
                    onChange={(e) => setRiskAnswers({...riskAnswers, noVerify: e.target.checked})}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-on-surface block">Không thể tìm kiếm hoặc thông tin trống trơn</span>
                    <span className="text-xs text-on-surface-variant block mt-1">Hồ sơ cá nhân Zalo/Facebook mới lập, không có tương tác thật, không có tên thật rõ ràng hoặc không có lịch sử mua bán có thể kiểm chứng.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4.5 h-4.5"
                    checked={riskAnswers.prepay}
                    onChange={(e) => setRiskAnswers({...riskAnswers, prepay: e.target.checked})}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-on-surface block">Yêu cầu chuyển một phần hoặc toàn bộ số tiền trước</span>
                    <span className="text-xs text-on-surface-variant block mt-1">Nằng nặc yêu cầu chuyển khoản cọc, thanh toán trước phí vận chuyển, hoặc nạp thẻ game, thanh toán đơn hàng ảo để kích hoạt.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4.5 h-4.5"
                    checked={riskAnswers.tooCheap}
                    onChange={(e) => setRiskAnswers({...riskAnswers, tooCheap: e.target.checked})}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-on-surface block">Giá cả/Lợi nhuận rẻ đến ngỡ ngàng (khó tin)</span>
                    <span className="text-xs text-on-surface-variant block mt-1">Sản phẩm có giá trị cao nhưng bán chỉ bằng 20-30% ngoài siêu thị, hoặc dán mác sản phẩm xách tay lậu thanh lý khẩn cấp.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4.5 h-4.5"
                    checked={riskAnswers.rushed}
                    onChange={(e) => setRiskAnswers({...riskAnswers, rushed: e.target.checked})}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-on-surface block">Ép giao dịch nhanh, đe dọa hết hàng hối thúc</span>
                    <span className="text-xs text-on-surface-variant block mt-1">Cố tình lôi kéo tâm lý sợ bỏ lỡ cơ hội, giục dã chuyển khoản nhanh kẻo sếp hủy đơn, không cho người bán hay người khác can thiệp tư vấn.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4.5 h-4.5"
                    checked={riskAnswers.weirdLink}
                    onChange={(e) => setRiskAnswers({...riskAnswers, weirdLink: e.target.checked})}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-on-surface block">Gửi đường link đăng nhập lạ mắt</span>
                    <span className="text-xs text-on-surface-variant block mt-1">Yêu cầu truy cập liên kết viết sai lỗi chính tả để nhận tiền hoàn, đăng nhập ví, hoặc tải ứng dụng đuôi tệp APK không rõ nguồn gốc.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4.5 h-4.5"
                    checked={riskAnswers.refuseMiddleman}
                    onChange={(e) => setRiskAnswers({...riskAnswers, refuseMiddleman: e.target.checked})}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-on-surface block">Từ chối giao dịch qua trung gian</span>
                    <span className="text-xs text-on-surface-variant block mt-1">Viện lý do bận, phí trung gian cao, hoặc tài khoản lỗi để ép bạn phải chuyển khoản trực tiếp cho họ.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4.5 h-4.5"
                    checked={riskAnswers.bankMismatch}
                    onChange={(e) => setRiskAnswers({...riskAnswers, bankMismatch: e.target.checked})}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-on-surface block">Tên tài khoản ngân hàng không khớp</span>
                    <span className="text-xs text-on-surface-variant block mt-1">Tên người nhận tiền trên số tài khoản không trùng khớp với tên Facebook/Zalo hoặc tên cửa hàng.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4.5 h-4.5"
                    checked={riskAnswers.editedBill}
                    onChange={(e) => setRiskAnswers({...riskAnswers, editedBill: e.target.checked})}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-on-surface block">Gửi hóa đơn (bill) chuyển tiền mờ, có dấu hiệu cắt ghép</span>
                    <span className="text-xs text-on-surface-variant block mt-1">Gửi ảnh chụp màn hình báo đã chuyển khoản thành công nhưng tài khoản của bạn chưa nhận được tiền, hối thúc bạn giao hàng.</span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setRiskAnswers({ noVerify: false, prepay: false, tooCheap: false, rushed: false, weirdLink: false, refuseMiddleman: false, bankMismatch: false, editedBill: false })}
                  className="px-6 py-2 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 active:scale-95 transition-all text-xs sm:text-sm rounded-xl cursor-pointer"
                >
                  XÓA LỰA CHỌN
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
