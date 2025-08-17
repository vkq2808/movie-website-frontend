import { Metadata } from "next";
import RegisterContent from "./RegisterContent";

export const metadata: Metadata = {
  title: "MovieStream - Đăng ký ngay",
  description: "Trang đăng ký của website MovieStream",
}

const RegisterPage = () => <RegisterContent />;

export default RegisterPage;
