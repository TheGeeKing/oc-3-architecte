// make sure the DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function () {
    const portfolio = document.getElementById("portfolio");
    fetch("http://localhost:5678/api/works").then((response) => {
      response.json().then((data) => {
        data.forEach((element) => {
          const portfolioElementToAdd = generatePortfolio({
            src: element.imageUrl,
            alt: element.title,
            caption: element.title,
            category: element.category.name,
          });
          // add in the portfolio first div
          portfolio
            .getElementsByClassName("gallery")[0]
            .appendChild(portfolioElementToAdd);
        });
      });
    });
    const filter = document.getElementById("filter");
    const filterElement = generateFilters("Tous");
    filter.appendChild(filterElement);
    fetch("http://localhost:5678/api/categories").then((response) => {
      response.json().then((categories) => {
        categories.forEach((element) => {
          const filterElement = generateFilters(element.name);
          filter.appendChild(filterElement);
        });
      });
    });
  },
  false
);

function generatePortfolio(element) {
  const portfolioItem = document.createElement("figure");
  portfolioItem.dataset.category = element.category;
  const portfolioImg = document.createElement("img");
  portfolioImg.src = element.src;
  portfolioImg.alt = element.alt;
  portfolioItem.appendChild(portfolioImg);
  const portfolioCaption = document.createElement("figcaption");
  portfolioCaption.textContent = element.caption;
  portfolioItem.appendChild(portfolioCaption);
  return portfolioItem;
}

function generateFilters(element) {
  const filterElement = document.createElement("button");
  filterElement.textContent = element;
  filterElement.dataset.filter = element;
  filterElement.addEventListener("click", (event) => {
    const portfolioItems =
      portfolio.getElementsByClassName("gallery")[0].children;
    for (let i = 0; i < portfolioItems.length; i++) {
      if (
        event.target.dataset.filter === "Tous" ||
        portfolioItems[i].dataset.category === event.target.dataset.filter
      ) {
        portfolioItems[i].style.display = "block";
      } else {
        portfolioItems[i].style.display = "none";
      }
    }
  });
  return filterElement;
}

function login(username, password) {
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: username, password: password }),
  }).then((response) => {
    response.json().then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      } else {
        alert("Erreur de connexion");
      }
    });
  });
}
