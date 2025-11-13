import { Voucher, VoucherType } from "@/apis/voucher.api";
import { Movie } from "@/types/api.types"
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Sparkles, Ticket } from "lucide-react";
import { Dispatch, SetStateAction } from "react";


interface Props {
  movie: Movie
  loading: boolean
  selectedVoucher: Voucher | null
  vouchers: Voucher[]
  setSelectedVoucher: Dispatch<SetStateAction<Voucher | null>>
}

export default function VoucherSelectionStep({ movie, loading, selectedVoucher, vouchers, setSelectedVoucher }: Props) {


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
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-white mb-6">Chọn voucher</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : vouchers.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Bạn chưa có voucher nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => setSelectedVoucher(null)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${!selectedVoucher
              ? 'border-red-600 bg-red-950/30'
              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Không sử dụng voucher</span>
              {!selectedVoucher && <Check className="w-5 h-5 text-red-500" />}
            </div>
          </button>

          {vouchers.map((voucher) => (
            <button
              key={voucher.id}
              onClick={() => setSelectedVoucher(voucher)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${selectedVoucher?.id === voucher.id
                ? 'border-red-600 bg-red-950/30'
                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-white">{voucher.code}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{voucher.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Giảm:{' '}
                      {voucher.type === VoucherType.PERCENT
                        ? `${voucher.value}%`
                        : `${voucher.value}`}
                    </span>
                  </div>
                </div>
                {selectedVoucher?.id === voucher.id && (
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {movie && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Giá gốc:</span>
            <span className="text-gray-300">{movie.price}</span>
          </div>
          {selectedVoucher && (
            <div className="flex items-center justify-between mb-2 text-green-500">
              <span>Giảm giá:</span>
              <span>-{(movie.price - calculateFinalPrice())}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <span className="text-white font-semibold">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-red-500">
              {calculateFinalPrice()}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}