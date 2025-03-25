import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon, CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';

if (!STRIPE_PUBLIC_KEY) {
  console.warn('Missing required Stripe key: NEXT_PUBLIC_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

function CheckoutForm({ registrationId }: { registrationId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await apiRequest("POST", "/api/confirm-payment", {
          registrationId,
          paymentIntentId: paymentIntent.id,
        });

        toast({
          title: "Payment Successful",
          description: "Welcome to AI Basics Bootcamp!",
        });

        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        className="w-full"
        disabled={isProcessing || !stripe}
      >
        {isProcessing ? "Processing..." : "Pay $299.99"}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const params = new URLSearchParams(window.location.search);
  const registrationId = params.get("registrationId");
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!registrationId) {
      toast({
        title: "Error",
        description: "Invalid registration",
        variant: "destructive",
      });
      navigate("/register");
      return;
    }

    apiRequest("POST", "/api/create-payment-intent", { registrationId })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/register");
      });
  }, [registrationId, toast, navigate]);

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Security Illustrations */}
      <div className="relative overflow-hidden bg-primary/5 py-12">
        <div className="absolute inset-0" style={{ opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="shield-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 10 L50 20 L50 40 L30 50 L10 40 L10 20 Z" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shield-pattern)"/>
          </svg>
        </div>

        {/* Security Icons */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <ShieldCheckIcon className="w-16 h-16 text-primary opacity-20" />
        </div>
        <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <LockClosedIcon className="w-12 h-12 text-primary opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2">
          <CreditCardIcon className="w-10 h-10 text-primary opacity-20" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Secure Checkout</h1>
            <p className="text-muted-foreground">
              Complete your registration with our secure payment system
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center mb-6">Complete Your Payment</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm registrationId={registrationId!} />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}