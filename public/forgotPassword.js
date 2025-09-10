const emailInput = document.getElementById('email-input');
const submitBtn = document.getElementById('submit-btn');

emailInput.addEventListener('input', () => {
  const value = emailInput.value;

  // Validación básica: que tenga @ y .
  if (value.includes('@') && value.includes('.')) {
    submitBtn.disabled = false;
    submitBtn.style.backgroundColor = '#007BFF';
    submitBtn.style.cursor = 'pointer'; // cursor normal de clic
  } else {
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = '#b71c1c';
    submitBtn.style.cursor = 'not-allowed';
  }
});
