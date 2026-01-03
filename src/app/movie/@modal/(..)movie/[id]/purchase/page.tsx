"use client";

import { useState, useEffect } from "react";
// Router functionality will be handled via window.location for demo purposes
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Ticket,
  ChevronRight,
  Loader2,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import movieApi from "@/apis/movie.api";
import { Movie } from "@/types/api.types";
import { getMyVouchers, Voucher, VoucherType } from "@/apis/voucher.api";
import { purchaseMovie } from "@/apis/movie-purchase.api";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import MovieConfirmationStep from "@/components/user/movie/purchasing/MovieConfirmationStep";
import VoucherSelectionStep from "@/components/user/movie/purchasing/VoucherSelectionStep";
import PurchaseConfirmationStep from "@/components/user/movie/purchasing/PurchaseConfirmationStep";
import CompletePurchasingStep from "@/components/user/movie/purchasing/CompletePurchasingStep";
import { useAuthStore } from "@/zustand";

export default function PurchaseModal() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const { user } = useAuthStore();

  const { id: movieId } = useParams();

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const id = movieId as string;
        const response = await movieApi.getMovieById(id);
        if (!response.success) throw new Error("Không thể tải thông tin phim");
        const data = response.data;
        setMovie(data);
      } catch (err) {
        setError("Không thể tải thông tin phim. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  // Fetch vouchers when step 2
  useEffect(() => {
    if (currentStep === 2) {
      const fetchVouchers = async () => {
        try {
          setLoading(true);
          if (!user) {
            setError("Vui lòng đăng nhập để xem voucher");
            return;
          }

          const response = await getMyVouchers();

          if (!response.success)
            throw new Error("Không thể tải danh sách voucher");
          const data = response.data;
          setVouchers(data);
        } catch (err) {
          setError("Không thể tải voucher. Bạn có thể tiếp tục mua hàng.");
        } finally {
          setLoading(false);
        }
      };

      fetchVouchers();
    }
  }, [currentStep]);

  // Handle purchase
  const handlePurchase = async () => {
    if (!agreedToTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!user) {
        setError("Vui lòng đăng nhập để xem voucher");
        return;
      }

      const id = movieId as string;
      const response = await purchaseMovie(id);

      if (!response.success) {
        throw new Error(response.message || "Giao dịch thất bại");
      }

      setPurchaseComplete(true);
      setCurrentStep(4);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (err) {
      if (err instanceof AxiosError)
        setError(err.message || "Đã xảy ra lỗi khi thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Xác nhận phim" },
    { number: 2, title: "Chọn voucher" },
    { number: 3, title: "Xác nhận" },
    { number: 4, title: "Hoàn tất" },
  ];

  const handleClose = () => {
    router.push(`/movie/${movieId}/purchase`);
  };
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else if (currentStep === 3) handlePurchase();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    if (currentStep === 3) return agreedToTerms && !loading;
    return !loading;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <X className="w-5 h-5 text-red-300" />
        </button>
        {/* Progress Steps */}
        {!purchaseComplete && (
          <div className="bg-gray-900/50 px-8 py-6 border-b border-gray-700">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.slice(0, 3).map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep >= step.number
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        currentStep >= step.number
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-20 h-0.5 mx-2 transition-colors ${
                        currentStep > step.number ? "bg-red-600" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Movie Info */}
            {currentStep === 1 && movie && (
              <MovieConfirmationStep movie={movie} />
            )}

            {/* Step 2: Voucher Selection */}
            {currentStep === 2 && movie && (
              <VoucherSelectionStep
                movie={movie}
                loading={loading}
                selectedVoucher={selectedVoucher}
                vouchers={vouchers}
                setSelectedVoucher={setSelectedVoucher}
              />
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && movie && (
              <PurchaseConfirmationStep
                agreedToTerms={agreedToTerms}
                error={error}
                movie={movie}
                selectedVoucher={selectedVoucher}
                setAgreedToTerms={setAgreedToTerms}
              />
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && purchaseComplete && (
              <CompletePurchasingStep />
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {!purchaseComplete && (
          <div className="px-8 py-6 bg-gray-900/50 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Quay lại
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-red-900/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : currentStep === 3 ? (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Thanh toán
                </>
              ) : (
                <>
                  Tiếp tục
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
