'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

export default function AdminCheckoutForm({ amount, onBack, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

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
      setErrorMessage("Pedido enviado. O cliente deve aprovar na app MB WAY. A aguardar...");
      
      const pollInterval = setInterval(async () => {
        try {
          const { paymentIntent: polledIntent } = await stripe.retrievePaymentIntent(paymentIntent.client_secret);
          
          if (polledIntent.status === 'succeeded') {
            clearInterval(pollInterval);
            onSuccess();
          } else if (polledIntent.status === 'requires_payment_method' || polledIntent.status === 'canceled') {
            clearInterval(pollInterval);
            setErrorMessage("O pagamento falhou ou foi cancelado pelo cliente.");
            setIsProcessing(false);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);

      setTimeout(() => {
        clearInterval(pollInterval);
        if (isProcessing) {
          setErrorMessage("Tempo limite excedido. O pagamento não foi concluído.");
          setIsProcessing(false);
        }
      }, 300000); // 5 mins

    } else {
      setErrorMessage("Ocorreu um erro inesperado.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
      <PaymentElement />
      {errorMessage && <div style={{ color: errorMessage.includes('aprove') || errorMessage.includes('enviado') ? '#3b82f6' : '#ef4444', marginTop: '12px', fontSize: '0.9rem', padding: '8px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>{errorMessage}</div>}
      
      <div className="step-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isProcessing}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isProcessing || !stripe || !elements}>
          {isProcessing ? 'A processar...' : `Cobrar €${amount}`}
        </button>
      </div>
    </form>
  );
}
