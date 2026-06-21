// IMPORTANT: Configure these with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://ebwqunnqjwofqtqwbkkq.supabase.co'; // Must be a valid URL format to prevent JS crash
const supabaseAnonKey = 'sb_publishable_QGW7-ptfJFGcKxF12vvs8w_SCNQa0G6';
let supabaseClient = null;
try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.warn('Supabase initialization failed:', e);
}

let currentBookingId = null;

document.addEventListener("DOMContentLoaded", async () => {
  // --- Global Auth State Listener ---
  if (supabaseClient) {
    const navAuthBtn = document.getElementById('nav-auth-btn');
    if (navAuthBtn) {
      navAuthBtn.style.display = 'inline-block'; // Show it once JS runs
      
      const updateNavBtn = (user) => {
        const container = document.getElementById('nav-actions-container');
        if (user) {
          let avatarContent = '';
          if (user.user_metadata && user.user_metadata.avatar_url) {
            avatarContent = `<img src="${user.user_metadata.avatar_url}" alt="Avatar">`;
          } else {
            const name = (user.user_metadata?.full_name || user.email || 'U').toUpperCase();
            avatarContent = name.substring(0, 2);
          }
          
          const isAdmin = user.email === 'david.nungulo.mateus@gmail.com';
          
          container.innerHTML = `
            <div class="user-dropdown">
              <button class="user-avatar">${avatarContent}</button>
              <div class="user-dropdown-content">
                <a href="./dashboard.html">O meu Painel</a>
                ${isAdmin ? '<a href="#admin" style="color: var(--accent-color);">Painel Admin</a>' : ''}
                <a href="#" id="logout-btn">Sair</a>
              </div>
            </div>
          `;
          
          // Attach logout event
          document.getElementById('logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseClient.auth.signOut();
            window.location.href = './index.html';
          });
        } else {
          container.innerHTML = `<a href="./auth.html" id="nav-auth-btn" class="btn btn-outline">Entrar</a>`;
        }
      };

      // Initial check
      supabaseClient.auth.getUser().then(({ data: { user } }) => updateNavBtn(user));
      
      // Listen for changes
      supabaseClient.auth.onAuthStateChange((event, session) => {
        updateNavBtn(session?.user || null);
      });
    }
  }
  // ----------------------------------
  // Check for Google Auth redirect and restore state
  try {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('access_token') || localStorage.getItem('impporta_auth_redirect') === 'true') {
      localStorage.removeItem('impporta_auth_redirect');
      if (supabaseClient) {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
          // Auto-fill form and skip to step 2
          setTimeout(() => {
            const step1 = document.getElementById('booking-step-1-el');
            const step2 = document.getElementById('booking-step-2-el');
            const nameInput = document.getElementById('cust-name');
            const emailInput = document.getElementById('cust-email');
            
            if (step1 && step2) {
              step1.style.display = 'none';
              step2.style.display = 'block';
              document.getElementById('p-step-2').classList.add('active');
              
              // Scroll to step 2
              step2.scrollIntoView({ behavior: 'smooth' });
            }
            if (nameInput && user.user_metadata?.full_name) {
              nameInput.value = user.user_metadata.full_name;
            }
            if (emailInput && user.email) {
              emailInput.value = user.email;
            }
            
            // Restore selections
            try {
              const savedSelections = JSON.parse(localStorage.getItem('impporta_booking_selections'));
              if (savedSelections) {
                 const rangeInput = document.getElementById('window-range');
                 const numberInput = document.getElementById('window-number');
                 if (rangeInput) rangeInput.value = savedSelections.windows;
                 if (numberInput) numberInput.value = savedSelections.windows;
              }
            } catch (err) {}
          }, 500);
        }
      }
    }
  } catch (err) {
    console.error("Auth restore error:", err);
  }

  // Google Login Button Handler
  const googleLoginBtn = document.getElementById('google-login-btn');
  if (googleLoginBtn && supabaseClient) {
    googleLoginBtn.addEventListener('click', async () => {
      // Save current state
      const windows = parseInt(document.getElementById('window-range')?.value) || 4;
      localStorage.setItem('impporta_booking_selections', JSON.stringify({ windows }));
      localStorage.setItem('impporta_auth_redirect', 'true');
      
      await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
    });
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.fade-up');
  elementsToAnimate.forEach(el => observer.observe(el));

  // Navbar background change on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // Support Counter Logic
  const countValEl = document.getElementById('customer-count-val');
  const supportBtn = document.getElementById('support-btn');

  if (countValEl && supportBtn) {
    // Retrieve count from localStorage or default to 0
    let currentCount = parseInt(localStorage.getItem('impporta_customer_count')) || 0;
    countValEl.textContent = currentCount;

    // Check if user already supported in this session
    if (localStorage.getItem('impporta_supported') === 'true') {
      supportBtn.classList.add('supported');
      supportBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Apoiado! Obrigado
      `;
      supportBtn.style.pointerEvents = 'none';
      supportBtn.style.opacity = '0.8';
    }

    // Glitter Effect Function
    function triggerGlitter(element) {
      const count = 30;
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'glitter-particle';
        
        // Random angle and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        
        // Premium sparkle colors (gold, secondary, primary, pink, white)
        const colors = ['#FFD700', '#10B981', '#2563EB', '#FF69B4', '#FFFFFF'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const size = Math.random() * 8 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Center of counter container
        particle.style.left = '50%';
        particle.style.top = '50%';
        
        element.appendChild(particle);
        
        // Cleanup after animation
        setTimeout(() => {
          particle.remove();
        }, 850);
      }
    }

    supportBtn.addEventListener('click', (e) => {
      if (localStorage.getItem('impporta_supported') === 'true') return;

      currentCount += 1;
      localStorage.setItem('impporta_customer_count', currentCount);
      localStorage.setItem('impporta_supported', 'true');

      // Animate the counter value update
      countValEl.style.transform = 'scale(1.25)';
      countValEl.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      countValEl.textContent = currentCount;

      // Trigger glitter effect
      const container = countValEl.closest('.counter-container');
      if (container) {
        triggerGlitter(container);
      }

      setTimeout(() => {
        countValEl.style.transform = 'scale(1)';
      }, 250);

      // Create a floating '+1' animation effect
      const rect = supportBtn.getBoundingClientRect();
      const plusOne = document.createElement('span');
      plusOne.textContent = '+1';
      plusOne.className = 'plus-one-float';
      plusOne.style.left = `${e.clientX - rect.left}px`;
      plusOne.style.top = `${e.clientY - rect.top}px`;
      supportBtn.appendChild(plusOne);

      // Update button state
      supportBtn.classList.add('supported');
      supportBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Apoiado! Obrigado
      `;
      supportBtn.style.pointerEvents = 'none';
      supportBtn.style.opacity = '0.8';

      setTimeout(() => {
        plusOne.remove();
      }, 1000);
    });
  }

  // DOM Variables declarations
  const rangeInput = document.getElementById('window-range');
  const numberInput = document.getElementById('window-number');
  const countDisplay = document.getElementById('window-count-display');
  const barCompetitor = document.getElementById('bar-competitor');
  const barRegular = document.getElementById('bar-regular');
  const barDiscount = document.getElementById('bar-discount');
  const totalPayVal = document.getElementById('total-pay-val');
  const savingsVal = document.getElementById('savings-val');
  const calculatorSection = document.getElementById('calculator');

  const calendarDaysGrid = document.getElementById('calendar-days');
  const calendarMonthYear = document.getElementById('calendar-month-year');
  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');
  const timeSlotsContainer = document.getElementById('time-slots');
  const selectDayPrompt = document.getElementById('select-day-prompt');
  const slotSummaryBox = document.getElementById('slot-summary-box');
  const calcDurationText = document.getElementById('calc-duration-text');
  const calcTimeRange = document.getElementById('calc-time-range');

  const nextToStep2Btn = document.getElementById('next-to-step-2');
  const backToStep1Btn = document.getElementById('back-to-step-1');
  const nextToStep3Btn = document.getElementById('next-to-step-3');
  const backToStep2Btn = document.getElementById('back-to-step-2');
  const confirmBookingBtn = document.getElementById('confirm-booking-btn');
  const restartBookingBtn = document.getElementById('restart-booking-btn');

  const step1El = document.getElementById('booking-step-1-el');
  const step2El = document.getElementById('booking-step-2-el');
  const step3El = document.getElementById('booking-step-3-el');
  const step4El = document.getElementById('booking-step-4-el');

  const pStep1 = document.getElementById('p-step-1');
  const pStep2 = document.getElementById('p-step-2');
  const pStep3 = document.getElementById('p-step-3');
  const pStep4 = document.getElementById('p-step-4');

  // Booking Calendar & Step Wizard Logic State
  let selectedDate = null;
  let selectedTime = null;
  let currentMonth = 6; // Start on July (0-indexed: 6 = July)
  let currentYear = 2026;

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Helper to dynamically calculate and update duration summaries
  function updateBookingDuration() {
    if (!selectedTime) return;
    
    const windows = parseInt(rangeInput.value) || 4;
    const durationMin = windows * 5;
    
    // Update Step 1 calendar summary
    if (calcDurationText && calcTimeRange) {
      calcDurationText.textContent = `${durationMin} minutos`;
      
      const [hours, minutes] = selectedTime.split(':').map(Number);
      let endMinutes = minutes + durationMin;
      let endHours = hours + Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
      
      const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
      calcTimeRange.textContent = `${selectedTime} às ${formattedEndTime}`;
    }

    // Update Step 3 summary preview dynamically
    const previewWindows = document.getElementById('preview-windows');
    const previewDuration = document.getElementById('preview-duration');
    const previewCost = document.getElementById('preview-cost');
    
    if (previewWindows) {
      previewWindows.textContent = `${windows} janelas`;
    }
    if (previewCost) {
      previewCost.textContent = `€${windows * 4}`;
    }
    if (previewDuration) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      let endMinutes = minutes + durationMin;
      let endHours = hours + Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
      const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
      previewDuration.textContent = `${durationMin} min (término às ${formattedEndTime})`;
    }
  }

  // Dynamic slot renderer (5:00 AM to 8:00 PM every 1.5 hours with custom day exclusions)
  function renderTimeSlots(date) {
    if (!timeSlotsContainer) return;
    timeSlotsContainer.innerHTML = '';
    
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday, 4 = Thursday
    
    if (dayOfWeek === 0) {
      timeSlotsContainer.style.display = 'none';
      selectDayPrompt.textContent = "Não trabalhamos aos domingos. Por favor, escolha outro dia.";
      selectDayPrompt.style.display = 'block';
      slotSummaryBox.style.display = 'none';
      nextToStep2Btn.disabled = true;
      return;
    }
    
    // Base slots spanning 5:00 AM to 8:00 PM (working hours)
    const baseSlots = [
      "05:00", "06:30", "08:00", "09:30", "11:00", "12:30",
      "14:00", "15:30", "17:00", "18:30"
    ];
    
    let availableSlots = [];
    
    for (const slot of baseSlots) {
      const [hour, min] = slot.split(':').map(Number);
      
      // Saturday mornings exclusion: 5:00 to 12:00
      if (dayOfWeek === 6 && hour < 12) {
        continue;
      }
      
      // Thursday evenings exclusion: 17:00 to 20:00 (5 PM to 8 PM)
      if (dayOfWeek === 4 && hour >= 17) {
        continue;
      }
      
      availableSlots.push(slot);
    }
    
    if (availableSlots.length === 0) {
      timeSlotsContainer.style.display = 'none';
      selectDayPrompt.textContent = "Sem horários disponíveis para este dia.";
      selectDayPrompt.style.display = 'block';
      slotSummaryBox.style.display = 'none';
      nextToStep2Btn.disabled = true;
      return;
    }
    
    selectDayPrompt.style.display = 'none';
    timeSlotsContainer.style.display = 'grid';
    
    availableSlots.forEach(slot => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-slot-btn';
      btn.setAttribute('data-time', slot);
      btn.textContent = slot;
      
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-slot-btn').forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTime = slot;
        
        updateBookingDuration();
        
        slotSummaryBox.style.display = 'block';
        nextToStep2Btn.disabled = false;
      });
      
      timeSlotsContainer.appendChild(btn);
    });
  }

  // Price Simulator Logic
  if (rangeInput && numberInput) {
    let hasAnimated = false;

    function updateCalculator(value) {
      let windows = parseInt(value) || 1;
      if (windows < 1) windows = 1;
      if (windows > 100) windows = 100;
      
      // Ensure sync
      rangeInput.value = windows;
      numberInput.value = windows;
      countDisplay.textContent = windows;
      
      // Calculations
      const competitor = windows * 10;
      const regular = windows * 7;
      const discount = windows * 4;
      const savings = competitor - discount;
      
      // Update text values
      barCompetitor.querySelector('span').textContent = `€${competitor}`;
      barRegular.querySelector('span').textContent = `€${regular}`;
      barDiscount.querySelector('span').textContent = `€${discount}`;
      totalPayVal.textContent = `€${discount}`;
      savingsVal.textContent = `€${savings}`;
      
      // Update heights (always relative to competitor to maintain clear visual difference)
      if (hasAnimated) {
        barCompetitor.style.height = '100%';
        barRegular.style.height = '70%';
        barDiscount.style.height = '40%';
      }

      // Dynamically recalculate slot duration, end times, and prices if a time slot is already selected
      if (typeof updateBookingDuration === 'function') {
        updateBookingDuration();
      }
    }
    
    rangeInput.addEventListener('input', (e) => updateCalculator(e.target.value));
    numberInput.addEventListener('input', (e) => updateCalculator(e.target.value));
    
    // Intersection Observer to trigger the grow animation on scroll
    const calcObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          // Animate from 0 to target heights
          setTimeout(() => {
            barCompetitor.style.height = '100%';
            barRegular.style.height = '70%';
            barDiscount.style.height = '40%';
          }, 100);
          calcObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    calcObserver.observe(calculatorSection);
    
    // Initial calculation
    updateCalculator(4);
  }

  function renderCalendar() {
    if (!calendarDaysGrid) return;
    calendarDaysGrid.innerHTML = '';
    
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    calendarMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Empty cells for alignment (Align to Monday start, Monday=1, Sunday=0)
    const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    for (let i = 0; i < adjustedFirstDayIndex; i++) {
      const emptyDiv = document.createElement('div');
      calendarDaysGrid.appendChild(emptyDiv);
    }
    
    const minSelectableDate = new Date(2026, 6, 1); // July 1, 2026

    for (let day = 1; day <= lastDay; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day-cell';
      dayDiv.textContent = day;
      
      const cellDate = new Date(currentYear, currentMonth, day);
      cellDate.setHours(0, 0, 0, 0);
      
      // Disable dates before July 1, 2026 OR Sundays (getDay() === 0)
      if (cellDate < minSelectableDate || cellDate.getDay() === 0) {
        dayDiv.classList.add('disabled');
      } else {
        dayDiv.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day-cell').forEach(el => el.classList.remove('selected'));
          dayDiv.classList.add('selected');
          selectedDate = cellDate;
          
          // Render time slots dynamically
          selectedTime = null;
          slotSummaryBox.style.display = 'none';
          nextToStep2Btn.disabled = true;
          renderTimeSlots(cellDate);
        });
      }
      
      calendarDaysGrid.appendChild(dayDiv);
    }
  }

  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      // Don't allow going before July 2026
      if (currentYear > 2026 || (currentYear === 2026 && currentMonth > 6)) {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar();
      }
    });

    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
  }

  // Handle slot selection and duration math (2 minutes per window)
  document.querySelectorAll('.time-slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-slot-btn').forEach(el => el.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTime = btn.getAttribute('data-time');
      
      updateBookingDuration();
      
      slotSummaryBox.style.display = 'block';
      nextToStep2Btn.disabled = false;
    });
  });

  // Step transitions
  if (nextToStep2Btn) {
    nextToStep2Btn.addEventListener('click', () => {
      step1El.style.display = 'none';
      step2El.style.display = 'block';
      pStep2.classList.add('active');
    });
  }

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      step2El.style.display = 'none';
      step1El.style.display = 'block';
      pStep2.classList.remove('active');
    });
  }

  // Step 2 to Step 3 validation & preview rendering
  if (nextToStep3Btn) {
    nextToStep3Btn.addEventListener('click', () => {
      const name = document.getElementById('cust-name').value.trim();
      const email = document.getElementById('cust-email').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const street = document.getElementById('cust-street').value.trim();
      const postal = document.getElementById('cust-postal').value.trim();
      const suite = document.getElementById('cust-suite').value.trim();
      
      if (!name || !phone || !street || !postal) {
        alert("Por favor, preencha todos os campos obrigatórios (*).");
        return;
      }
      
      // Render Preview
      const windows = parseInt(rangeInput.value) || 4;
      const cost = windows * 4;
      const durationMin = windows * 5;
      
      document.getElementById('preview-windows').textContent = `${windows} janelas`;
      
      const formattedDate = selectedDate.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const [hours, minutes] = selectedTime.split(':').map(Number);
      let endMinutes = minutes + durationMin;
      let endHours = hours + Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
      const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
      
      document.getElementById('preview-datetime').textContent = `${formattedDate} às ${selectedTime}`;
      document.getElementById('preview-duration').textContent = `${durationMin} min (término às ${formattedEndTime})`;
      document.getElementById('preview-cost').textContent = `€${cost}`;
      
      // SAVE PENDING BOOKING TO SUPABASE
      if (supabaseClient) {
        nextToStep3Btn.disabled = true;
        nextToStep3Btn.textContent = "A aguardar...";
        
        supabaseClient.auth.getUser().then(({ data: { user } }) => {
          const authId = user ? user.id : null;
          
          supabaseClient.from('bookings').insert([{
            window_count: windows,
            total_price: cost,
            booking_date: selectedDate.toISOString().split('T')[0],
            time_slot: selectedTime,
            customer_name: name,
            email: email,
            auth_id: authId,
            customer_phone: phone,
            street_address: street,
            postal_code: postal,
            apartment_suite: suite,
            status: 'pending'
          }]).select().then(({ data, error }) => {
            nextToStep3Btn.disabled = false;
            nextToStep3Btn.textContent = "Prosseguir para Pagamento";
            
            if (!error && data && data.length > 0) {
              currentBookingId = data[0].id;
            }
            
            step2El.style.display = 'none';
            step3El.style.display = 'block';
            pStep3.classList.add('active');
          });
        });
      } else {
        step2El.style.display = 'none';
        step3El.style.display = 'block';
        pStep3.classList.add('active');
      }
    });
  }

  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => {
      step3El.style.display = 'none';
      step2El.style.display = 'block';
      pStep3.classList.remove('active');
    });
  }

  // Handle Payment Method Choice toggle fields
  const pmRadios = document.querySelectorAll('input[name="payment-method"]');
  const cardFields = document.getElementById('card-details-fields');
  const mbwayFields = document.getElementById('mbway-details-fields');

  pmRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.pm-option').forEach(el => el.classList.remove('active'));
      radio.closest('.pm-option').classList.add('active');
      
      if (radio.value === 'online') {
        cardFields.style.display = 'block';
        mbwayFields.style.display = 'none';
      } else if (radio.value === 'mbway') {
        cardFields.style.display = 'none';
        mbwayFields.style.display = 'block';
      } else {
        cardFields.style.display = 'none';
        mbwayFields.style.display = 'none';
      }
    });
  });

  // Final confirmation logic (Step 3 to Step 4)
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      const pm = document.querySelector('input[name="payment-method"]:checked').value;
      
      if (pm === 'online') {
        const cardNum = document.getElementById('card-num').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        const cardCvc = document.getElementById('card-cvc').value.trim();
        if (!cardNum || !cardExpiry || !cardCvc) {
          alert("Por favor, preencha todos os dados do cartão de crédito.");
          return;
        }
      } else if (pm === 'mbway') {
        const mbwayPhone = document.getElementById('mbway-phone').value.trim();
        if (!mbwayPhone) {
          alert("Por favor, introduza o telemóvel associado ao MB Way.");
          return;
        }
      }

      // Simulate API loading spinner
      confirmBookingBtn.disabled = true;
      confirmBookingBtn.textContent = "A processar agendamento...";
      
      setTimeout(() => {
        const windows = parseInt(rangeInput.value) || 4;
        const cost = windows * 4;
        const durationMin = windows * 5;
        
        const name = document.getElementById('cust-name').value;
        const phone = document.getElementById('cust-phone').value;
        const street = document.getElementById('cust-street').value;
        const postal = document.getElementById('cust-postal').value;
        const suite = document.getElementById('cust-suite').value;
        
        // End time calculation
        const [hours, minutes] = selectedTime.split(':').map(Number);
        let endMinutes = minutes + durationMin;
        let endHours = hours + Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
        const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

        // Populate receipt
        document.getElementById('receipt-id').textContent = `#IMP-${Math.floor(10000 + Math.random() * 90000)}`;
        document.getElementById('receipt-name').textContent = name;
        document.getElementById('receipt-phone').textContent = phone;
        
        let fullAddressString = `${street}, ${postal}`;
        if (suite) fullAddressString = `${street} (${suite}), ${postal}`;
        document.getElementById('receipt-address').textContent = fullAddressString;
        
        document.getElementById('receipt-windows').textContent = `${windows} janelas`;
        document.getElementById('receipt-duration').textContent = `${durationMin} minutos (${selectedTime} às ${formattedEndTime})`;
        
        let pmText = "Pagamento Online por Cartão";
        if (pm === 'mbway') pmText = "MB Way";
        else if (pm === 'cash') pmText = "Pagamento em Mãos (Dinheiro / Cartão)";
        document.getElementById('receipt-payment').textContent = pmText;
        document.getElementById('receipt-total').textContent = `€${cost}`;

        // Move to Success screen
        const finalizeBookingUi = () => {
          step3El.style.display = 'none';
          step4El.style.display = 'block';
          pStep4.classList.add('active');
          window.location.hash = 'success';
          confirmBookingBtn.disabled = false;
          confirmBookingBtn.textContent = "Confirmar e Finalizar";
        };

        // Update booking in Supabase to confirmed
        if (supabaseClient && currentBookingId) {
          supabaseClient.from('bookings').update({ 
            status: 'confirmed',
            payment_method: pm
          }).eq('id', currentBookingId).then(() => {
            finalizeBookingUi();
          });
        } else {
          finalizeBookingUi();
        }
        // Reset button
        confirmBookingBtn.disabled = false;
        confirmBookingBtn.textContent = "Confirmar e Finalizar";
      }, 1500);
    });
  }

  // Restart wizard
  if (restartBookingBtn) {
    restartBookingBtn.addEventListener('click', () => {
      // Reset forms and selections
      document.getElementById('details-form').reset();
      selectedDate = null;
      selectedTime = null;
      
      pStep2.classList.remove('active');
      pStep3.classList.remove('active');
      pStep4.classList.remove('active');
      
      step4El.style.display = 'none';
      step1El.style.display = 'block';
      
      // Clear URL hash
      window.location.hash = '';
      
      renderCalendar();
      selectDayPrompt.style.display = 'block';
      timeSlotsContainer.style.display = 'none';
      slotSummaryBox.style.display = 'none';
      nextToStep2Btn.disabled = true;
    });
  }

  // Initial Calendar load
  renderCalendar();
});
