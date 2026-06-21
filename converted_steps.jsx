        <div className="booking-steps-container">
          {/* Step 1: Calendar and Slots */}
          <div className="booking-step-content active" id="booking-step-1-el">
            <div className="calendar-flex">
              <div className="calendar-widget">
                <div className="calendar-month-header">
                  <button type="button" id="prev-month-btn" className="btn-icon">&lt;</button>
                  <span id="calendar-month-year">Julho 2026</span>
                  <button type="button" id="next-month-btn" className="btn-icon">&gt;</button>
                </div>
                <div className="calendar-weekdays">
                  <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                </div>
                <div className="calendar-days-grid" id="calendar-days">
                  {/* Days injected by JS */}
                </div>
              </div>
              <div className="time-slots-widget">
                <h3>Horários Disponíveis</h3>
                <p className="select-day-prompt" id="select-day-prompt">Por favor, selecione uma data no calendário.</p>
                <div className="time-slots-grid" id="time-slots" style={{"display":"none"}}>
                  <button type="button" className="time-slot-btn" data-time="09:00">09:00</button>
                  <button type="button" className="time-slot-btn" data-time="10:30">10:30</button>
                  <button type="button" className="time-slot-btn" data-time="12:00">12:00</button>
                  <button type="button" className="time-slot-btn" data-time="14:00">14:00</button>
                  <button type="button" className="time-slot-btn" data-time="15:30">15:30</button>
                  <button type="button" className="time-slot-btn" data-time="17:00">17:00</button>
                </div>
                <div id="slot-summary-box" className="slot-summary-box" style={{"display":"none"}}>
                  <p>Duração estimada: <strong id="calc-duration-text">8 minutos</strong></p>
                  <p>Horário: <strong id="calc-time-range">14:00 às 14:08</strong></p>
                </div>
              </div>
            </div>
            <div className="step-actions" style={{"marginTop":"32px","display":"flex","justifyContent":"flex-end"}}>
              <button type="button" id="next-to-step-2" className="btn btn-primary" disabled>Continuar</button>
            </div>
          </div>

          {/* Step 2: Address and Contact details */}
          <div className="booking-step-content" id="booking-step-2-el" style={{"display":"none"}}>
            
            <div className="google-auth-container" style={{"marginTop":"24px","textAlign":"center","paddingBottom":"24px","borderBottom":"1px solid var(--border)"}}>
              <button type="button" id="google-login-btn" className="btn btn-outline" style={{"width":"100%","display":"flex","alignItems":"center","justifyContent":"center","gap":"10px","fontWeight":"600"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Preencher rapidamente com Google
              </button>
              <p style={{"color":"var(--text-muted)","fontSize":"0.85rem","marginTop":"10px"}}>(Opcional) A forma mais rápida de preencher os seus dados.</p>
            </div>

            <form id="details-form" className="details-form" style={{"marginTop":"24px"}}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cust-name">Nome Completo *</label>
                  <input type="text" id="cust-name" required placeholder="Ex: João Silva" className="form-input-field" />
                </div>
                <div className="form-group">
                  <label htmlFor="cust-email">Email</label>
                  <input type="email" id="cust-email" placeholder="Ex: joao@email.com" className="form-input-field" />
                </div>
              </div>
              <div className="form-group" style={{"marginTop":"16px"}}>
                <label htmlFor="cust-phone">Telemóvel / Contacto *</label>
                <input type="tel" id="cust-phone" required placeholder="Ex: 912 345 678" className="form-input-field" />
              </div>
              <div className="form-group" style={{"marginTop":"16px"}}>
                <label htmlFor="cust-street">Rua e Número da Porta *</label>
                <input type="text" id="cust-street" required placeholder="Ex: Rua das Flores, nº 15" className="form-input-field" />
              </div>
              <div className="form-row" style={{"marginTop":"16px"}}>
                <div className="form-group">
                  <label htmlFor="cust-postal">Código Postal *</label>
                  <input type="text" id="cust-postal" required placeholder="Ex: 4000-000" className="form-input-field" />
                </div>
                <div className="form-group">
                  <label htmlFor="cust-suite">Andar / Apartamento (opcional)</label>
                  <input type="text" id="cust-suite" placeholder="Ex: 3º Esquerdo" className="form-input-field" />
                </div>
              </div>
              <p className="form-warning-note" style={{"marginTop":"24px","color":"var(--primary)","fontWeight":"600"}}>⚠️ Importante: Certifique-se de que estará em casa no dia e horário agendados para receber o nosso profissional.</p>
            </form>
            <div className="step-actions" style={{"marginTop":"32px","display":"flex","justifyContent":"space-between"}}>
              <button type="button" id="back-to-step-1" className="btn btn-outline">Voltar</button>
              <button type="button" id="next-to-step-3" className="btn btn-primary">Prosseguir para Pagamento</button>
            </div>
          </div>

          {/* Step 3: Payment details */}
          <div className="booking-step-content" id="booking-step-3-el" style={{"display":"none"}}>
            <div className="payment-widget" style={{"marginTop":"24px"}}>
              <div className="booking-summary-preview">
                <h3>Resumo do Serviço</h3>
                <p>Serviço: <strong>Limpeza de Vidros Impporta</strong></p>
                <p>Janelas: <strong id="preview-windows">4 janelas</strong></p>
                <p>Data/Hora: <strong id="preview-datetime">A carregar...</strong></p>
                <p>Duração: <strong id="preview-duration">8 min</strong></p>
                <p className="total-preview-cost">Total: <strong id="preview-cost">€16</strong></p>
              </div>

              <div className="payment-methods" style={{"marginTop":"24px"}}>
                <h3>Método de Pagamento</h3>
                <div className="payment-method-options" style={{"display":"flex","flexDirection":"column","gap":"12px","marginTop":"12px"}}>
                  <label className="pm-option active">
                    <input type="radio" name="payment-method" value="online" checked />
                    <div className="pm-info">
                      <span className="pm-title">💳 Cartão de Crédito / Débito (Online)</span>
                      <p>Pague online de forma 100% segura.</p>
                    </div>
                  </label>
                  <label className="pm-option">
                    <input type="radio" name="payment-method" value="mbway" />
                    <div className="pm-info">
                      <span className="pm-title">📱 MB Way</span>
                      <p>Receba a notificação de pagamento diretamente no telemóvel.</p>
                    </div>
                  </label>
                  <label className="pm-option">
                    <input type="radio" name="payment-method" value="cash" />
                    <div className="pm-info">
                      <span className="pm-title">💵 Pagamento em mãos (Dinheiro / Cartão)</span>
                      <p>Efetue o pagamento diretamente ao profissional no dia da limpeza.</p>
                    </div>
                  </label>
                </div>

                {/* Card Details Form */}
                <div id="card-details-fields" className="card-details-fields" style={{"marginTop":"20px"}}>
                  <div className="form-group">
                    <label htmlFor="card-num">Número do Cartão</label>
                    <input type="text" id="card-num" placeholder="0000 0000 0000 0000" className="form-input-field" />
                  </div>
                  <div className="form-row" style={{"marginTop":"12px"}}>
                    <div className="form-group">
                      <label htmlFor="card-expiry">Validade</label>
                      <input type="text" id="card-expiry" placeholder="MM/AA" className="form-input-field" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="card-cvc">CVC</label>
                      <input type="text" id="card-cvc" placeholder="000" className="form-input-field" />
                    </div>
                  </div>
                </div>

                {/* MBWay Details Form */}
                <div id="mbway-details-fields" className="mbway-details-fields" style={{"display":"none","marginTop":"20px"}}>
                  <div className="form-group">
                    <label htmlFor="mbway-phone">Telemóvel associado ao MB Way</label>
                    <input type="tel" id="mbway-phone" placeholder="9xxxxxxxx" className="form-input-field" />
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions" style={{"marginTop":"32px","display":"flex","justifyContent":"space-between"}}>
              <button type="button" id="back-to-step-2" className="btn btn-outline">Voltar</button>
              <button type="button" id="confirm-booking-btn" className="btn btn-primary">Confirmar e Finalizar</button>
            </div>
          </div>

          {/* Step 4: Success confirmation screen */}
          <div className="booking-step-content" id="booking-step-4-el" style={{"display":"none"}}>
            <div className="success-widget" style={{"textAlign":"center","padding":"40px 20px"}}>
              <div className="success-icon" style={{"width":"80px","height":"80px","backgroundColor":"rgba(16, 185, 129, 0.1)","borderRadius":"50%","display":"inline-flex","alignItems":"center","justifyContent":"center","marginBottom":"24px"}}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{"color":"var(--secondary)"}}><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style={{"fontSize":"2.25rem","fontWeight":"700","marginBottom":"8px"}}>Agendamento Confirmado!</h2>
              <p style={{"color":"var(--text-muted)","marginBottom":"32px"}}>O seu pedido foi registado com sucesso. Guarde o resumo do seu agendamento:</p>
              
              <div className="receipt-box">
                <div className="receipt-row"><span>Nº do Serviço:</span><strong id="receipt-id">#IMP-94827</strong></div>
                <div className="receipt-row"><span>Cliente:</span><strong id="receipt-name">João Silva</strong></div>
                <div className="receipt-row"><span>Contacto:</span><strong id="receipt-phone">912 345 678</strong></div>
                <div className="receipt-row"><span>Morada:</span><strong id="receipt-address">Rua das Flores, nº 15, Porto</strong></div>
                <div className="receipt-row"><span>Quantidade de Vidros:</span><strong id="receipt-windows">4 janelas</strong></div>
                <div className="receipt-row"><span>Duração Estimada:</span><strong id="receipt-duration">8 minutos (14:00 às 14:08)</strong></div>
                <div className="receipt-row"><span>Método Escolhido:</span><strong id="receipt-payment">Pagamento em Mãos</strong></div>
                <div className="receipt-row total"><span>Total Pago / A Pagar:</span><strong id="receipt-total">€16</strong></div>
              </div>

              <div className="success-actions" style={{"marginTop":"32px"}}>
                <button type="button" id="restart-booking-btn" className="btn btn-primary">Fazer Novo Agendamento</button>
              </div>
            </div>
          </div>
        </div>