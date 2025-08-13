document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const backButton = document.getElementById('backButton');
    const themeToggle = document.getElementById('themeToggle');
    const twitterName = document.getElementById('twitterName');
    const twitterHandle = document.getElementById('twitterHandle');
    const twitterBio = document.getElementById('twitterBio');
    const twitterLocation = document.getElementById('twitterLocation');
    const twitterWebsite = document.getElementById('twitterWebsite');
    const profilePictureInput = document.getElementById('profilePicture');
    const headerImageInput = document.getElementById('headerImage');
    const pinnedTweet = document.getElementById('pinnedTweet');
    const previewCard = document.getElementById('twitterProfileCard');

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
        const name = twitterName.value || 'Display Name';
        const handle = twitterHandle.value || 'handle';
        const bio = twitterBio.value;
        const location = twitterLocation.value;
        const website = twitterWebsite.value;
        const tweet = pinnedTweet.value;

        let profilePicUrl = 'assets/images/default-avatar.svg';
        if (profilePictureInput.files && profilePictureInput.files[0]) {
            profilePicUrl = URL.createObjectURL(profilePictureInput.files[0]);
        }

        let headerImageUrl = '';
        if (headerImageInput.files && headerImageInput.files[0]) {
            headerImageUrl = URL.createObjectURL(headerImageInput.files[0]);
        }

        previewCard.innerHTML = `
            <div class="twitter-header" style="background-image: url('${headerImageUrl}')"></div>
            <div class="twitter-header-content">
                <div class="twitter-profile-pic" style="background-image: url('${profilePicUrl}')"></div>
                <button class="follow-btn">Follow</button>
            </div>
            <div class="twitter-info">
                <div class="twitter-name">${name}</div>
                <div class="twitter-handle">@${handle}</div>
                <div class="twitter-bio">${bio}</div>
                <div class="twitter-meta">
                    ${location ? `<span><i class="fas fa-map-marker-alt"></i> ${location}</span>` : ''}
                    ${website ? `<span><i class="fas fa-link"></i> <a href="${website}" target="_blank">${website.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></span>` : ''}
                </div>
                <div class="twitter-follows">
                    <span><strong>1,234</strong> Following</span>
                    <span><strong>5,678</strong> Followers</span>
                </div>
            </div>
            ${tweet ? `
            <div class="pinned-tweet">
                <p><i class="fas fa-thumbtack"></i> Pinned Tweet</p>
                ${tweet}
            </div>
            ` : ''}
        `;
    }

    // Event Listeners for live preview
    [twitterName, twitterHandle, twitterBio, twitterLocation, twitterWebsite, pinnedTweet].forEach(el => {
        el.addEventListener('input', updatePreview);
    });
    [profilePictureInput, headerImageInput].forEach(el => {
        el.addEventListener('change', updatePreview);
    });

    // Initial Preview
    updatePreview();
});

// Download/Copy Functions
function downloadProfileImage() {
    const card = document.getElementById('twitterProfileCard');
    const name = document.getElementById('twitterName').value || 'twitter-profile';
    html2canvas(card, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: document.body.classList.contains('dark-theme') ? '#1a1b1e' : '#f8f9fa'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

function copyProfileImage() {
    const card = document.getElementById('twitterProfileCard');
    html2canvas(card, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: document.body.classList.contains('dark-theme') ? '#1a1b1e' : '#f8f9fa'
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
