import { Voucher, VoucherType } from "@/apis/voucher.api";
import { Movie } from "@/types/api.types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface Props {
  movie: Movie;
  selectedVoucher: Voucher | null;
  agreedToTerms: boolean;
  setAgreedToTerms: Dispatch<SetStateAction<boolean>>;
  error: string;
}

export default function PurchaseConfirmationStep({
  movie,
  selectedVoucher,
  agreedToTerms,
  setAgreedToTerms,
  error,
}: Props) {
  // Calculate final price
  const calculateFinalPrice = () => {
    if (!movie) return 0;
    if (!selectedVoucher) return movie.price;

    if (selectedVoucher.type === VoucherType.PERCENT) {
      return movie.price * (1 - selectedVoucher.value / 100);
    } else {
      return Math.max(0, movie.price - selectedVoucher.value);
    }
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-white mb-6">
        Xác nhận thanh toán
      </h2>

      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Phim:</span>
          <span className="text-white font-medium">{movie.title}</span>
        </div>
        {selectedVoucher && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Voucher:</span>
            <span className="text-green-500 font-medium">
              {selectedVoucher.code}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <span className="text-white font-semibold text-lg">
            Tổng thanh toán:
          </span>
          <span className="text-3xl font-bold text-red-500">
            {calculateFinalPrice().toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-600 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
            Tôi đồng ý với{" "}
            <Link
              href="/terms-of-use"
              target="_blank"
              className="text-red-500 underline"
            >
              điều khoản sử dụng
            </Link>
            {" "}
            và
            {" "}
            <Link
              href="/policies/refund-policy"
              target="_blank"
              className="text-red-500 underline"
            >
              chính sách hoàn tiền
            </Link>
            . Sau khi thanh toán, tôi có thể xem phim không giới hạn trong tài
            khoản của mình.
          </span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </motion.div>
  );
}
