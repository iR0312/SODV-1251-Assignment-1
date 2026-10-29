const menu = [
    { name: "Fresh garden salad", price: 8.99 },
    { name: "Soup of the day", price: 6.99 },
    { name: "Pasta with herbs", price: 14.99 },
    { name: "Freshly made sandwich", price: 9.99 },
    { name: "Vegetable pizza", price: 15.99 },
    { name: "Roasted vegetable bowl", price: 12.99 },
    { name: "Seasonal skillet", price: 13.99 },
    { name: "Falafel wrap", price: 10.99 },
    { name: "House dessert", price: 5.99 },
    { name: "Fresh fruit plate", price: 4.99 }
];

const menuItems = document.getElementById("menuItems");
const orderForm = document.getElementById("orderForm");
const orderTotal = document.getElementById("orderTotal");
const message = document.getElementById("message");
const receipt = document.getElementById("receipt");
const voucherInput = document.getElementById("voucher");
const voucherMessage = document.getElementById("voucherMessage");
const applyVoucher = document.getElementById("applyVoucher");

let discount = 0;
let voucherApplied = false;

function displayMenu() {
    menuItems.innerHTML = "";

    menu.forEach(function (item, index) {
        const menuItem = document.createElement("div");
        menuItem.className = "menu-item";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = "$" + item.price.toFixed(2);

        const label = document.createElement("label");
        label.htmlFor = "quantity" + index;
        label.textContent = "Quantity (0–20): ";

        const quantity = document.createElement("input");
        quantity.type = "number";
        quantity.id = "quantity" + index;
        quantity.min = "0";
        quantity.max = "20";
        quantity.step = "1";
        quantity.value = "0";
        quantity.dataset.index = index;

        quantity.addEventListener("input", function () {
            updateTotal();
            receipt.style.display = "none";
            message.textContent = "";
        });

        menuItem.appendChild(name);
        menuItem.appendChild(price);
        menuItem.appendChild(label);
        label.appendChild(quantity);

        menuItems.appendChild(menuItem);
    });
}

function getOrder() {
    const order = [];
    let total = 0;

    for (let i = 0; i < menu.length; i++) {
        const quantityInput = document.getElementById("quantity" + i);
        const quantity = quantityInput.valueAsNumber;

        if (
            quantityInput.value === "" ||
            !Number.isInteger(quantity) ||
            quantity < 0 ||
            quantity > 20
        ) {
            return null;
        }

        if (quantity > 0) {
            const subtotal = quantity * menu[i].price;

            order.push({
                name: menu[i].name,
                price: menu[i].price,
                quantity: quantity,
                subtotal: subtotal
            });

            total += subtotal;
        }
    }

    return { items: order, total: total };
}

function calculateTotals(subtotal) {
    let discountAmount = 0;

    if (voucherApplied) {
        if (discount === 0.10) {
            discountAmount = subtotal * 0.10;
        } else if (discount === 5) {
            discountAmount = Math.min(5, subtotal);
        }
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    const discountedSubtotal = subtotal - discountAmount;
    const gst = Math.round(discountedSubtotal * 0.05 * 100) / 100;
    const finalTotal = discountedSubtotal + gst;

    return {
        discountAmount,
        discountedSubtotal,
        gst,
        finalTotal
    };
}

function updateTotal() {
    const order = getOrder();

    if (order === null) {
        orderTotal.textContent =
            "Order total: Please enter quantities from 0 to 20.";
        return;
    }

    const totals = calculateTotals(order.total);

    orderTotal.textContent =
        "Order total: $" + totals.finalTotal.toFixed(2);
}

function generateReceipt(order) {
    receipt.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Order Receipt";
    receipt.appendChild(heading);

    order.items.forEach(function (item) {
        const line = document.createElement("p");
        line.textContent =
            item.name + ": " +
            item.quantity + " × $" +
            item.price.toFixed(2) + " = $" +
            item.subtotal.toFixed(2);

        receipt.appendChild(line);
    });

    const totals = calculateTotals(order.total);

    const subtotalLine = document.createElement("p");
    subtotalLine.textContent = "Subtotal: $" + order.total.toFixed(2);
    receipt.appendChild(subtotalLine);

    if (voucherApplied) {
        const discountLine = document.createElement("p");
        discountLine.textContent =
            "Voucher discount: -$" + totals.discountAmount.toFixed(2);
        receipt.appendChild(discountLine);
    }

    const discountedSubtotalLine = document.createElement("p");
    discountedSubtotalLine.textContent =
        "Subtotal after discount: $" +
        totals.discountedSubtotal.toFixed(2);
    receipt.appendChild(discountedSubtotalLine);

    const gstLine = document.createElement("p");
    gstLine.textContent = "GST (5%): $" + totals.gst.toFixed(2);
    receipt.appendChild(gstLine);

    const totalLine = document.createElement("p");
    totalLine.textContent =
        "Final Total: $" + totals.finalTotal.toFixed(2);
    receipt.appendChild(totalLine);

    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.textContent = "Download Receipt as PDF";
    downloadButton.className = "button primary";

    downloadButton.addEventListener("click", downloadReceipt);

    receipt.appendChild(downloadButton);

    receipt.style.display = "block";
}

applyVoucher.addEventListener("click", function () {
    const voucher = voucherInput.value.trim().toUpperCase();

    if (voucher === "SAVE10") {
        discount = 0.10;
        voucherApplied = true;
        voucherMessage.textContent = "SAVE10 applied: 10% off.";
    } else if (voucher === "SAVE5") {
        discount = 5;
        voucherApplied = true;
        voucherMessage.textContent = "SAVE5 applied: $5 off.";
    } else {
        discount = 0;
        voucherApplied = false;
        voucherMessage.textContent = "Invalid voucher code.";
    }

    receipt.style.display = "none";
    updateTotal();
});

function downloadReceipt() {
    window.print();
}

orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const order = getOrder();

    if (order === null) {
        message.textContent =
            "Please enter whole-number quantities from 0 to 20.";
        receipt.style.display = "none";
        return;
    }

    if (order.items.length === 0) {
        message.textContent =
            "Please select at least one menu item.";
        receipt.style.display = "none";
        return;
    }

    message.textContent = "";
    generateReceipt(order);
});

displayMenu();
updateTotal();