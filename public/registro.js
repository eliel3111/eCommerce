const nameInput = document.getElementById('signin-name');
const emailInput = document.getElementById('signin-email');
const passwordInput = document.getElementById('signin-password');
const confirmPasswordInput = document.getElementById('signin-confirm-pw');
const errorDisplay = document.getElementById('signin-error');
const submitButton = document.getElementById('signin-submit');

let isPassword = false;

// event en confirmar contrasena
confirmPasswordInput.addEventListener('input', checkPasswordsMatch);

//Event para todos los input del form registrar
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('input', checkAllInputs);
});

//Funcion para chequiar si las contrasenas son iguales
function checkPasswordsMatch() {
  if (passwordInput.value === confirmPasswordInput.value) {
    errorDisplay.style.display = 'none';
    isPassword = true;
  } else {
    errorDisplay.textContent = "Las contraseñas no coinciden";
    errorDisplay.style.display = 'flex';
    isPassword = false;
  }

}

//Chequiar si todos los inputs del form tienen valor para
// habilitar el boton del form registrar
function checkAllInputs() {
  if (
  nameInput.value.trim() !== '' &&
  emailInput.value.trim() !== '' &&
  passwordInput.value.trim() !== '' &&
  confirmPasswordInput.value.trim() !== '' &&
  isPassword === true
) {
  console.log('Todos los campos tienen valor');
  submitButton.disabled = false;
} else {
  console.log('Faltan campos por llenar');
  errorDisplay.textContent = "Las contraseñas no coinciden";
  submitButton.disabled = true;
}
}