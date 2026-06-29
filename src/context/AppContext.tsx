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
  category: "Lừa đảo tài chính" | "Cảnh báo hành vi";
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
  tier?: string; // dynamic Tier badge from backend
}

interface AppContextType {
  scams: ScamReport[];
  legitList: LegitProfile[];
  token: string | null;
  isAuthenticated: boolean;
  addScamReport: (report: Omit<ScamReport, "id" | "status" | "time" | "date" | "tags"> & { turnstileToken: string }) => void;
  addLegitProfile: (profile: Omit<LegitProfile, "id" | "score" | "img" | "successTrans" | "joinDate">) => void;
  approveScamReport: (id: string) => void;
  rejectScamReport: (id: string) => void;
  deleteScamReport: (id: string) => void;
  deleteLegitProfile: (id: string | number) => void;
  updateScamReport: (id: string, updatedReport: Partial<ScamReport>) => Promise<boolean>;
  login: (token: string) => void;
  logout: () => void;
}

export const API_BASE_URL = "http://localhost:5174/api";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scams, setScams] = useState<ScamReport[]>([]);
  const [legitList, setLegitList] = useState<LegitProfile[]>([]);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const parseUtcDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    if (typeof dateStr === "string" && !dateStr.endsWith("Z") && !dateStr.includes("+") && !dateStr.includes("-", 10)) {
      return new Date(dateStr + "Z");
    }
    return new Date(dateStr);
  };

  const mapScamDto = (dto: any, category: "Lừa đảo tài chính" | "Cảnh báo hành vi"): ScamReport => {
    const parsedDate = parseUtcDate(dto.createdAt);
    return {
      id: dto.id,
      name: dto.name,
      phone: dto.phone || "",
      bankName: dto.bankName,
      accountNumber: dto.accountNumber,
      desc: dto.desc,
      type: dto.type,
      amount: dto.amount,
      time: parsedDate.toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour12: false }),
      date: parsedDate.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
      status: dto.status,
      victim: dto.victim,
      tags: dto.tags || [],
      facebook: dto.facebook || "",
      images: dto.images || [],
      category: category
    };
  };

  const mapLegitDto = (dto: any): LegitProfile => {
    return {
      id: dto.id,
      name: dto.name,
      role: dto.role,
      score: dto.score,
      img: dto.img,
      desc: dto.desc,
      phone: dto.phone,
      telegram: dto.telegram,
      insurance: dto.insurance,
      successTrans: dto.successTrans,
      joinDate: dto.joinDate,
      businessType: dto.businessType,
      tier: dto.tier
    };
  };

  const fetchAllData = async () => {
    try {
      const fetchScams = async () => {
        try {
          const url = token ? `${API_BASE_URL}/admin/scams` : `${API_BASE_URL}/public/scams`;
          const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
          const res = await fetch(url, { headers });
          if (res.ok) {
            const data = await res.json();
            return data.map((s: any) => mapScamDto(s, s.category === 1 ? "Cảnh báo hành vi" : "Lừa đảo tài chính"));
          } else {
            console.error(`Failed to fetch scams: ${res.status} ${res.statusText}`);
            if (res.status === 500) {
              alert("Lỗi máy chủ (500) khi tải danh sách lừa đảo. Vui lòng thử lại sau.");
            }
          }
        } catch (e) {
          console.error("Error fetching scams:", e);
        }
        return [];
      };

      const fetchWarnings = async () => {
        if (token) return []; // Admin scams endpoint includes both financial and warning reports
        try {
          const res = await fetch(`${API_BASE_URL}/public/warnings`);
          if (res.ok) {
            const data = await res.json();
            return data.map((w: any) => mapScamDto(w, "Cảnh báo hành vi"));
          } else {
            console.error(`Failed to fetch warnings: ${res.status} ${res.statusText}`);
            if (res.status === 500) {
              alert("Lỗi máy chủ (500) khi tải danh sách cảnh báo. Vui lòng thử lại sau.");
            }
          }
        } catch (e) {
          console.error("Error fetching warnings:", e);
        }
        return [];
      };

      const fetchLegit = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/public/legit`);
          if (res.ok) {
            const data = await res.json();
            return data.map(mapLegitDto);
          } else {
            console.error(`Failed to fetch legit list: ${res.status} ${res.statusText}`);
            if (res.status === 500) {
              alert("Lỗi máy chủ (500) khi tải danh sách thương nhân uy tín. Vui lòng thử lại sau.");
            }
          }
        } catch (e) {
          console.error("Error fetching legit:", e);
        }
        return [];
      };

      const [mappedScams, mappedWarnings, mappedLegit] = await Promise.all([
        fetchScams(),
        fetchWarnings(),
        fetchLegit()
      ]);

      setScams([...mappedScams, ...mappedWarnings]);
      setLegitList(mappedLegit);
    } catch (error) {
      console.error("Error in fetchAllData:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const addScamReport = async (report: Omit<ScamReport, "id" | "status" | "time" | "date" | "tags"> & { turnstileToken: string }) => {
    const categoryEnum = report.category === "Cảnh báo hành vi" ? 1 : 0;
    const payload = {
      name: report.name,
      phone: report.phone || "",
      bankName: report.bankName,
      accountNumber: report.accountNumber,
      desc: report.desc,
      type: report.type || (report.category === "Cảnh báo hành vi" ? "Cảnh báo hành vi" : "Lừa đảo tài chính"),
      amount: report.amount || 0,
      victim: report.victim || "Ẩn danh",
      tags: [report.type || "Chưa phân loại"],
      facebook: report.facebook || "",
      images: report.images || [],
      category: categoryEnum,
      turnstileToken: report.turnstileToken
    };

    try {
      const response = await fetch(`${API_BASE_URL}/public/reports/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Gửi tố cáo thành công! Báo cáo đang chờ ban quản trị phê duyệt.");
        await fetchAllData();
      } else {
        if (response.status === 500) {
          throw new Error("Lỗi hệ thống phía máy chủ (500). Vui lòng thử lại sau.");
        } else {
          const errorText = await response.text();
          throw new Error("Gửi tố cáo thất bại: " + errorText);
        }
      }
    } catch (error: any) {
      console.error("Error submitting report:", error);
      throw new Error(error.message || "Có lỗi xảy ra khi kết nối tới máy chủ.");
    }
  };

  const addLegitProfile = async (profile: Omit<LegitProfile, "id" | "score" | "img" | "successTrans" | "joinDate">) => {
    const payload = {
      name: profile.name,
      role: profile.role,
      score: 98,
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
      desc: profile.desc,
      phone: profile.phone,
      telegram: profile.telegram,
      insurance: profile.insurance,
      successTrans: 1,
      joinDate: new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }).substring(3), // MM/YYYY
      businessType: profile.businessType
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/legit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Thêm hồ sơ thương nhân uy tín thành công!");
        await fetchAllData();
      } else {
        if (response.status === 401) {
          alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
        } else if (response.status === 500) {
          alert("Lỗi hệ thống phía máy chủ (500). Vui lòng thử lại sau.");
        } else {
          const errorText = await response.text();
          alert("Thêm hồ sơ thất bại: " + errorText);
        }
      }
    } catch (error) {
      console.error("Error creating legit profile:", error);
      alert("Có lỗi xảy ra khi kết nối tới máy chủ.");
    }
  };

  const approveScamReport = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/scams/${id}/approve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        if (response.status === 401) {
          alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
        } else if (response.status === 500) {
          alert("Lỗi hệ thống phía máy chủ (500). Vui lòng thử lại sau.");
        } else {
          console.error("Failed to approve scam report");
          alert("Duyệt báo cáo thất bại.");
        }
      }
    } catch (error) {
      console.error("Error approving report:", error);
      alert("Có lỗi xảy ra khi kết nối tới máy chủ.");
    }
  };

  const rejectScamReport = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/scams/${id}/reject`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        if (response.status === 401) {
          alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
        } else if (response.status === 500) {
          alert("Lỗi hệ thống phía máy chủ (500). Vui lòng thử lại sau.");
        } else {
          console.error("Failed to reject scam report");
          alert("Bác bỏ báo cáo thất bại.");
        }
      }
    } catch (error) {
      console.error("Error rejecting report:", error);
      alert("Có lỗi xảy ra khi kết nối tới máy chủ.");
    }
  };

  const deleteScamReport = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/scams/${id}/reject`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        if (response.status === 401) {
          alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
        } else if (response.status === 500) {
          alert("Lỗi hệ thống phía máy chủ (500). Vui lòng thử lại sau.");
        } else {
          console.error("Failed to delete scam report");
          alert("Xóa báo cáo thất bại.");
        }
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Có lỗi xảy ra khi kết nối tới máy chủ.");
    }
  };

  const updateScamReport = async (id: string, updatedReport: Partial<ScamReport>): Promise<boolean> => {
    const categoryEnum = updatedReport.category === "Cảnh báo hành vi" ? 1 : 0;
    const payload = {
      name: updatedReport.name,
      phone: updatedReport.phone || "",
      bankName: updatedReport.bankName,
      accountNumber: updatedReport.accountNumber,
      desc: updatedReport.desc,
      type: updatedReport.type,
      amount: updatedReport.amount,
      victim: updatedReport.victim || "Ẩn danh",
      facebook: updatedReport.facebook || "",
      tags: updatedReport.tags || [],
      images: updatedReport.images || [],
      category: categoryEnum
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/scams/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchAllData();
        return true;
      } else {
        if (response.status === 401) {
          alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
        } else if (response.status === 500) {
          alert("Lỗi hệ thống phía máy chủ (500). Vui lòng thử lại sau.");
        } else {
          const errorText = await response.text();
          alert("Cập nhật báo cáo thất bại: " + errorText);
        }
        return false;
      }
    } catch (error) {
      console.error("Error updating scam report:", error);
      alert("Có lỗi xảy ra khi kết nối tới máy chủ.");
      return false;
    }
  };

  const deleteLegitProfile = async (id: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/legit/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        if (response.status === 401) {
          alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
        } else if (response.status === 500) {
          alert("Lỗi hệ thống phía máy chủ (500). Vui lòng thử lại sau.");
        } else {
          console.error("Failed to delete legit profile");
          alert("Xóa hồ sơ thất bại.");
        }
      }
    } catch (error) {
      console.error("Error deleting legit profile:", error);
      alert("Có lỗi xảy ra khi kết nối tới máy chủ.");
    }
  };

  return (
    <AppContext.Provider
      value={{
        scams,
        legitList,
        token,
        isAuthenticated,
        addScamReport,
        addLegitProfile,
        approveScamReport,
        rejectScamReport,
        deleteScamReport,
        deleteLegitProfile,
        updateScamReport,
        login,
        logout
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
