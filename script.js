document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registrationForm");
    
    // Add age validation
    const dobInput = document.getElementById("dob");
    
    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    function validateAge() {
        const age = calculateAge(dobInput.value);
        if (age < 13) {
            dobInput.setCustomValidity("You must be at least 13 years old to register");
            return false;
        }
        dobInput.setCustomValidity("");
        return true;
    }

    dobInput.addEventListener("change", validateAge);

    // Add formatting for phone number
    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length >= 4) {
            value = value.slice(0, 4) + '-' + value.slice(4);
        }
        e.target.value = value;
    });

    // Add formatting for CNIC
    const cnicInput = document.getElementById("cnic");
    const fatherCnicInput = document.getElementById("fathercnic");

    function formatCNIC(input) {
        input.addEventListener("input", function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 13) value = value.slice(0, 13);
            if (value.length >= 5) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            }
            if (value.length >= 13) {
                value = value.slice(0, 13) + '-' + value.slice(13);
            }
            e.target.value = value;
        });
    }

    formatCNIC(cnicInput);
    formatCNIC(fatherCnicInput);

    // Add Cropper.js CSS and JS dynamically
    const cropperCSS = document.createElement('link');
    cropperCSS.rel = 'stylesheet';
    cropperCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css';
    document.head.appendChild(cropperCSS);

    const cropperJS = document.createElement('script');
    cropperJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js';
    document.head.appendChild(cropperJS);

    // Create modal for cropping
    const modalHTML = `
        <div id="cropperModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; max-width: 90%; max-height: 90%;">
                <div style="margin-bottom: 10px;">
                    <img id="cropperImage" style="max-width: 100%; max-height: 70vh;">
                </div>
                <div style="text-align: center;">
                    <button id="cropButton" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Crop</button>
                    <button id="cancelCropButton" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    let cropper = null;
    const modal = document.getElementById('cropperModal');
    const cropperImage = document.getElementById('cropperImage');
    const cropButton = document.getElementById('cropButton');
    const cancelCropButton = document.getElementById('cancelCropButton');

    // Add image upload feedback with cropping
    const pictureInput = document.getElementById("picture");
    pictureInput.addEventListener("change", function(e) {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                cropperImage.src = event.target.result;
                modal.style.display = 'block';
                
                // Initialize cropper after image is loaded
                cropperImage.onload = function() {
                    if (cropper) {
                        cropper.destroy();
                    }
                    cropper = new Cropper(cropperImage, {
                        aspectRatio: NaN, // Free aspect ratio
                        viewMode: 1,
                        dragMode: 'move',
                        autoCropArea: 1,
                        restore: false,
                        guides: true,
                        center: true,
                        highlight: false,
                        cropBoxMovable: true,
                        cropBoxResizable: true,
                        toggleDragModeOnDblclick: false,
                    });
                };
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Handle crop button click
    cropButton.addEventListener('click', function() {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas({
                maxWidth: 800,
                maxHeight: 800,
                fillColor: '#fff',
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            // Create preview container
            const previewContainer = document.createElement("div");
            previewContainer.style.marginTop = "10px";
            previewContainer.style.maxWidth = "200px";
            
            // Create preview image
            const preview = document.createElement("img");
            preview.style.width = "100%";
            preview.style.height = "auto";
            preview.style.border = "1px solid #ccc";
            preview.style.borderRadius = "4px";
            
            // Set the cropped image as preview
            preview.src = canvas.toDataURL('image/jpeg');
            
            // Remove any existing preview
            const existingPreview = pictureInput.parentNode.querySelector('.preview-container');
            if (existingPreview) existingPreview.remove();
            
            // Add preview to container
            previewContainer.classList.add('preview-container');
            previewContainer.appendChild(preview);
            
            // Add feedback message
            const feedbackDiv = document.createElement("div");
            feedbackDiv.id = "imageUploadFeedback";
            feedbackDiv.style.color = "green";
            feedbackDiv.style.marginTop = "5px";
            feedbackDiv.textContent = "✓ Image uploaded and cropped successfully!";
            
            // Remove any existing feedback
            const existingFeedback = document.getElementById("imageUploadFeedback");
            if (existingFeedback) existingFeedback.remove();
            
            // Add elements to the page
            pictureInput.parentNode.appendChild(feedbackDiv);
            pictureInput.parentNode.appendChild(previewContainer);
            
            // Hide modal
            modal.style.display = 'none';
        }
    });

    // Handle cancel button click
    cancelCropButton.addEventListener('click', function() {
        modal.style.display = 'none';
        pictureInput.value = ''; // Clear the file input
    });

    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        // Check age validation
        if (!validateAge()) {
            alert("You must be at least 13 years old to register");
            return;
        }

        // Get the selected course
        const selectedCourse = document.getElementById("course").value;
        
        // Generate course-specific roll number prefix
        let rollNumberPrefix;
        switch(selectedCourse) {
            case "Artificial Intelligence":
                rollNumberPrefix = "AIC";
                break;
            case "Web Development":
                rollNumberPrefix = "WMA";
                break;
            case "Graphics Designing":
                rollNumberPrefix = "GD";
                break;
            default:
                rollNumberPrefix = "SMIT";
        }
        
        // Generate random 6-digit number
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        
        // Create roll number with course-specific prefix
        const rollNumber = `${rollNumberPrefix}-${randomNumber}`;
        
        // 1. COLLECT ALL FORM DATA
        const formData = {
            fullname: document.getElementById("fullname").value.trim(),
            fathername: document.getElementById("fathername").value.trim(),
            course: selectedCourse,
            cnic: document.getElementById("cnic").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            country: document.getElementById("country").value,
            city: document.getElementById("city").value,
            proficiency: document.getElementById("proficiency").value,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            address: document.getElementById("address").value.trim(),
            qualification: document.getElementById("qualification").value.trim(),
            laptop: document.getElementById("laptop").value,
            fathercnic: document.getElementById("fathercnic").value.trim(),
            rollNumber: rollNumber // Using the course-specific roll number
        };

        // 2. HANDLE IMAGE UPLOAD
        if (pictureInput.files[0]) {
            formData.picture = await toBase64(pictureInput.files[0]);
        } else {
            formData.picture = 'assets/images/student.png';
        }

        // 3. STORE DATA IN localStorage
        try {
            localStorage.setItem("smit_student_data", JSON.stringify(formData));
            // 4. REDIRECT WITHOUT URL PARAMETERS
            window.location.href = "id-card.html";
        } catch (e) {
            alert("Error saving data. Please try again with a smaller image.");
            console.error("Storage error:", e);
        }
    });

    function toBase64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
        });
    }
});