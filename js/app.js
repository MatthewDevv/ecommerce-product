// Mobile menu
const burger = document.querySelector(".burger");
const burgerImg = burger.querySelector("img");
const burgerIcon = burgerImg.src;
const menu = document.querySelector(".nav-menu");
const bodyOverlay = document.querySelector(".body-overlay");

function toggleMenu() {
  window.addEventListener("resize", removeOverlay);
  bodyOverlay.onclick = () => toggleMenu();
  menu.classList.toggle("active");
  bodyOverlay.classList.toggle("active");
  menu.classList.contains("active")
    ? (burgerImg.src = "images/icon-close.svg")
    : (burgerImg.src = burgerIcon);
}
burger.addEventListener("click", toggleMenu);

function removeOverlay() {
  if (innerWidth >= 992) {
    bodyOverlay.classList.remove("active");
    window.removeEventListener("resize", removeOverlay);
  }
}

// Carousel
const carouselBtns = document.querySelectorAll(".carousel-btn");

function carouselBtnAction(btn, newThumbnails) {
  const offset = btn.dataset.carouselBtn === "next" ? 1 : -1;
  const slides = btn.closest(".carousel").querySelector(".slides");
  const activeSlide = slides.querySelector(".active");
  let newIndex = [...slides.children].indexOf(activeSlide) + offset;
  if (newIndex < 0) newIndex = slides.children.length - 1;
  if (newIndex >= slides.children.length) newIndex = 0;
  activeSlide.classList.remove("active");
  slides.children[newIndex].classList.add("active");

  if (newThumbnails) {
    newThumbnails.forEach((thumbnail) => {
      thumbnail.classList.remove("active");
    });
    newThumbnails[newIndex].classList.add("active");
  }
}

carouselBtns.forEach((btn) =>
  btn.addEventListener("click", () => carouselBtnAction(btn))
);

// Basket collapse
const cartBtn = document.querySelector(".cart");
const cartCollapse = document.querySelector(".cart-collapse");

function cartBtnAction() {
  cartCollapse.classList.toggle("active");
  window.addEventListener("click", cartDissapear);
  if (!cartCollapse.classList.contains("active"))
    window.removeEventListener("click", cartDissapear);
}

function cartDissapear(e) {
  const target = e.target;
  if (
    target.id != "cartIcon" &&
    cartCollapse.classList.contains("active") &&
    !cartCollapse.contains(target)
  ) {
    cartCollapse.classList.remove("active");
    window.removeEventListener("click", cartDissapear);
  }
}

cartBtn.addEventListener("click", () => cartBtnAction());

// Product quantity action
const quantity = document.querySelector(".quantity");
let productQuantity = 0;
quantity.textContent = productQuantity;

const removeProduct = document.querySelector(".remove_product");
const addProduct = document.querySelector(".add_product");

removeProduct.addEventListener("click", () => {
  if (productQuantity > 0) productQuantity--;
  quantity.textContent = productQuantity;
});

addProduct.addEventListener("click", () => {
  productQuantity++;
  quantity.textContent = productQuantity;
});

// Product add to basket action
const addToBasketBtn = document.querySelector(".add-to-basket-btn");
const productName = document.getElementById("product-name").textContent;
const productActualPrice = document.getElementById(
  "product-actual-price"
).textContent;
const productsCartSummary = document.querySelector(".products-cart-summary");
const emptyCartText = document.querySelector(".empty-cart");

