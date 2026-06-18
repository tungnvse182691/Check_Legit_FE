import React, { createContext, useContext, useState, useEffect } from "react";

export interface ScamReport {
  id: string; // e.g. "SCM-1001" or similar
  name: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  desc: string;
  type: string;
  amount: number;
  time: string;
  date: string;
  status: "Đang chờ duyệt" | "Đã phê duyệt" | "Đã bác bỏ";
  victim: string;
  tags: string[];
  facebook?: string;
  images: string[];
}

export interface LegitProfile {
  id: number;
  name: string;
  role: string;
  score: number;
  img: string;
  desc: string;
  phone: string;
  telegram: string;
  insurance: number;
  successTrans: number;
  joinDate: string;
  businessType: string;
}

interface AppContextType {
  scams: ScamReport[];
  legitList: LegitProfile[];
  addScamReport: (report: Omit<ScamReport, "id" | "status" | "time" | "date" | "tags">) => void;
  addLegitProfile: (profile: Omit<LegitProfile, "id" | "score" | "img" | "successTrans" | "joinDate">) => void;
  approveScamReport: (id: string) => void;
  rejectScamReport: (id: string) => void;
  deleteScamReport: (id: string) => void;
  deleteLegitProfile: (id: string | number) => void;
}

const defaultScams: ScamReport[] = [
  {
    id: "SCM-1001",
    phone: "0987654321",
    name: "NGUYEN VAN A",
    bankName: "Vietcombank",
    accountNumber: "1234567890123",
    desc: "Đối tượng sử dụng chiêu trò giả mạo nhân viên sàn TMĐT Tiki để yêu cầu thanh toán các đơn hàng ảo nhằm nhận hoa hồng. Sau khi người bị hại chuyển tiền lần 3 với số tiền lớn, đối tượng lập tức khóa tài khoản và chặn mọi liên lạc. Tổng thiệt hại ước tính hơn 15.000.000 VNĐ.",
    type: "Mua bán online",
    amount: 15000000,
    time: "2 phút trước",
    date: "22/05/2026",
    status: "Đã phê duyệt",
    victim: "Ẩn danh",
    tags: ["Mạo danh", "Chiếm đoạt"],
    facebook: "https://facebook.com/kely_lua_dao_tiki",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBC6Up1uOSp2yrPZHP6J-1lQ9tdr8cSQbKSqxwbYJ5v2ygWmC3fu8PpPs51Z3CwJHrBeBwG_qDk2RS3FEUomZfjTSBGDF76QvgGHYtFyo46jL5f7HvU31tRE38BxGLq3mkw3XA79yehqEQVQe3lq_4ZFZNDuoyrCsuEiqRAO-q5xKV4X58rBc6TBdM8MG_L_5-HNUiTnGMrvbhuj1HL-D7aWiH79BSTR2o27touIWOSFydXjH68_IyW7DEDPIe3aRjmg5MwQ5KXflvF"]
  },
  {
    id: "SCM-1002",
    phone: "0912345678",
    name: "HOANG TRUNG KIEN",
    bankName: "Techcombank",
    accountNumber: "1029384756",
    desc: "Bán hàng không gửi mặt hàng điện tử, chặn liên lạc sau khi nhận cọc 1.200.000 VND của nạn nhân. Lấy lý do phí ship cần thanh toán trước.",
    type: "Mua bán online",
    amount: 1200000,
    time: "15 phút trước",
    date: "22/05/2026",
    status: "Đã phê duyệt",
    victim: "crypto_whale_7",
    tags: ["Lừa tiền cọc"],
    facebook: "https://facebook.com/kien_guitar_shop",
    images: []
  },
  {
    id: "SCM-1003",
    phone: "0909090909",
    name: "TRAN THU HUONG",
    bankName: "MB Bank",
    accountNumber: "999888777",
    desc: "Giả mạo tài khoản Facebook người thân (hack account hoặc lập nick clone giống hệt) để nhắn tin vay tiền gấp.",
    type: "Giả danh cơ quan nhà nước",
    amount: 20000000,
    time: "1 giờ trước",
    date: "22/05/2026",
    status: "Đã phê duyệt",
    victim: "user_9934@gmail.com",
    tags: ["Hack Account", "Vay Tiền Giả Mại"],
    facebook: "",
    images: []
  },
  {
    id: "SCM-1004",
    phone: "0332112333",
    name: "LE HOANG CANH",
    bankName: "Agribank",
    accountNumber: "555666777",
    desc: "Kêu gọi đầu tư chứng khoán lợi nhuận cao 30% một ngày, dụ dỗ nạp tiền rồi khóa tài khoản sàn ảo của nạn nhân không cho rút gốc.",
    type: "Đầu tư tài chính",
    amount: 150000000,
    time: "3 giờ trước",
    date: "21/05/2026",
    status: "Đã phê duyệt",
    victim: "an_danh_12",
    tags: ["Đầu tư ảo"],
    facebook: "",
    images: []
  },
  {
    id: "SCM-8821",
    phone: "0901234567",
    name: "DISCORD ADMIN SCAM",
    bankName: "Vietcombank",
    accountNumber: "333888999",
    desc: "Đối tượng tiếp cận nạn nhân qua tin nhắn trực tiếp trên Discord tự xưng là 'Trưởng bộ phận hỗ trợ Steam/Discord'. Cung cấp đường liên kết lừa đảo giả mạo cổng đăng nhập để chiếm đoạt tài khoản.",
    type: "Tuyển cộng tác viên",
    amount: 2000000,
    time: "24 thg 5, 2026",
    date: "20/05/2026",
    status: "Đang chờ duyệt",
    victim: "user_9934@gmail.com",
    tags: ["Mạo danh Discord", "Phishing"],
    facebook: "",
    images: []
  },
  {
    id: "SCM-8820",
    phone: "0332112345",
    name: "AD GIAO DICH TRUNG GIAN",
    bankName: "Techcombank",
    accountNumber: "999888777",
    desc: "Giao dịch trung gian tài sản số nhưng giả mạo admin uy tín của các nhóm MMO lớn để nhận tiền ký quỹ rồi chặn liên lạc.",
    type: "Mua bán online",
    amount: 20000000,
    time: "23 thg 5, 2026",
    date: "19/05/2026",
    status: "Đã phê duyệt",
    victim: "crypto_whale_7",
    tags: ["Giao dịch trung gian"],
    facebook: "",
    images: []
  }
];

