import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-6">Complete Your Payment</h1>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm registrationId={registrationId} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}