document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartSummary = document.getElementById("cart-summary");
    const checkoutButton = document.getElementById("checkout-button");
    const addToCartButtons = document.querySelectorAll(".product button");
    const messageContainer = document.getElementById("message"); // Message container
    const orderModal = document.getElementById("order-modal");
    const closeButton = document.querySelector(".close-button");
    const orderForm = document.getElementById("order-form");

    const cart = [];
    
    // Function to update the cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = ""; // Clear the cart container
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is currently empty.</p>";
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");

                // Cart item structure with image, name, price, quantity, and remove button
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Price: ₱${item.price.toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <button class="remove-item" data-id="${item.id}">Remove One</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price * item.quantity; // Calculate total based on quantity
            });
        }

        cartSummary.querySelector("p").textContent = `Total: ₱${total.toFixed(2)}`;
    }

    // Function to show a message
    function showMessage(message) {
        messageContainer.textContent = message;
        messageContainer.style.display = "block";
        setTimeout(() => {
            messageContainer.style.display = "none";
        }, 3000); // Hide after 3 seconds
    }

    // Event listener for Add to Cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const productElement = e.target.closest(".product");
            const productId = productElement.id;
            const productName = productElement.querySelector("h3").textContent;
            const productPrice = parseFloat(productElement.querySelector("p").textContent); // Convert to float
            const productImage = productElement.querySelector("img").src;

            // Check if item is already in the cart
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                // Increment quantity if item already exists
                existingItem.quantity += 1;
            } else {
                // Add new item to the cart
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice, // Store as a number
                    image: productImage,
                    quantity: 1 // Initialize quantity
                });
            }
            
            updateCartUI(); // Update the cart UI
            showMessage(`${productName} has been added to your cart!`); // Show message
        });
    });

    // Event listener for Remove buttons
    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const itemId = e.target.dataset.id;
            const item = cart.find(item => item.id === itemId);
            if (item) {
                // Decrease quantity by one
                if (item.quantity > 1) {
                    item.quantity -= 1; // Decrement quantity
                } else {
                    // If quantity is 1, remove the item from the cart
                    const itemIndex = cart.findIndex(item => item.id === itemId);
                    if (itemIndex > -1) {
                        cart.splice(itemIndex, 1); // Remove item from the cart
                    }
                }
                updateCartUI(); // Update the cart UI
            }
        }
    });

    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add some items before checking out.");
        } else {
            // Initialize total amount
            let total = 0;
    
            // Create a summary of the items with name and price only
            const orderDetails = cart.map(item => {
                const itemTotal = item.price * item.quantity; // Calculate item total
                total += itemTotal; // Add to total
                return `
                    <div class="order-item">
                        <div>
                            <h4>${item.name}</h4>
                            <p>Amount: ₱${itemTotal.toFixed(2)}</p>
                        </div>
                    </div>
                `;
            }).join(''); // Create HTML content for each item
    
            // Display the order summary (item names and total amount) in the modal
            document.getElementById('order-details').innerHTML = orderDetails;
            document.getElementById('order-details').innerHTML += `<h3>Total: ₱${total.toFixed(2)}</h3>`; // Display total
            document.getElementById('order-modal').style.display = 'block'; // Show the modal
        }
    });
    
    document.getElementById('order-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
    
        const name = document.getElementById('name-order').value;
        const email = document.getElementById('email-order').value;
        const address = document.getElementById('address-order').value;
        const contact = document.getElementById('contact-order').value;
    
        let total = 0; // Initialize the total variable
    
        // Create a summary of the items with name, quantity, and price, each in a new <div> tag
        let orderSummary = cart.map(item => {
            const itemTotal = item.price * item.quantity; // Calculate item total
            total += itemTotal; // Add to total
            return `<p>${item.name} (Quantity: ${item.quantity}) - ₱${itemTotal.toFixed(2)}</p>`; // Use <p> for each item
        }).join(''); // No separator, so items are added directly together
    
        // Send order summary using emailjs
        emailjs.send("service_7jggyu2", "template_t8y8lq9", {
            name: name,
            email: email,
            address: address,
            contact: contact,
            orderDetails: orderSummary, // Send HTML content
            total: `${total.toFixed(2)}`, // Include total amount
        })
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Order submitted successfully!');
        }, function(error) {
            console.log('FAILED...', error);
            alert('Failed to submit order. Please try again.');
        });
    });
    
    
    
    
    

    // Close the modal when the user clicks on <span> (x)
    closeButton.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener('click', (event) => {
        if (event.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });

    // Update cart UI
    updateCartUI(); // Initialize the cart UI
});

 // CONtact function
function sendMail(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form fields
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    // Check if any field is empty
    if (name === "" || email === "" || message === "") {
        alert("Please fill in all fields before submitting.");
        return; // Exit the function if any field is empty
    }

    // Create the params object
    var params = {
        name: name,
        email: email,
        message: message,
    };

    const serviceID = "service_oenbbue";
    const templateID = "template_px0ftns";

    // Send the email
    emailjs.send(serviceID, templateID, params)
    .then(
        res => {
            // Clear the form fields
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
            console.log(res);
            alert("Message Sent Successfully");
        }
    ).catch((err) => console.log(err));
}

document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenu = document.createElement('div');

   
    mobileMenu.id = 'mobile-navigation';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-overlay">z  
            <nav class="mobile-menu-content">
                <button class="close-menu">&times;</button>
                <ul>
                    <li><a href="#home" data-section="home">Home</a></li>
                    <li><a href="#products" data-section="products">Products</a></li>
                    <li><a href="#about" data-section="about">About</a></li>
                    <li><a href="#contact" data-section="contact">Contact</a></li>
                    <li><a href="#cart" data-section="cart">Your Cart</a></li>
                </ul>
            </nav>
        </div>
    `;

  
    document.body.appendChild(mobileMenu);

    
    menuIcon.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    
    function closeMenu() {
        mobileMenu.classList.remove('active'); 
    }

   
    mobileMenu.querySelector('.close-menu').addEventListener('click', closeMenu);

    
    mobileMenu.querySelector('.mobile-menu-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeMenu();
        }
    });

    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});
