import { Metadata } from "next";
import RegisterContent from "./RegisterContent";

export const metadata: Metadata = {
  title: "MovieStream - Sign Up Now",
  description: "MovieStream Website Registration Page",
}

const RegisterPage = () => <RegisterContent />;

export default RegisterPage;
