// Initialize Supabase Client
const supabaseUrl = 'https://ebwqunnqjwofqtqwbkkq.supabase.co'; // Replace with your actual URL
const supabaseAnonKey = 'sb_publishable_QGW7-ptfJFGcKxF12vvs8w_SCNQa0G6'; // Replace with your actual Anon Key
let supabaseClient = null;

try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error('Supabase init failed:', e);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!supabaseClient) return;

  // Check if already logged in
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (user) {
    window.location.href = './dashboard.html';
    return;
  }

  // DOM Elements
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const authForm = document.getElementById('auth-form');
  const nameField = document.getElementById('name-field');
  const authName = document.getElementById('auth-name');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const submitBtn = document.getElementById('auth-submit-btn');
  const errorMsg = document.getElementById('auth-error');
  const switchBtn = document.getElementById('auth-switch-btn');
  const switchText = document.getElementById('auth-switch-text');
  
  const googleBtn = document.getElementById('google-auth-btn');

  let isSignUpMode = false;

  // Toggle Mode
  switchBtn.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    errorMsg.style.display = 'none';
    
    if (isSignUpMode) {
      authTitle.textContent = "Criar nova conta";
      authSubtitle.textContent = "Junte-se à Impporta para agendar limpezas facilmente.";
      nameField.style.display = 'block';
      submitBtn.textContent = "Criar Conta";
      switchText.textContent = "Já tem conta?";
      switchBtn.textContent = "Entrar";
    } else {
      authTitle.textContent = "Bem-vindo de volta";
      authSubtitle.textContent = "Entre na sua conta para gerir os seus agendamentos.";
      nameField.style.display = 'none';
      submitBtn.textContent = "Entrar";
      switchText.textContent = "Ainda não tem conta?";
      switchBtn.textContent = "Criar Conta";
    }
  });

  // Handle Form Submit
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = "A aguardar...";

    const email = authEmail.value.trim();
    const password = authPassword.value;
    const name = authName.value.trim();

    try {
      if (isSignUpMode) {
        // Sign Up
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
        
        // Success
        submitBtn.textContent = "✓ Conta criada com sucesso!";
        submitBtn.style.backgroundColor = "#10b981";
        submitBtn.style.borderColor = "#10b981";
        
        setTimeout(() => {
          window.location.href = './dashboard.html';
        }, 1500);
        return; // prevent finally block from resetting button
      } else {
        // Sign In
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        submitBtn.textContent = "✓ A redirecionar...";
        submitBtn.style.backgroundColor = "#10b981";
        submitBtn.style.borderColor = "#10b981";
        
        setTimeout(() => {
          window.location.href = './dashboard.html';
        }, 1000);
        return; // prevent finally block from resetting button
      }
    } catch (error) {
      console.error(error);
      errorMsg.textContent = error.message.includes("Invalid login") 
        ? "Credenciais inválidas. Tente novamente." 
        : (error.message || "Ocorreu um erro na autenticação.");
      errorMsg.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = isSignUpMode ? "Criar Conta" : "Entrar";
    }
  });

  // Handle Google Auth
  googleBtn.addEventListener('click', async () => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/dashboard.html' }
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      errorMsg.textContent = "Erro ao conectar com Google: " + error.message;
      errorMsg.style.display = 'block';
    }
  });
});
