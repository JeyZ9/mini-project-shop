// ประกาศตัวแปร cart เป็น Object ว่างใช้เก็บข้อมูลสินค้าในรถเข็นเริ่มต้น
const cart = {};

// เพิ่มสินค้าไปในรถเข็น
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    const price = parseFloat(button.getAttribute("data-price"));
    if (!cart[productId]) {
      cart[productId] = { quantity: 1, price: price };
    } else {
      cart[productId].quantity++;
    }
    updateCartDisplay();
  });
});

// อัปเดตการแสดงผลของรถเข็น
function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";

  let totalPrice = 0;

  // สร้างตารางเพื่อแสดงข้อมูลในรถเข็น
  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  // สร้างหัวข้อของตาราง
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Product", "Quantity", "Price", "Total", "Actions"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // สร้างเนื้อหาของตาราง
  const tbody = document.createElement("tbody");

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    const tr = document.createElement("tr");

    const productNameCell = document.createElement("td");
    productNameCell.textContent = `${productId}`;
    tr.appendChild(productNameCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
    tr.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `$${item.price}`;
    tr.appendChild(priceCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `$${itemTotalPrice}`;
    tr.appendChild(totalCell);

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add("btn", "btn-danger", "delete-product");
    deleteButton.setAttribute("data-product-id", productId);
    deleteButton.addEventListener("click", () => {
      delete cart[productId];
      updateCartDisplay();
    });
    actionsCell.appendChild(deleteButton);
    tr.appendChild(actionsCell);

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  cartElement.appendChild(table);

  if (Object.keys(cart).length === 0) {
    cartElement.innerHTML = "<p>No items in cart.</p>";
  } else {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total Price: ${totalPrice}฿`;
    cartElement.appendChild(totalPriceElement);
  }
}

// เมื่อกดปุ่ม Print Receipt
document.getElementById("printCart").addEventListener("click", () => {
  printReceipt("Thank you!", generateCartReceipt());
});

// ฟังก์ชันพิมพ์ใบเสร็จ
function printReceipt(title, content) {
  const printWindow = window.open("1", "_blank");
  printWindow.document.write(
    `<html><head><title>${title}</title></head><body>${content}</body></html>`
  );
  printWindow.document.close();
  printWindow.print();
}

// ฟังก์ชันสร้างเนื้อหาของใบเสร็จ
function generateCartReceipt() {
  let receiptContent = `
    <style>
      @page { size: 100mm 100mm; }
      body { width: 100mm; height: 100mm; margin: 0; padding: 1px; font-family: Arial, sans-serif; }
      h2 { text-align: center; margin-bottom: 10px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
      th, td { border: 1px solid #ddd; padding: 5px; text-align: left; }
      th { background-color: #f2f2f2; }
    </style>
    <p>Uncle Book</p>
    <h2>Cart Receipt</h2>
    <table>
      <thead>
        <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
      </thead>
      <tbody>`;

  let totalPrice = 0;

  // เพิ่มสินค้าในใบเสร็จ
  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;

    receiptContent += `
      <tr>
        <td>${productId}</td>
        <td>${item.quantity}</td>
        <td>$${item.price}</td>
        <td>$${itemTotalPrice}</td>
      </tr>`;

    totalPrice += itemTotalPrice;
  }

  receiptContent += `</tbody></table><p>Total Price: ${totalPrice}฿</p><p>คุณ Kays Tel.088-888-8888</p>`;

  // เพิ่ม QR Code
  receiptContent += `<canvas id="qrcode"></canvas>`;

  // ใส่ใบเสร็จลงใน div ที่มี id receipt-container
  const receiptContainer = document.getElementById("receipt-container");
  if (receiptContainer) {
    receiptContainer.innerHTML = receiptContent;

    // สร้าง QR Code
    const qrCodeCanvas = document.getElementById("qrcode");
    if (qrCodeCanvas) {
      QRCode.toCanvas(qrCodeCanvas, "https://www.google.com", function (error) {
        if (error) {
          console.error("Error generating QR code:", error);
        } else {
          console.log("QR code generated!");
        }
      });
    }
  }

  return receiptContent;
}