const defaultLegit: LegitProfile[] = [
  {
    id: 1,
    name: "Marcus V. Solutions",
    role: "Tư vấn công nghệ đã xác minh",
    score: 98,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDluLHUNlfxUOmZOzbBoJo7Oyb5uWJpDyKquxGl1PnAEduMVk-2AbaL6TbWqR7dX4HKFzrzIqYmJCG9gMKFq_LNFqssi6IceM8EAoVgAjiRveS6rt7TM_RUyBrw2-dGbtQAxCVzwtjcI5akGVX2y6LKb5lLKYV-cUQiyo6AfwbJctrdzx3lAhoWslXj8sI6M3244mfl6K0xluvhywChzAvPcse3rW19tQlog443AzBkWX1gCjEVrOwchMTQPQJCpgptTminEKvxbgw",
    desc: "Chuyên về kiến trúc đám mây và cơ sở hạ tầng mạng an toàn cho các công ty khởi nghiệp Fintech đang mở rộng quy mô.",
    phone: "0918 888 999",
    telegram: "@marcus_solutions",
    insurance: 150000000,
    successTrans: 430,
    joinDate: "01/2022",
    businessType: "Công nghệ & Điện tử"
  },
  {
    id: 2,
    name: "Lumina Design Hub",
    role: "Nhà sáng tạo nội dung số đã xác minh",
    score: 95,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVLAd-Q5kZejRXIO9xlXfKY3FfsExCnK2PkqQzcKtBeHTX3uGBDcGkx4dY-If6qRNrw5jHWhsB7JKwC3JLxlh01PNdnoea4YFej01_PFmM8Qi_OoJFS6jJhjpWojN9_bA-_hJ6EfBWyFNTU-096KDlA6faReLULW6LOl5ZMpp3RsJEwgzJECrfb8dKm7SL5JjPp2SXO04-B-DZSYRlxdc-WWqQuMeJGwMBxCcCnGDQiHKBiPVNGMJQMwyN4J98HNj8P3h_y4QoqBPT",
    desc: "Thiết kế UI/UX độ trung thực cao và phát triển bộ nhận diện thương hiệu cho các nhãn hàng thời trang cao cấp của Châu Âu.",
    phone: "0303 123 456",
    telegram: "@luminadesign",
    insurance: 25000000,
    successTrans: 180,
    joinDate: "12/2023",
    businessType: "Bán lẻ phổ thông"
  },
  {
    id: 3,
    name: "Swift Logistics",
    role: "Chuỗi cung ứng đã xác minh",
    score: 99,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOBdlSOs8r4VigmvzhXCjNxhv3_ND-DJPGTX9mMSax24C2Lvqx_P31zUNg2SrJcKCznff-TR_n7BjU7XAlF6R_qcaDgnicWDvLJW_0Rq28iqSPD73eYQKMWbMSAkWiIdhW5rPTrFy--FBwiDqvGLbxMPTaEbBJn6QK7m6SybmsTG1i_7RYcvTOrdd3j4xQBqIJGIwY5DWydNbPoBGx15CkcQAQrcT7Gr6aZpCNROAMGDK_ic33jhObWq-QjqOKf-6oN7HgwEe8VtOC",
    desc: "Đối tác vận chuyển và hoàn tất đơn hàng toàn cầu với mức độ minh bạch của hệ thống theo dõi được xác minh 100% tại 14 quốc gia.",
    phone: "0977 111 333",
    telegram: "@swift_logistics",
    insurance: 500000000,
    successTrans: 3500,
    joinDate: "07/2017",
    businessType: "Bán lẻ phổ thông"
  },
  {
    id: 4,
    name: "Zenith Lab",
    role: "Đối tác nghiên cứu & phát triển đã xác minh",
    score: 97,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXOk8oXkVKcKiRyFEMm0p-OaUdoeSNPKFH64PJSyOzzWkJsun03i0Iiratk1b7UAHGYyKfRRNhFcFJQCurGIZ-ghmctkIX2U6H7o4TdxG4X2QX-0N2IiWLHp-1pKDmXx7cxoNk52d4on5uKwcSUdDZEcSE1mrom0NW3HxYSNyoP3TYbWlbAvqlZ1jDXBbgZOFHmQXpe0gSQK9Q40v16bwXpOBAj1MsS9QKHpWF4xQfwxtGZSwWVdvpjvL2x7OpIz0SO_IheoXIMpcK",
    desc: "Cung cấp thử nghiệm phòng thí nghiệm được chứng nhận và chế tạo mẫu phần cứng tuân thủ đầy đủ các quy định và tiêu chuẩn kỹ thuật.",
    phone: "0988 555 444",
    telegram: "@zenith_lab",
    insurance: 120000000,
    successTrans: 600,
    joinDate: "04/2019",
    businessType: "Công nghệ & Điện tử"
  },
  {
    id: 5,
    name: "Capital Trust",
    role: "Dịch vụ tài chính đã xác minh",
    score: 100,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYSUHuO_h1_m97LWIOxtK8rwXfBpx2rxqiV8qcp_Lz3QzP97tyTPwAWS-Nhd7cnlzT1hGToFuwgogrZ68W_3EntVl4oFIVACMokgRpc_P5RdsWs-DYT5pK_Kx0pi-DgQgWdl3qsbRbE1IFaKSMXIatftpA8ezKYsIcitdc37tkWhcrWDy42WdEZTIg75WVGdWCKgGstnvKLI69GqFL1S5yK1Sz55EnCvu687KYeMvfSAUDmd7QaYqeqD1MNpQm-rt_l2MfweSVKK9I",
    desc: "Quản lý tài sản và dịch vụ ký quỹ an toàn với các giao thức xác minh kỹ thuật số đa chữ ký bảo mật.",
    phone: "0999 999 999",
    telegram: "@capital_trust",
    insurance: 500000000,
    successTrans: 5000,
    joinDate: "11/2015",
    businessType: "Dịch vụ tài chính"
  },
  {
    id: 6,
    name: "Nguyen Tien Dung",
    role: "Chuyên iPhone, iPad xách tay (Hà Nội)",
    score: 98,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHR_jiASUfAzn2xN63jA33I8WnCfRX-CA3ftcLMdt7MtMDA2uC-Q5KuFcJGYMqXjJUf-sWulYlH44VHRl6PYN1in9S5_4XsqduLMK-MXn8Z9THT_lRe2Bk1QKcvSiv6vXdigMoPPI37za4UbmlQWjwa1bLqi524oT-KnjDxMn4ESEFoi-t879hKqz-0V05MUYS1cxRL_Gd-Mp_Mco3l7VUexllB0x83yKhEsSmF16RomGIR2sVLqT4DBjx5-GeqfC6rkMXjokG3OAN",
    desc: "Chuyên cung cấp các sản phẩm Apple chính hãng, xách tay nguyên bản với chính sách bảo hành uy tín tại Hà Nội.",
    phone: "0981 111 222",
    telegram: "@tiendung_apple",
    insurance: 100000000,
    successTrans: 1200,
    joinDate: "10/2020",
    businessType: "Công nghệ & Điện tử"
  },
  {
    id: 7,
    name: "Le Thi Hong",
    role: "Order hàng Mỹ, Nhật, Úc",
    score: 95,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_k2zbxjHzNrxNRAJB4k0KNtnP0J8l5nvpUCOhISCfF1Gh8pjPfJ2H_bII3vxVcnunt3qx-jxmSsISHqTYPj5AYlfylvVD5K8sBXFdnJnf6GLpflNRfUZvxN0tlVBCHugYZ8FqOwcVyA5s1MTx43m2vVf5HL4TBGGfLwvSBo8-bKtkq6MKUUBdIFXVGVcTL-ixoHmxyoF6kLolyfXFq6Qvr1jFOyh5QTov9KriECWO5BgVz9wWkGMSN8pGB8SEKAzRc7RaAUHVnJkv",
    desc: "Dịch vụ mua hộ hàng, order hàng từ Mỹ, Nhật Bản, Úc uy tín phí mua hộ cực thấp, thời gian ship nhanh chóng.",
    phone: "0905 555 666",
    telegram: "@hongorder_global",
    insurance: 50000000,
    successTrans: 850,
    joinDate: "03/2021",
    businessType: "Bán lẻ phổ thông"
  },
  {
    id: 8,
    name: "Pham Quoc Bao",
    role: "Linh kiện máy tính & Laptop Gaming",
    score: 99,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuABgImyCMEs4zpHXpkdd0BOQhX0trdWGROk7-m1JqFcON3eb-sSEP6_IYbtKS1dlbWomU2L6AX3l1PrsjRKJH4AD9TjLwAls1Td3iYvJWW1gdhFEsACx45LNKdFAPFNYPRb9zE_a21JohBQnLbPS4xcbf3C8IVN1EYdxUrIDqhJFjVeIBpO8fevsky7LLmTFykdwx0quTClq1G4-VlVI9S6j7apqbhNxmPoQGHq6foVFGxB2qv8xdAelfUI1YVXnm2dM9muf9F-RjFT",
    desc: "Cửa hàng linh kiện máy tính uy tín, Laptop gaming hàng xách tay chất lượng cao cam kết bảo hành dài hạn.",
    phone: "0906 777 888",
    telegram: "@baocomputer_gaming",
    insurance: 200000000,
    successTrans: 2400,
    joinDate: "05/2019",
    businessType: "Công nghệ & Điện tử"
  },
  {
    id: 9,
    name: "Tech Hub Việt Nam",
    role: "Nhà cung cấp linh kiện CNTT trực tuyến",
    score: 98,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVFgKhyJSGktOxiu7RU9rjpDn_2wbvyFBYQpssTW6gbR-_9CEhSsBWr1N7T8Rd2q3sD04W4Khje4o7aM0j4ul7yHj2TfWxnlsK4zcBuUWdGthDp33GxQmT7H12JyGKeJrOgWpDeT5aqfRuRlcDJD1QXZbrfz0rpojfdD_B90L8Ppx7LfEkH-lSkAzmuah1LWz01IHvwBFqfgCYCnb8PRZsDTx9T72Dh9z-E5djP9_j9rY5oHJTWv-c0YuDRamCAiVVThrY5etHpM2U",
    desc: "Nhà cung cấp uy tín hàng đầu về thiết bị phần cứng công nghệ chính hãng và các giải pháp mạng chuyên nghiệp cấp doanh nghiệp từ năm 2018. Chúng tôi chuyên sâu về các linh kiện máy tính hiệu năng cao và thiết bị doanh nghiệp đã qua sử dụng được kiểm định chất lượng chặt chẽ.",
    phone: "0901 234 567",
    telegram: "@techhub_official",
    insurance: 500000000,
    successTrans: 1240,
    joinDate: "05/2018",
    businessType: "Công nghệ & Điện tử"
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scams, setScams] = useState<ScamReport[]>(() => {
    const saved = localStorage.getItem("check_legit_scams");
    return saved ? JSON.parse(saved) : defaultScams;
  });

  const [legitList, setLegitList] = useState<LegitProfile[]>(() => {
    const saved = localStorage.getItem("check_legit_legit");
    return saved ? JSON.parse(saved) : defaultLegit;
  });

  useEffect(() => {
    localStorage.setItem("check_legit_scams", JSON.stringify(scams));
  }, [scams]);

  useEffect(() => {
    localStorage.setItem("check_legit_legit", JSON.stringify(legitList));
  }, [legitList]);

  const addScamReport = (report: Omit<ScamReport, "id" | "status" | "time" | "date" | "tags">) => {
    const newId = `SCM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRep: ScamReport = {
      ...report,
      id: newId,
      status: "Đang chờ duyệt",
      time: "Vừa xong",
      date: new Date().toLocaleDateString("vi-VN"),
      tags: [report.type || "Chưa phân loại"]
    };
    setScams((prev) => [newRep, ...prev]);
  };

  const addLegitProfile = (profile: Omit<LegitProfile, "id" | "score" | "img" | "successTrans" | "joinDate">) => {
    const newId = legitList.length + 1;
    const newLegit: LegitProfile = {
      ...profile,
      id: newId,
      score: 95 + Math.floor(Math.random() * 6), // 95 to 100
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80", // placeholder
      successTrans: 1,
      joinDate: new Date().toLocaleDateString("vi-VN").substring(3), // MM/YYYY
    };
    setLegitList((prev) => [newLegit, ...prev]);
  };

  const approveScamReport = (id: string) => {
    setScams((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Đã phê duyệt" as const } : s))
    );
  };

  const rejectScamReport = (id: string) => {
    setScams((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Đã bác bỏ" as const } : s))
    );
  };

  const deleteScamReport = (id: string) => {
    setScams((prev) => prev.filter((s) => s.id !== id));
  };

  const deleteLegitProfile = (id: string | number) => {
    setLegitList((prev) => prev.filter((l) => String(l.id) !== String(id)));
  };

  return (
    <AppContext.Provider
      value={{
        scams,
        legitList,
        addScamReport,
        addLegitProfile,
        approveScamReport,
        rejectScamReport,
        deleteScamReport,
        deleteLegitProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
