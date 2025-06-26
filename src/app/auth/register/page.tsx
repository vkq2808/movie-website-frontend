import { RegisterForm } from "@/components/common";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MovieStream - Đăng ký ngay",
  description: "Trang đăng ký của website MovieStream",
}

const RegisterPage = () => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
