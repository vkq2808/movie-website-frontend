"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { checkVnpaySignature, getPayment } from "@/apis/payment.api";
import { useToast } from "@/hooks/useToast";
import LoadingSpinner from "@/components/common/Loading/LoadingSpinner";

const CallbackContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"checking" | "success" | "failed">(
    "checking"
  );

  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const vnp_TxnRef = searchParams.get("vnp_TxnRef");
  const paymentId = searchParams.get("vnp_OrderInfo");
  const vnp_Amount = searchParams.get("vnp_Amount");
  const vnp_BankCode = searchParams.get("vnp_BankCode");
  const vnp_PayDate = searchParams.get("vnp_PayDate");
  const vnp_CardType = searchParams.get("vnp_CardType");
  const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
  const vnp_SecureHash = searchParams.get("vnp_SecureHash");
  const vnp_SecureHashType = searchParams.get("vnp_SecureHashType");
  const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
  const vnp_BankTranNo = searchParams.get("vnp_BankTranNo");
  const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
  const vnp_TmnCode = searchParams.get("vnp_TmnCode");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!paymentId) {
        toast.error("Invalid Payment ID");
        setStatus("failed");
        setLoading(false);
        setTimeout(() => router.push("/wallet"), 2000);
        return;
      }

      try {
        // Wait a bit for IPN callback to process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await checkVnpaySignature(paymentId, {
          vnp_ResponseCode,
          vnp_TxnRef,
          vnp_Amount,
          vnp_BankCode,
          vnp_PayDate,
          vnp_CardType,
          vnp_TransactionNo,
          vnp_SecureHash,
          vnp_SecureHashType,
          vnp_TransactionStatus,
          vnp_BankTranNo,
          vnp_OrderInfo,
          vnp_TmnCode,
        });

        if (response.success && response.data) {
          const payment = response.data;

          if (payment.payment_status === "success") {
            setStatus("success");
            toast.success("Payment Successful!", {
              description: `Amount ${payment.amount.toLocaleString()} ${
                payment.currency
              } has been added to your wallet.`,
            });
            setTimeout(() => router.push("/wallet"), 3000);
          } else if (payment.payment_status === "fail") {
            setStatus("failed");
            toast.error("Payment Failed", {
              description:
                "Transaction could not be completed. Please try again.",
            });
            setTimeout(() => router.push("/wallet"), 3000);
          } else {
            // Still pending, check VNPay response code
            if (vnp_ResponseCode === "00") {
              // Success from VNPay but payment status not updated yet
              setStatus("success");
              toast.success("Payment Successful!", {
                description:
                  "Transaction is being processed. The amount will be updated to your wallet shortly.",
              });
              setTimeout(() => router.push("/wallet"), 3000);
            } else {
              setStatus("failed");
              toast.error("Payment Failed", {
                description: vnp_ResponseCode
                  ? `Error code: ${vnp_ResponseCode}`
                  : "Transaction could not be completed. Please try again.",
              });
              setTimeout(() => router.push("/wallet"), 3000);
            }
          }
        } else {
          setStatus("failed");
          toast.error("Transaction information not found");
          setTimeout(() => router.push("/wallet"), 2000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setStatus("failed");
        toast.error("An error occurred while checking payment status");
        setTimeout(() => router.push("/wallet"), 2000);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [paymentId, vnp_ResponseCode, router, toast]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          {loading || status === "checking" ? (
            <>
              <LoadingSpinner />
              <h2 className="text-xl font-semibold mt-4 mb-2">Processing...</h2>
              <p className="text-gray-400 text-sm">
                Please wait while we check your payment status
              </p>
            </>
          ) : status === "success" ? (
            <>
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-green-400">
                Payment Successful!
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                You will be redirected to your wallet page shortly...
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-400">
                Payment Failed
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                You will be redirected to your wallet page shortly...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function VNPayCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
