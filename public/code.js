 const codeInput = document.querySelector('.code-input');
  const submitButton = document.querySelector('.code-submit-button');

  codeInput.addEventListener('input', () => {
    // Eliminar todo lo que no sea número
    codeInput.value = codeInput.value.replace(/\D/g, '');

    if (codeInput.value.length === 6) {
      submitButton.style.backgroundColor = '#007BFF';
      submitButton.disabled = false;
    } else {
      submitButton.style.backgroundColor = '';
      submitButton.disabled = true;
    }
  });