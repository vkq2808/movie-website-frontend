import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import Image from "next/image";
import Link from "next/link";


export default function Home() {

  return (
    <div className="dark grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-fit p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Link href="/about" className="text-4xl font-bold text-center sm:text-left hover:cursor-pointer"  >
          Click để đến trang /about
        </Link>
      </main>
    </div >
  );
}
