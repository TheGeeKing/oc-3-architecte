// make sure the DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function () {
    mainPage();
    loginPage();
  },
  false
);

function mainPage() {
  const portfolio = document.getElementById("portfolio");
  if (!portfolio) {
    return;
  }
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
  isLogin();
}

function loginPage() {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) {
    return;
  }
  // add event listener
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    login(email, password);
  });
}

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

function login(email, password) {
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
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

function isLogin() {
  if (!localStorage.getItem("token")) {
    return;
  }
  const header = document.getElementsByTagName("header")[0];
  header.style.marginTop = "75px";
  const editHeader = document.getElementById("edit-mode");
  editHeader.style.display = "flex";
  const filter = document.getElementById("filter");
  filter.style.display = "none";
  const portfolio = document.getElementById("portfolio");
  portfolio.getElementsByTagName("div")[0].id = "modify-portfolio";
  portfolio.getElementsByTagName("span")[0].style.display = "block";

  // replace login by logout and onclick remove token from local storage
  const login = document.getElementById("login");
  login.textContent = "logout";
  login.href = "#";
  login.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
  document.getElementById("modifier").addEventListener("click", () => {
    modalGalerie();
  });
}

function getImages() {
  const images = [];
  const portfolioItems =
    portfolio.getElementsByClassName("gallery")[0].children;
  for (let i = 0; i < portfolioItems.length; i++) {
    images.push(portfolioItems[i].getElementsByTagName("img")[0].src);
  }
  return images;
}

function removeModal(modal) {
  document.body.removeChild(modal);
  document.body.style.overflow = "auto";
}

function modalGalerie() {
  document.body.style.overflow = "hidden";
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  const modal = document.createElement("div");
  modal.className = "modal";
  modalOverlay.appendChild(modal);

  const modalButtons = document.createElement("div");
  modalButtons.className = "modal-buttons";
  const modalClose = document.createElement("button");
  modalClose.innerHTML = "&times;"; // Use innerHTML for HTML entities
  modalClose.className = "close-button";
  modalClose.addEventListener("click", () => {
    removeModal(modalOverlay); // Close and remove modal when clicking "x"
  });
  modalButtons.appendChild(modalClose);

  modal.appendChild(modalButtons);

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Galerie photo";
  modalTitle.className = "modal-title";
  modalHeader.appendChild(modalTitle);

  modal.appendChild(modalHeader);

  // Create the photo grid
  const photoGrid = document.createElement("div");
  photoGrid.className = "photo-grid";

  const images = getImages();
  images.forEach((element) => {
    const div = document.createElement("div");
    div.className = "photo-item";
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    deleteButton.addEventListener("click", () => {
      // remove in the modal
      div.remove();
      removeImage(element);
    });

    const img = document.createElement("img");
    img.src = element;
    div.appendChild(img);
    div.appendChild(deleteButton);
    photoGrid.appendChild(div);
  });

  modal.appendChild(photoGrid);

  // Horizontal rule
  const hr = document.createElement("hr");
  modal.appendChild(hr);

  // Add button for adding new images
  const addImage = document.createElement("button");
  addImage.textContent = "Ajouter une photo";
  addImage.className = "add-photo-button";
  addImage.addEventListener("click", () => {
    removeModal(modalOverlay);
    modalAddPhoto();
  });
  modal.appendChild(addImage);

  // Append the modal overlay to the body
  document.body.appendChild(modalOverlay);
}

function removeImage(image) {
  const portfolioItems =
    portfolio.getElementsByClassName("gallery")[0].children;
  for (let i = 0; i < portfolioItems.length; i++) {
    if (portfolioItems[i].getElementsByTagName("img")[0].src === image) {
      portfolioItems[i].remove();
      return;
    }
  }
}

function modalAddPhoto() {
  document.body.style.overflow = "hidden";
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  const modal = document.createElement("div");
  modal.className = "modal";
  modalOverlay.appendChild(modal);

  const modalButtons = document.createElement("div");
  modalButtons.className = "modal-buttons";
  const modalClose = document.createElement("button");
  modalClose.innerHTML = "&times;"; // Use innerHTML for HTML entities
  modalClose.className = "close-button";
  modalClose.addEventListener("click", () => {
    removeModal(modalOverlay); // Close and remove modal when clicking "x"
  });

  const modalBack = document.createElement("button");
  modalBack.innerHTML =
    '<button class="back-button"><i class="fas fa-arrow-left"></i></button>';
  modalBack.className = "back-button";
  modalBack.addEventListener("click", () => {
    removeModal(modalOverlay); // Close and remove modal when clicking "x"
    modalGalerie();
  });
  modalButtons.appendChild(modalBack);
  modalButtons.appendChild(modalClose);

  modal.appendChild(modalButtons);

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Ajout photo";
  modalTitle.className = "modal-title";
  modalHeader.appendChild(modalTitle);

  modal.appendChild(modalHeader);

  const form = document.createElement("form");
  form.className = "form";
  const photoUpload = document.createElement("div");
  photoUpload.className = "photo-upload";
  photoUpload.innerHTML += '<i class="far fa-image"></i>';
  form.appendChild(photoUpload);
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.id = "file";
  inputFile.name = "file";
  inputFile.accept = "image/*";
  inputFile.required = true;
  inputFile.style.display = "none";

  inputFile.addEventListener("change", (event) => {
    // if there is a file, we display it
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = document.createElement("img");
        photo.src = e.target.result;

        photo.addEventListener("click", () => {
          inputFile.click();
        });

        photoUpload.innerHTML = "";
        photoUpload.appendChild(photo);
      };
      reader.readAsDataURL(file);
    }
  });

  const uploadButton = document.createElement("button");
  uploadButton.textContent = "+ Ajouter photo";
  uploadButton.type = "button";
  uploadButton.className = "upload-button";

  uploadButton.addEventListener("click", () => {
    inputFile.click();
  });
  photoUpload.appendChild(uploadButton);
  const uploadText = document.createElement("p");
  uploadText.innerText = "jpg, png : 4mo max";
  uploadText.className = "file-info";
  photoUpload.appendChild(uploadText);

  modal.appendChild(form);

  const formGroup = document.createElement("div");
  formGroup.className = "form-group";

  const titre = formGroup.cloneNode(true);
  const label = document.createElement("label");
  label.textContent = "Titre";
  label.for = "title";
  titre.appendChild(label);
  const input = document.createElement("input");
  input.type = "text";
  input.id = "title";
  input.name = "title";
  input.required = true;
  titre.appendChild(input);
  form.appendChild(titre);

  const category = formGroup.cloneNode(true);
  const labelCategory = document.createElement("label");
  labelCategory.for = "category";
  labelCategory.textContent = "Catégorie";
  category.appendChild(labelCategory);
  const select = document.createElement("select");
  select.id = "category";
  select.name = "category";
  select.required = true;
  const option = document.createElement("option");
  option.value = "";
  option.disabled = true;
  option.selected = true;
  select.appendChild(option);
  fetch("http://localhost:5678/api/categories").then((response) => {
    response.json().then((categories) => {
      categories.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.name;
        option.text = element.name;
        select.appendChild(option);
      });
    });
  });

  category.appendChild(select);
  form.appendChild(category);

  // Horizontal rule
  const hr = document.createElement("hr");
  modal.appendChild(hr);

  // Add button for adding new images
  const addImage = document.createElement("button");
  addImage.textContent = "Valider";
  addImage.className = "validate-photo-button";

  addImage.addEventListener("click", () => {
    if (!inputFile.files.length || !input.value || !select.value) {
      return;
    }
    addImageToGallery(inputFile.files[0], input.value, select.value);
    removeModal(modalOverlay);
  });
  modal.appendChild(addImage);

  // Append the modal overlay to the body
  document.body.appendChild(modalOverlay);
}

function addImageToGallery(file, title, category) {
  document.getElementsByClassName("gallery")[0].appendChild(
    generatePortfolio({
      src: URL.createObjectURL(file),
      alt: title,
      caption: title,
      category: category,
    })
  );
}
