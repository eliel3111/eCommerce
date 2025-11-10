function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // Usuario autenticado -> sigue a la ruta
  }
  res.redirect("/user/login"); // No autenticado -> lo mandamos al login
}

export default ensureAuthenticated;
 
