document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const backButton = document.getElementById('backButton');
    const themeToggle = document.getElementById('themeToggle');
    const youtubeName = document.getElementById('youtubeName');
    const youtubeHandle = document.getElementById('youtubeHandle');
    const youtubeSubs = document.getElementById('youtubeSubs');
    const youtubeDesc = document.getElementById('youtubeDesc');
    const profilePictureInput = document.getElementById('profilePicture');
    const bannerImageInput = document.getElementById('bannerImage');
    const videoThumbInput = document.getElementById('videoThumb');
    const videoTitle = document.getElementById('videoTitle');
    const previewCard = document.getElementById('youtubeProfileCard');

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
        const name = youtubeName.value || 'Channel Name';
        const handle = youtubeHandle.value || 'channelhandle';
        const subs = youtubeSubs.value || '0';
        const desc = youtubeDesc.value;
        const vidTitle = videoTitle.value;

        let avatarUrl = 'assets/images/default-avatar.svg';
        if (profilePictureInput.files && profilePictureInput.files[0]) {
            avatarUrl = URL.createObjectURL(profilePictureInput.files[0]);
        }

        let bannerUrl = '';
        if (bannerImageInput.files && bannerImageInput.files[0]) {
            bannerUrl = URL.createObjectURL(bannerImageInput.files[0]);
        }

        let thumbUrl = '';
        if (videoThumbInput.files && videoThumbInput.files[0]) {
            thumbUrl = URL.createObjectURL(videoThumbInput.files[0]);
        }

        previewCard.innerHTML = `
            <div class="yt-banner" style="background-image: url('${bannerUrl}')"></div>
            <div class="yt-channel-header">
                <div class="yt-avatar" style="background-image: url('${avatarUrl}')"></div>
                <div class="yt-channel-info">
                    <h1>${name}</h1>
                    <p>@${handle} &bull; ${subs} subscribers</p>
                </div>
                <button class="yt-subscribe-btn">Subscribe</button>
            </div>
            <div class="yt-tabs">
                <div class="yt-tab active">HOME</div>
                <div class="yt-tab">VIDEOS</div>
                <div class="yt-tab">PLAYLISTS</div>
                <div class="yt-tab">ABOUT</div>
            </div>
            <div class="yt-body">
                <div class="yt-featured-video">
                    ${vidTitle ? `
                        <h3>Featured Video</h3>
                        <div class="video-thumbnail" style="background-image: url('${thumbUrl}')"></div>
                        <p class="video-title">${vidTitle}</p>
                    ` : '<!-- No featured video -->'}
                </div>
                <div class="yt-desc">
                    <h3>Description</h3>
                    <p>${desc || 'No description provided.'}</p>
                </div>
            </div>
        `;
    }

    // Event Listeners for live preview
    [youtubeName, youtubeHandle, youtubeSubs, youtubeDesc, videoTitle].forEach(el => {
        el.addEventListener('input', updatePreview);
    });
    [profilePictureInput, bannerImageInput, videoThumbInput].forEach(el => {
        el.addEventListener('change', updatePreview);
    });

    // Initial Preview
    updatePreview();
});

// Download/Copy Functions
function downloadProfileImage() {
    const card = document.getElementById('youtubeProfileCard');
    const name = document.getElementById('youtubeName').value || 'youtube-profile';
    html2canvas(card, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: document.body.classList.contains('dark-theme') ? '#0f0f0f' : '#f9f9f9'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

function copyProfileImage() {
    const card = document.getElementById('youtubeProfileCard');
    html2canvas(card, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: document.body.classList.contains('dark-theme') ? '#0f0f0f' : '#f9f9f9'
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
