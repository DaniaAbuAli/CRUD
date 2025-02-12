// global variables
const addProd = document.querySelector(".add-product");
const addModal = document.querySelector(".add");
let items = JSON.parse(window.localStorage.getItem("items")) || [];
let id = Number(window.localStorage.getItem("id")) || 1;
const date = new Date();
const currentDate = `${date.getDate()}-${
  date.getMonth() + 1
}-${date.getFullYear()}`;
const deleteAll = document.querySelector(".delete-all");
const cancel = document.querySelector(".cancel");
const close = document.querySelector(".btn-close");
const searchByName = document.querySelector(".search-name");
const searchByCategory = document.querySelector(".search-category");
let searchInput = document.querySelector(".input-group input ");

//local storage
if (window.localStorage.getItem("items")) {
  const storedItems = JSON.parse(window.localStorage.getItem("items"));
  showDataFromLocalStorage(storedItems);
}

//add products
addProd.addEventListener("click", (e) => {
  if (addModal.classList.contains("update")) {
    return; // if update this will not work
  }
  const q = document.querySelector(".quantity");
  q.style.display = "block";
  let productName = document.getElementById("product-name").value.trim();
  let category = document.getElementById("productCategory").value.trim();
  let quantity = document.getElementById("quantity").value.trim();
  let price = document.getElementById("price").value.trim();
  let number = document.getElementById("rating").value.trim();
  id = Number(window.localStorage.getItem("id")) || 1;
  if (
    productName === "" ||
    category === "" ||
    quantity === "" ||
    price === "" ||
    number === ""
  ) {
    deleteInput();
    document.getElementById("quantity").value = "";
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "All fields are required!",
      confirmButtonColor: "#d33",
    });
    return;
  }
  for (let i = 0; i < quantity; i++) {
    const item = {
      id: id++,
      productName: productName,
      category: category,
      price: price,
      rating: rating(number),
      date: currentDate,
    };
    items.push(item);
    window.localStorage.setItem("id", id);
    showData(item);
  }
  window.localStorage.setItem("items", JSON.stringify(items));
  productName = document.getElementById("product-name").value = "";
  category = document.getElementById("productCategory").value = "";
  quantity = document.getElementById("quantity").value = "";
  price = document.getElementById("price").value = "";
  number = document.getElementById("rating").value = "";
});

//functions
function showData(item) {
  const tr = document.createElement("tr");
  tr.classList.add(`id-${item.id}`);
  for (const prop in item) {
    let td = document.createElement("td");
    td.textContent = `${item[prop]}`;
    tr.appendChild(td);
  }
  let td = document.createElement("td");
  td.innerHTML = ` <div class="icons fs-5 d-flex">
     <button class='edit' data-bs-toggle="modal" data-bs-target="#exampleModal">
     <i class="text-warning fa-regular fa-pen-to-square me-3" title="Edit"></i></button>
     <button class="delete"><i class=" text-danger fa-solid fa-trash" title="Delete"></i></button>
     </div>`;
  tr.appendChild(td);
  const tbody = document.querySelector("tbody");
  tbody.appendChild(tr);
}

function rating(number) {
  const start = "⭐";
  let res = "";
  for (let i = 0; i < number; i++) res += start;
  return res;
}
function showDataFromLocalStorage(storedItems) {
  for (let i = 0; i < storedItems.length; i++) {
    showData(storedItems[i]);
  }
}

//delete all products
deleteAll.addEventListener("click", () => {
  if (window.localStorage.getItem("items")) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your products have been deleted.",
          icon: "success",
        });
        window.localStorage.clear();
        window.localStorage.setItem("id", 1);
        const tr = document.querySelectorAll(" tbody tr");
        for (let i = 0; i < tr.length; i++) {
          tr[i].remove();
        }
        items = [];
      }
    });
  }
});

//delete one product
const tbody = document.querySelector("tbody");
tbody.addEventListener("click", (event) => {
  if (event.target && event.target.closest("button.delete")) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your product has been deleted.",
          icon: "success",
        });
        const num = event.target.closest("tr").firstChild.textContent;
        event.target.closest("tr").remove();
        const tr = document.querySelectorAll("tbody tr");
        for (let i = 0; i < tr.length; i++) {
          tr[i].firstChild.textContent = i + 1;
          tr[i].classList = "";
          tr[i].classList.add(`id-${i + 1}`);
        }
        id--;
        window.localStorage.setItem("id", id);
        const products = JSON.parse(window.localStorage.getItem("items"));
        const updatedItems = products.filter((obj) => obj.id !== Number(num));
        for (let i = 0; i < updatedItems.length; i++) {
          updatedItems[i].id = i + 1;
        }
        items = updatedItems;
        window.localStorage.setItem("items", JSON.stringify(updatedItems));
      }
    });
  }
});

