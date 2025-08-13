document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const backButton = document.getElementById('backButton');
    const themeToggle = document.getElementById('themeToggle');
    const fbName = document.getElementById('fbName');
    const fbBio = document.getElementById('fbBio');
    const profilePictureInput = document.getElementById('profilePicture');
    const coverPhotoInput = document.getElementById('coverPhoto');
    const fbWork = document.getElementById('fbWork');
    const fbEducation = document.getElementById('fbEducation');
    const fbLocation = document.getElementById('fbLocation');
    const fbHometown = document.getElementById('fbHometown');
    const previewCard = document.getElementById('facebookProfileCard');

    // Theme Toggle
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');

    function setTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setTheme(isDark);

    themeToggle.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark-theme'));
    });

    // Back Button
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Update Preview Function
    function updatePreview() {
        const name = fbName.value || 'Your Name';
        const bio = fbBio.value;
        const work = fbWork.value;
        const education = fbEducation.value;
        const location = fbLocation.value;
        const hometown = fbHometown.value;

        let profilePicUrl = 'assets/images/default-avatar.svg';
        if (profilePictureInput.files && profilePictureInput.files[0]) {
            profilePicUrl = URL.createObjectURL(profilePictureInput.files[0]);
        }

        let coverPhotoUrl = '';
        if (coverPhotoInput.files && coverPhotoInput.files[0]) {
            coverPhotoUrl = URL.createObjectURL(coverPhotoInput.files[0]);
        }

        previewCard.innerHTML = `
            <div class="fb-cover-photo" style="background-image: url('${coverPhotoUrl}')"></div>
            <div class="fb-profile-header">
                <div class="fb-profile-pic" style="background-image: url('${profilePicUrl}')"></div>
                <div class="fb-name-actions">
                    <div class="fb-name">
                        <h1>${name}</h1>
                    </div>
                    <div class="fb-actions">
                        <button class="fb-btn primary"><i class="fas fa-plus-circle"></i> Add to Story</button>
                        <button class="fb-btn secondary"><i class="fas fa-pen"></i> Edit Profile</button>
                    </div>
                </div>
            </div>
            <div class="fb-content">
                ${bio ? `<div class="fb-bio">${bio}</div>` : ''}
                <div class="fb-intro">
                    <h3>Intro</h3>
                    ${work ? `<div class="fb-intro-item"><i class="fas fa-briefcase"></i> Works at <strong>${work}</strong></div>` : ''}
                    ${education ? `<div class="fb-intro-item"><i class="fas fa-graduation-cap"></i> Studied at <strong>${education}</strong></div>` : ''}
                    ${location ? `<div class="fb-intro-item"><i class="fas fa-home"></i> Lives in <strong>${location}</strong></div>` : ''}
                    ${hometown ? `<div class="fb-intro-item"><i class="fas fa-map-marker-alt"></i> From <strong>${hometown}</strong></div>` : ''}
                </div>
            </div>
        `;
    }

    // Event Listeners for live preview
    [fbName, fbBio, fbWork, fbEducation, fbLocation, fbHometown].forEach(el => {
        el.addEventListener('input', updatePreview);
    });
    [profilePictureInput, coverPhotoInput].forEach(el => {
        el.addEventListener('change', updatePreview);
    });

    // Initial Preview
    updatePreview();
});

// Download/Copy Functions
function downloadProfileImage() {
    const card = document.getElementById('facebookProfileCard');
    const name = document.getElementById('fbName').value || 'facebook-profile';
    html2canvas(card, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: document.body.classList.contains('dark-theme') ? '#18191a' : '#f0f2f5'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

function copyProfileImage() {
    const card = document.getElementById('facebookProfileCard');
    html2canvas(card, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: document.body.classList.contains('dark-theme') ? '#18191a' : '#f0f2f5'
    }).then(canvas => {
        canvas.toBlob(blob => {
            navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]).then(() => {
                alert('Profile image copied to clipboard!');
            }, () => {
                alert('Failed to copy image.');
            });
        });
    });
}
