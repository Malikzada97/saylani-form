document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registrationForm");
    
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
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
        
        // Generate random 4-digit number
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        
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
        const pictureInput = document.getElementById("picture");
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