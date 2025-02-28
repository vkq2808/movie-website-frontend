import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-fit p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <a href="/about">
          <h1 className="text-4xl font-bold text-center sm:text-left">
            Click để đến trang /about
          </h1>
        </a>
      </main>
    </div>
  );
}