function addToBasket() {
  if (productQuantity > 0) {
    emptyCartText.style.display = "none";
    cartBtn.setAttribute("cart-counter", productQuantity);
    const productSummary = document.createElement("div");
    productSummary.className = "product-summary";
    productSummary.innerHTML = `
    <div class="product-cart-desc">
    <img
      src="images/image-product-1-thumbnail.jpg"
      alt="Wybrany produkt"
    />
    <div>
      <p class="cart-product-name">${productName}</p>
      <p class="cart-product-price">
        ${productActualPrice} PLN <span class="cart-product-quantity"> x${productQuantity}</span
        ><span class="cart-product-price-sum"> ${
          productActualPrice * productQuantity
        } PLN</span>
      </p>
    </div>
    <button class="delete-product-from-cart">
      <img src="images/icon-delete.svg" alt="Usuń produkt z koszyka" />
    </button>
    </div>
<button class="checkout-btn">Kasa</button>
`;
    productsCartSummary.appendChild(productSummary);
    // Delete one product from cart
    const deleteBtn = document.querySelector(".delete-product-from-cart");

    function deleteProduct() {
      productQuantity--;

      if (productQuantity > 0) {
        cartBtn.setAttribute("cart-counter", productQuantity);
        productSummary.querySelector(".cart-product-quantity").textContent =
          "x" + productQuantity;
        productSummary.querySelector(".cart-product-price-sum").textContent =
          productActualPrice * productQuantity + " PLN";
      } else {
        cartBtn.setAttribute("cart-counter", "");
        productSummary.remove();
        emptyCartText.style.display = "block";
      }
    }
    deleteBtn.addEventListener("click", () => deleteProduct());
  }
}

addToBasketBtn.addEventListener("click", () => addToBasket());

// Lightbox
const productBigPhoto = document.querySelector(".product-big-photo");
const productThumbnails = document.querySelector(".product-thumbnails");

function showLightbox() {
  window.addEventListener("resize", spyWidth);
  document.body.style.overflow = "hidden";
  const carousel = document.createElement("div");
  carousel.classList.add("carousel", "active");
  carousel.innerHTML = document.querySelector(".carousel").innerHTML;
  const lightboxClose = carousel.querySelector(".lightbox-close");
  lightboxClose.classList.add("active");
  const controlBtns = carousel.querySelectorAll(".carousel-btn");
  controlBtns.forEach((btn) =>
    btn.addEventListener("click", () => carouselBtnAction(btn, newThumbnails))
  );

  // create modal container
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("body-overlay");
  modalContainer.appendChild(carousel);

  const newProductThumbnails = document.createElement("div");
  newProductThumbnails.innerHTML = productThumbnails.innerHTML;
  newProductThumbnails.classList.add("product-thumbnails", "active");
  modalContainer.appendChild(newProductThumbnails);
  newThumbnails = [...newProductThumbnails.children];
  thumbnailsAction(newThumbnails, [
    ...carousel.querySelector(".slides").children,
  ]);

  document.body.appendChild(modalContainer);
  window.setTimeout(() => {
    modalContainer.classList.add("active");
  }, 10);

  // Remove modal
  modalContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("body-overlay")) {
      removeModal();
    }
  });

  lightboxClose.addEventListener("click", () => removeModal());

  function removeModal() {
    document.body.style.overflow = "auto";
    modalContainer.classList.remove("active");
    window.setTimeout(() => {
      lightboxClose.classList.remove("active");
      modalContainer.remove();
    }, 300);
  }

  function spyWidth() {
    console.log("1");
    if (innerWidth <= 993) {
      window.removeEventListener("resize", spyWidth);
      removeModal();
    }
  }
}

productBigPhoto.addEventListener("click", () => showLightbox());

// Thumbnails listeners

function thumbnailsAction(
  thumbnails = [...productThumbnails.children],
  slides = [...document.querySelector(".slides").children]
) {
  let thumbnailIndex = 0;

  thumbnails.forEach((el) =>
    el.addEventListener("click", (e) => {
      thumbnails.forEach((el) => el.classList.remove("active"));
      e.target.classList.add("active");
      if (arguments.length === 0)
        productBigPhoto.src = e.target.src.replace("-thumbnail", "");
      else {
        thumbnailIndex = thumbnails.indexOf(e.target);
        slides.forEach((slide) => slide.classList.remove("active"));
        slides[thumbnailIndex].classList.add("active");
      }
    })
  );
}

window.onload = () => {
  thumbnailsAction();
};
