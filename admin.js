document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     MENU MOBILE
  ========================================= */

  const mobileMenu =
    document.getElementById("mobileMenu");

  const navigation =
    document.getElementById("navigation");

  if (mobileMenu && navigation) {

    mobileMenu.addEventListener("click", () => {
      navigation.classList.toggle("open");
    });

    document
      .querySelectorAll(".navigation a")
      .forEach(link => {

        link.addEventListener("click", () => {
          navigation.classList.remove("open");
        });

      });
  }


  /* =========================================
     ANNÉE AUTOMATIQUE
  ========================================= */

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* =========================================
     ANIMATION DES BOUTONS
  ========================================= */

  const buttons =
    document.querySelectorAll(".admin-button");

  buttons.forEach((button, index) => {

    button.style.opacity = "0";
    button.style.transform = "translateY(12px)";

    setTimeout(() => {

      button.style.transition =
        "opacity .45s ease, transform .45s ease";

      button.style.opacity = "1";
      button.style.transform = "translateY(0)";

    }, 60 + (index * 45));

  });

});