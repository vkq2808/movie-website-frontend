import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export default function CompletePurchasingStep() {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>
      <h2 className="text-3xl font-bold text-white mb-4">Thanh toán thành công!</h2>
      <p className="text-gray-400 mb-8">
        Giao dịch của bạn đã được xác nhận. Đang chuyển hướng đến trang xem phim...
      </p>
      <div className="flex justify-center">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
      </div>
    </motion.div>
  )
}