'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

export default function CheckoutForm({ amount, onBack, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else if (paymentIntent && (paymentIntent.status === 'processing' || paymentIntent.status === 'requires_action')) {
      setErrorMessage("Por favor, aprove o pagamento na sua app MB WAY. A aguardar confirmação...");
      
      // Poll the payment intent status
      const pollInterval = setInterval(async () => {
        try {
          const { paymentIntent: polledIntent } = await stripe.retrievePaymentIntent(paymentIntent.client_secret);
          
          if (polledIntent.status === 'succeeded') {
            clearInterval(pollInterval);
            onSuccess();
          } else if (polledIntent.status === 'requires_payment_method' || polledIntent.status === 'canceled') {
            clearInterval(pollInterval);
            setErrorMessage("O pagamento falhou ou foi cancelado.");
            setIsProcessing(false);
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 3000);

      // Timeout after 5 minutes (MBWay expires after ~4-5 mins)
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isProcessing) {
          setErrorMessage("O tempo limite do pagamento expirou. Por favor, tente novamente.");
          setIsProcessing(false);
        }
      }, 300000);

    } else {
      setErrorMessage("Ocorreu um erro inesperado.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
      <PaymentElement />
      {errorMessage && <div style={{ color: '#ef4444', marginTop: '12px', fontSize: '0.9rem' }}>{errorMessage}</div>}
      
      <div className="step-actions" style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" className="btn btn-outline" onClick={onBack} disabled={isProcessing}>
          Voltar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isProcessing || !stripe || !elements}>
          {isProcessing ? 'A processar...' : `Pagar €${amount} e Confirmar`}
        </button>
      </div>
    </form>
  );
}
