// make sure the DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function () {
    const portfolio = document.getElementById("portfolio");
    fetch("http://localhost:5678/api/works").then((response) => {
      console.log(response);
      response.json().then((data) => {
        data.forEach((element) => {
          const portfolioElementToAdd = generatePortfolio({
            src: element.imageUrl,
            alt: element.title,
            caption: element.title,
          });
          // add in the portfolio first div
          portfolio
            .getElementsByTagName("div")[0]
            .appendChild(portfolioElementToAdd);
        });
      });
    });
  },
  false
);

function generatePortfolio(element) {
  const portfolioItem = document.createElement("figure");
  const portfolioImg = document.createElement("img");
  portfolioImg.src = element.src;
  portfolioImg.alt = element.alt;
  portfolioItem.appendChild(portfolioImg);
  const portfolioCaption = document.createElement("figcaption");
  portfolioCaption.textContent = element.caption;
  portfolioItem.appendChild(portfolioCaption);
  return portfolioItem;
}