//edit product
tbody.addEventListener("click", (e) => {
  if (e.target && e.target.closest("button.edit")) {
    const h5 = document.querySelector(".modal-title");
    addModal.textContent = "Update Product";
    addModal.classList.remove("add");
    addModal.classList.add("update");
    h5.textContent = "Update Product";
    const quantity = document.querySelector(".quantity");
    quantity.classList.add("hide");
    const tr = e.target.closest("tr").classList[0].split("-")[1];
    window.localStorage.setItem("update", tr);
    const obj = items[tr - 1];
    document.getElementById("product-name").value = obj.productName;
    document.getElementById("productCategory").value = obj.category;
    document.getElementById("price").value = obj.price;
    document.getElementById("rating").value = obj.rating.length;
    const q = document.querySelector(".quantity");
    q.style.display = "none";
  }
});
addModal.addEventListener("click", () => {
  if (addModal.classList.contains("update")) {
    update();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Updated successfully",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      customClass: {
        popup: "custom-toast",
      },
    });
    const q = document.querySelector(".quantity");
    q.style.display = "block";
  }
  closeModal();
});

function update() {
  let newProductName = document.getElementById("product-name").value.trim();
  let newCategory = document.getElementById("productCategory").value.trim();
  let newPrice = document.getElementById("price").value.trim();
  let newRating = document.getElementById("rating").value.trim();
  const rowId = Number(window.localStorage.getItem("update"));
  const td = document.querySelectorAll(`.id-${rowId} td`);
  td[1].textContent = `${newProductName}`;
  td[2].textContent = `${newCategory}`;
  td[3].textContent = `${newPrice}`;
  td[4].textContent = `${rating(newRating)}`;
  const obj = items[rowId - 1];
  obj.productName = newProductName;
  obj.category = newCategory;
  obj.rating = rating(newRating);
  obj.price = newPrice;
  window.localStorage.setItem("items", JSON.stringify(items));
  addModal.classList.add("add");
  addModal.classList.remove("update");
  addModal.textContent = "Add Product";
  const h5 = document.querySelector(".modal-title");
  h5.textContent = "Add Product";
  productName = document.getElementById("product-name").value = "";
  category = document.getElementById("productCategory").value = "";
  quantity = document.getElementById("quantity").value = "";
  price = document.getElementById("price").value = "";
  number = document.getElementById("rating").value = "";
}

function closeModal() {
  const modalElement = document.getElementById("exampleModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
}
cancel.addEventListener("click", () => {
  if (addModal.classList.contains("update")) {
    addModal.textContent = "Add Product";
    const h5 = document.querySelector(".modal-title");
    h5.textContent = "Add Product";
    deleteInput();
  }
});
close.addEventListener("click", () => {
  if (addModal.classList.contains("update")) {
    addModal.textContent = "Add Product";
    const h5 = document.querySelector(".modal-title");
    h5.textContent = "Add Product";
    deleteInput();
  }
});
function deleteInput() {
  productName = document.getElementById("product-name").value = "";
  category = document.getElementById("productCategory").value = "";
  price = document.getElementById("price").value = "";
  number = document.getElementById("rating").value = "";
  document.querySelector(".quantity").style.display = "block";
}

// search by name
searchByName.addEventListener("click", () => {
  const allRows = document.querySelectorAll("tbody tr");
  let searchInputValue = searchInput.value.trim();
  for (let i = 0; i < allRows.length; i++) {
    allRows[i].classList.remove("hide");
  }
  for (let i = 0; i < items.length; i++) {
    if (!items[i].productName.startsWith(searchInputValue)) {
      const id = items[i].id;
      const tr = document.querySelector(`.id-${id}`);
      tr.classList.add("hide");
    }
  }
});
searchInput.addEventListener("input", () => {
  const allRows = document.querySelectorAll("tbody tr");
  let searchInputValue = searchInput.value;
  if (searchInputValue === "") {
    for (let i = 0; i < allRows.length; i++) {
      allRows[i].classList.remove("hide");
    }
  }
});

//search by category
searchByCategory.addEventListener("click", () => {
  const allRows = document.querySelectorAll("tbody tr");
  let searchInputValue = searchInput.value.trim();
  for (let i = 0; i < allRows.length; i++) {
    allRows[i].classList.remove("hide");
  }
  for (let i = 0; i < items.length; i++) {
    if (!items[i].category.startsWith(searchInputValue)) {
      const id = items[i].id;
      const tr = document.querySelector(`.id-${id}`);
      tr.classList.add("hide");
    }
  }
});
