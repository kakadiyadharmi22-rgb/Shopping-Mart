const products = [
    {id:1,name:"Wireless Headphones",category:"Electronics",price:1499,emoji:"🎧",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"},
    {id:2,name:"Running Sneakers",category:"Fashion",price:1999,emoji:"👟",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"},
    {id:3,name:"Fresh Grocery Box",category:"Grocery",price:499,emoji:"🥬",image:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"},
    {id:4,name:"Skincare Essentials",category:"Beauty",price:799,emoji:"🧴",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80"},
    {id:5,name:"Smart Watch",category:"Electronics",price:2499,emoji:"⌚",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"},
    {id:6,name:"Casual T-Shirt",category:"Fashion",price:599,emoji:"👕",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"},
    {id:7,name:"Fresh Fruit Basket",category:"Grocery",price:299,emoji:"🍎",image:"https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80"},
    {id:8,name:"Beauty Kit",category:"Beauty",price:999,emoji:"💄",image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"},
    {id:9,name:"Portable Speaker",category:"Electronics",price:1299,emoji:"🔊",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"},
    {id:10,name:"Classic Backpack",category:"Fashion",price:899,emoji:"🎒",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"},
    {id:11,name:"Organic Vegetables",category:"Grocery",price:249,emoji:"🥦",image:"https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80"},
    {id:12,name:"Daily Face Cream",category:"Beauty",price:449,emoji:"🧴",image:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=600&q=80"},
    {id:13,name:"Bluetooth Earbuds",category:"Electronics",price:1099,emoji:"🎵",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=80"},
    {id:14,name:"Everyday Hoodie",category:"Fashion",price:1199,emoji:"🧥",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"},
    {id:15,name:"Healthy Snack Box",category:"Grocery",price:349,emoji:"🥜",image:"https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=600&q=80"},
    {id:16,name:"Lip Care Set",category:"Beauty",price:299,emoji:"💋",image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"}
   ];
   
   let cart = readStorage("shoppingMartCart", []);
   let wishlist = readStorage("shoppingMartWishlist", []);
   let currentPage = 1;
   const pageSize = 8;
   
   function readStorage(key, fallback) {
     try {
       const value = JSON.parse(localStorage.getItem(key));
       return value ?? fallback;
     } catch (e) {
       return fallback;
     }
   }
   
   function saveStorage() {
     try {
       localStorage.setItem("shoppingMartCart", JSON.stringify(cart));
       localStorage.setItem("shoppingMartWishlist", JSON.stringify(wishlist));
     } catch (e) {}
   }
   
   function money(value) {
     return "₹" + value.toLocaleString("en-IN");
   }
   
   function productCard(p) {
     const liked = wishlist.includes(p.id);
     return `
       <article class="product-card">
         <div class="product-image">
           <img src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.onerror=null;this.src='https://placehold.co/500x400/f0eaff/4d27c7?text=${encodeURIComponent(p.name)}'">
           <button class="heart ${liked ? "liked" : ""}" aria-label="Add to wishlist"
             onclick="toggleWish(${p.id})">${liked ? "♥" : "♡"}</button>
         </div>
         <div class="product-info">
           <span class="tag">${p.category}</span>
           <h3>${p.name}</h3>
           <div class="price">${money(p.price)}</div>
           <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart +</button>
         </div>
       </article>`;
   }
   
   function renderFeatured() {
     const target = document.getElementById("featuredProducts");
     if (target) target.innerHTML = products.slice(0, 4).map(productCard).join("");
   }
   
   function renderShop() {
     const grid = document.getElementById("productGrid");
     if (!grid) return;
   
     const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
     const category = document.getElementById("categoryFilter")?.value || "All";
     const sort = document.getElementById("sortFilter")?.value || "default";
   
     let filtered = products.filter(p =>
       p.name.toLowerCase().includes(search) &&
       (category === "All" || p.category === category)
     );
   
     if (sort === "low") filtered.sort((a,b) => a.price - b.price);
     if (sort === "high") filtered.sort((a,b) => b.price - a.price);
   
     const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
     currentPage = Math.min(currentPage, pages);
     const start = (currentPage - 1) * pageSize;
     const visible = filtered.slice(start, start + pageSize);
   
     grid.innerHTML = visible.length
       ? visible.map(productCard).join("")
       : '<p class="empty">No products found. Try another search.</p>';
   
     const pagination = document.getElementById("pagination");
     pagination.innerHTML = "";
     if (pages > 1) {
       for (let i = 1; i <= pages; i++) {
         const button = document.createElement("button");
         button.textContent = i;
         if (i === currentPage) button.classList.add("active");
         button.onclick = () => {
           currentPage = i;
           renderShop();
           window.scrollTo({top: 250, behavior: "smooth"});
         };
         pagination.appendChild(button);
       }
     }
   
     document.getElementById("resultCount").textContent =
       `Showing ${filtered.length ? start + 1 : 0}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length} products`;
   }
   
   function chooseCategory(category, button) {
     document.getElementById("categoryFilter").value = category;
     document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
     button.classList.add("active");
     currentPage = 1;
     renderShop();
   }
   
   function toggleWish(id) {
     wishlist = wishlist.includes(id)
       ? wishlist.filter(x => x !== id)
       : [...wishlist, id];
     saveStorage();
     renderShop();
     renderFeatured();
   }
   
   function addToCart(id) {
     const item = cart.find(x => x.id === id);
     if (item) item.qty++;
     else cart.push({id, qty:1});
     saveStorage();
     updateCartCount();
     showToast("Added to your cart!");
   }
   
   function updateCartCount() {
     const count = cart.reduce((sum, item) => sum + item.qty, 0);
     document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
   }
   
   function showCart() {
     const modal = document.getElementById("cartModal");
     if (!modal) return;
     const list = document.getElementById("cartItems");
   
     if (!cart.length) {
       list.innerHTML = '<p class="empty">Your cart is empty. Explore our shop!</p>';
     } else {
       list.innerHTML = cart.map(item => {
         const p = products.find(x => x.id === item.id);
         if (!p) return "";
         return `<div class="cart-row">
           <img src="${p.image}" alt="${p.name}">
           <div class="cart-details"><b>${p.name}</b><small>${money(p.price)} each</small>
             <button onclick="changeQty(${p.id},-1)">−</button>
             <span> ${item.qty} </span>
             <button onclick="changeQty(${p.id},1)">+</button>
           </div>
           <b>${money(p.price * item.qty)}</b>
           <button aria-label="Remove item" onclick="removeItem(${p.id})">✕</button>
         </div>`;
       }).join("");
     }
   
     document.getElementById("cartTotal").textContent =
       "Total: " + money(cart.reduce((sum,item) => {
         const p = products.find(x => x.id === item.id);
         return sum + (p ? p.price * item.qty : 0);
       }, 0));
   
     modal.classList.add("open");
   }
   
   function hideCart() {
     document.getElementById("cartModal")?.classList.remove("open");
   }
   
   function changeQty(id, change) {
     const item = cart.find(x => x.id === id);
     if (!item) return;
     item.qty += change;
     if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
     saveStorage();
     updateCartCount();
     showCart();
   }
   
   function removeItem(id) {
     cart = cart.filter(x => x.id !== id);
     saveStorage();
     updateCartCount();
     showCart();
   }
   
   function checkout() {
     if (!cart.length) {
       alert("Your cart is empty!");
       return;
     }
     alert("This is a demo checkout. No payment has been taken.");
   }
   
   function sendContact(event) {
     event.preventDefault();
     const name = document.getElementById("contactName").value.trim();
     const notice = document.getElementById("contactNotice");
     notice.textContent = `Thank you, ${name}! This demo form does not send an email yet.`;
     event.target.reset();
   }
   
   function showToast(message) {
     let toast = document.getElementById("shopToast");
     if (!toast) {
       toast = document.createElement("div");
       toast.id = "shopToast";
       toast.style.cssText = "position:fixed;bottom:25px;right:25px;z-index:50;background:#211c4b;color:white;padding:13px 20px;border-radius:12px;box-shadow:0 8px 25px #0002";
       document.body.appendChild(toast);
     }
     toast.textContent = message;
     toast.style.display = "block";
     clearTimeout(window.shopToastTimeout);
     window.shopToastTimeout = setTimeout(() => toast.style.display = "none", 2000);
   }
   
   document.addEventListener("DOMContentLoaded", () => {
     const params = new URLSearchParams(location.search);
     const requestedCategory = params.get("category");
     if (requestedCategory && document.getElementById("categoryFilter")) {
       document.getElementById("categoryFilter").value = requestedCategory;
       const matching = [...document.querySelectorAll(".filter")].find(b => b.textContent.trim() === requestedCategory);
       if (matching) chooseCategory(requestedCategory, matching);
     }
   
     renderFeatured();
     renderShop();
     updateCartCount();
   });