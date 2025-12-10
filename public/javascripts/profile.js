// Profile Page JavaScript

let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    setupEditButton();
    setupSaveButton();
    setupCancelButton();
    setupAvatarEdit();
});

// Setup Edit Profile Button
function setupEditButton() {
    const editBtn = document.getElementById('editProfileBtn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            toggleEditMode();
        });
    }
}

// Setup Save Button
function setupSaveButton() {
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveProfile();
        });
    }
}

// Setup Cancel Button
function setupCancelButton() {
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            cancelEdit();
        });
    }
}

// Toggle Edit Mode
function toggleEditMode() {
    isEditMode = !isEditMode;
    
    const inputs = document.querySelectorAll('.info-item input, .info-item select, .info-item textarea');
    const saveSection = document.getElementById('saveSection');
    const editBtn = document.getElementById('editProfileBtn');
    
    inputs.forEach(input => {
        if (isEditMode) {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.style.background = 'white';
        } else {
            input.setAttribute('readonly', 'readonly');
            if (input.tagName === 'SELECT') {
                input.setAttribute('disabled', 'disabled');
            }
            input.style.background = '#f7fafc';
        }
    });
    
    if (isEditMode) {
        saveSection.style.display = 'flex';
        editBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
        editBtn.style.background = '#e53e3e';
    } else {
        saveSection.style.display = 'none';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
        editBtn.style.background = '#667eea';
    }
}

// Save Profile
function saveProfile() {
    // In a real application, this would send data to the server
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value,
        emergencyName: document.getElementById('emergencyName').value,
        emergencyRelation: document.getElementById('emergencyRelation').value,
        emergencyPhone: document.getElementById('emergencyPhone').value,
        emergencyEmail: document.getElementById('emergencyEmail').value
    };
    
    console.log('Saving profile data:', formData);
    
    // Show success message
    alert('Profile updated successfully!');
    
    // Exit edit mode
    toggleEditMode();
}

// Cancel Edit
function cancelEdit() {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        // Reload the page to reset all fields
        location.reload();
    }
}

// Setup Avatar Edit
function setupAvatarEdit() {
    const avatarEditBtn = document.getElementById('editAvatarBtn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            // In a real application, this would open a file picker
            alert('Avatar upload functionality would be implemented here.\nYou would be able to select and upload a new profile picture.');
        });
    }
}

// Form validation (optional enhancement)
function validateForm() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number');
        return false;
    }
    
    return true;
}
