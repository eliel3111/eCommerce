document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.querySelector('input[name="username"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const submitBtn = document.querySelector('.login-btn-primary');

  function validateInputs() {
    const emailValid = emailInput.value.includes('@') && emailInput.value.includes('.');
    const passwordValid = passwordInput.value.length > 5;

    if (emailValid && passwordValid) {
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = '#007BFF';
      submitBtn.style.cursor = 'pointer'; // cursor normal de clic
    } else {
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = '#b71c1c';
      submitBtn.style.cursor = 'not-allowed'; // cursor que indica bloqueo
    }
  }

  emailInput.addEventListener('input', validateInputs);
  passwordInput.addEventListener('input', validateInputs);
});
