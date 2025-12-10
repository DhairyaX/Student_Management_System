// Payments Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupDownloadButton();
    setupYearFilter();
    setupPaymentMethodSelector();
});

// Open Payment Modal
function openPaymentModal(paymentId, amount) {
    const modal = document.getElementById('paymentModal');
    const paymentIdField = document.getElementById('paymentId');
    const paymentAmountField = document.getElementById('paymentAmount');
    
    if (modal && paymentIdField && paymentAmountField) {
        paymentIdField.value = paymentId;
        paymentAmountField.value = '₹' + amount.toLocaleString();
        modal.style.display = 'flex';
    }
}

// Close Payment Modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        resetPaymentForm();
    }
}

// Reset Payment Form
function resetPaymentForm() {
    document.getElementById('paymentForm').reset();
    document.getElementById('cardDetails').style.display = 'none';
    document.getElementById('cardExtra').style.display = 'none';
    document.getElementById('upiDetails').style.display = 'none';
}

// Setup Payment Method Selector
function setupPaymentMethodSelector() {
    const paymentMethod = document.getElementById('paymentMethod');
    if (paymentMethod) {
        paymentMethod.addEventListener('change', function() {
            const method = this.value;
            
            // Hide all payment method fields
            document.getElementById('cardDetails').style.display = 'none';
            document.getElementById('cardExtra').style.display = 'none';
            document.getElementById('upiDetails').style.display = 'none';
            
            // Show relevant fields based on payment method
            if (method === 'card') {
                document.getElementById('cardDetails').style.display = 'block';
                document.getElementById('cardExtra').style.display = 'grid';
            } else if (method === 'upi') {
                document.getElementById('upiDetails').style.display = 'block';
            }
        });
    }
}

// Handle Payment Form Submission
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });
}

// Process Payment
function processPayment() {
    const paymentId = document.getElementById('paymentId').value;
    const amount = document.getElementById('paymentAmount').value;
    const method = document.getElementById('paymentMethod').value;
    
    if (!method) {
        alert('Please select a payment method');
        return;
    }
    
    // Validate payment method specific fields
    if (method === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all card details');
            return;
        }
    } else if (method === 'upi') {
        const upiId = document.getElementById('upiId').value;
        
        if (!upiId) {
            alert('Please enter your UPI ID');
            return;
        }
    }
    
    // Simulate payment processing
    alert('Processing payment...\nPayment ID: ' + paymentId + '\nAmount: ' + amount);
    
    // In a real application, this would send data to the payment gateway
    setTimeout(() => {
        alert('Payment successful!\nTransaction ID: TXN' + Math.floor(Math.random() * 1000000));
        closePaymentModal();
        // Reload page to update payment status
        location.reload();
    }, 2000);
}

// View Payment Details
function viewDetails(paymentId) {
    alert('Viewing details for payment: ' + paymentId + '\n\nIn a real application, this would show detailed payment information.');
}

// Download Receipt
function downloadReceipt(transactionId) {
    alert('Downloading receipt for transaction: ' + transactionId + '\n\nIn a real application, a PDF receipt would be generated and downloaded.');
    console.log('Downloading receipt:', transactionId);
}

// Setup Download Button
function setupDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadStatement();
        });
    }
}

// Download Payment Statement
function downloadStatement() {
    const year = document.getElementById('yearFilter').value;
    alert('Downloading payment statement for ' + year + '\n\nIn a real application, a detailed PDF statement would be generated.');
}

// Setup Year Filter
function setupYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            filterPaymentHistory(this.value);
        });
    }
}

// Filter Payment History
function filterPaymentHistory(year) {
    console.log('Filtering payment history for year:', year);
    // In a real application, this would fetch filtered data from the server
    alert('Showing payment history for ' + year);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target === modal) {
        closePaymentModal();
    }
});

// Format card number input
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

// Format expiry date input
const expiryDateInput = document.getElementById('expiryDate');
if (expiryDateInput) {
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}
