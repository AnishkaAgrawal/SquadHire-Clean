exports.PageError = (req, res, next) => {
  res.status(404).render("404",{pageTitle:"Page Not Found",
    isLoggedIn: req.session.isLoggedIn, currentPage: '404' , user : {}});
} ; 