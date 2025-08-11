// DOM Elements
const profileForm = document.getElementById('profileForm');
const profilePicture = document.getElementById('profilePicture');
const profilePreview = document.getElementById('profilePreview');
const previewCard = document.getElementById('previewCard');
const themeToggle = document.getElementById('themeToggle');
const helpToggle = document.getElementById('helpToggle');
const helpModal = document.getElementById('helpModal');
const closeModal = document.querySelector('.close-modal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const skillInput = document.getElementById('skillInput');
const skillTags = document.getElementById('skillTags');
const addExperience = document.getElementById('addExperience');
const experienceList = document.getElementById('experienceList');
const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn');
const prevStepBtn = document.getElementById('prevStep');
const nextStepBtn = document.getElementById('nextStep');

// State Management
let selectedPlatform = null;
let currentStep = 1;
const totalSteps = 3;
let skills = new Set();
let experiences = [];
let formState = {};

// --- THEME MANAGEMENT ---
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('span');

function setTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// --- HELP MODAL ---
function setupHelpModal() {
    helpToggle.addEventListener('click', () => {
        helpModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', () => {
        helpModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// --- TOAST NOTIFICATION ---
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}


// --- PLATFORM GENERATOR LOGIC ---
const platformGenerators = {
    // Generic Profile Generator (default)
    generic: {
        setupForm: () => {
            // This is the default form, no changes needed
        },
        generatePreview: (state) => {
            const { fullName, title, bio, social, skills, experiences } = state;
            return `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <img src="${state.profilePicture}" alt="Profile" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
                    <h2 style="margin: 0.5rem 0;">${fullName || 'Your Name'}</h2>
                    ${title ? `<h3 style="margin: 0.5rem 0; color: var(--primary-color);">${title}</h3>` : ''}
                </div>
                ${bio ? `<p style="margin-bottom: 1.5rem;">${bio}</p>` : ''}
                ${skills.size > 0 ? `
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="margin-bottom: 0.5rem;">Skills</h3>
                        <div class="skill-tags">
                            ${Array.from(skills).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                ${experiences.length > 0 ? `
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="margin-bottom: 0.5rem;">Experience</h3>
                        ${experiences.map(exp => `
                            <div style="margin-bottom: 1rem;">
                                <h4 style="margin: 0;">${exp.title}</h4>
                                ${exp.company ? `<p style="margin: 0.2rem 0; color: var(--primary-color);">${exp.company}</p>` : ''}
                                ${exp.description ? `<p style="margin: 0.2rem 0;">${exp.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${Object.values(social).some(url => url) ? `
                    <div>
                        <h3 style="margin-bottom: 0.5rem;">Connect</h3>
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            ${social.linkedin ? `<a href="${social.linkedin}" target="_blank" style="color: var(--primary-color);"><i class="fab fa-linkedin fa-2x"></i></a>` : ''}
                            ${social.github ? `<a href="${social.github}" target="_blank" style="color: var(--primary-color);"><i class="fab fa-github fa-2x"></i></a>` : ''}
                            ${social.twitter ? `<a href="${social.twitter}" target="_blank" style="color: var(--primary-color);"><i class="fab fa-twitter fa-2x"></i></a>` : ''}
                            ${social.website ? `<a href="${social.website}" target="_blank" style="color: var(--primary-color);"><i class="fas fa-globe fa-2x"></i></a>` : ''}
                        </div>
                    </div>
                ` : ''}
            `;
        }
    },
    // GitHub Profile Generator
    github: {
        setupForm: () => {
            // Example: Add a GitHub specific field
            const personalStep = document.getElementById('personalStep');
            const ghField = `
                <div class="form-group" id="github-username-group">
                    <label for="ghUsername">GitHub Username*</label>
                    <input type="text" id="ghUsername" required placeholder="Enter your GitHub username">
                </div>
            `;
            personalStep.insertAdjacentHTML('beforeend', ghField);
        },
        generatePreview: (state) => {
            const { fullName, bio, ghUsername } = state;
            return `
                <div class="github-profile-preview">
                    <h1>Hi 👋, I'm ${fullName || 'Your Name'}</h1>
                    <p>${bio || 'A passionate developer.'}</p>
                    <h3>Connect with me:</h3>
                    <p>
                        ${state.social.linkedin ? `<a href="${state.social.linkedin}" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a>` : ''}
                        ${state.social.twitter ? `<a href="${state.social.twitter}" target="_blank"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/></a>` : ''}
                    </p>
                    <h3>Languages and Tools:</h3>
                    <p>
                        ${Array.from(state.skills).map(skill => `<img src="https://img.shields.io/badge/${skill}-232323?style=for-the-badge&logo=${skill.toLowerCase().replace(' ', '')}&logoColor=white" alt="${skill}" />`).join('\n')}
                    </p>
                    ${ghUsername ? `
                    <h3>GitHub Stats:</h3>
                    <p>
                        <img src="https://github-readme-stats.vercel.app/api?username=${ghUsername}&show_icons=true&theme=radical" alt="github stats" />
                        <br/>
                        <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${ghUsername}&layout=compact&theme=radical" alt="top langs" />
                    </p>
                    ` : ''}
                </div>
            `;
        }
    },
    linkedin: {
        setupForm: () => {
            const personalStep = document.getElementById('personalStep');
            const industryField = `
                <div class="form-group" id="linkedin-industry-group">
                    <label for="liIndustry">Industry</label>
                    <input type="text" id="liIndustry" placeholder="e.g. Computer Software">
                </div>
            `;
            personalStep.insertAdjacentHTML('beforeend', industryField);
        },
        generatePreview: (state) => {
            const { fullName, title, bio, liIndustry, social, skills, experiences, profilePicture } = state;
            return `
                <div class="linkedin-profile-preview">
                    <div class="li-header">
                        <div class="li-cover-photo"></div>
                        <img src="${profilePicture}" alt="Profile" class="li-profile-pic">
                    </div>
                    <div class="li-body">
                        <h2>${fullName || 'Your Name'}</h2>
                        <p>${title || 'Professional Title'}</p>
                        ${liIndustry ? `<p class="li-industry">${liIndustry}</p>` : ''}
                        <hr>
                        <h3>About</h3>
                        <p>${bio || 'A short bio about yourself.'}</p>
                        ${skills.size > 0 ? `
                            <h3>Skills</h3>
                            <div class="li-skills">
                                ${Array.from(skills).map(skill => `<span>${skill}</span>`).join('')}
                            </div>
                        ` : ''}
                        ${experiences.length > 0 ? `
                            <h3>Experience</h3>
                            <div class="li-experience">
                                ${experiences.map(exp => `
                                    <div class="li-exp-item">
                                        <h4>${exp.title}</h4>
                                        <p>${exp.company}</p>
                                        <p class="li-exp-desc">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    },
    twitter: {
        setupForm: () => {
            const personalStep = document.getElementById('personalStep');
            const twitterField = `
                <div class="form-group" id="twitter-handle-group">
                    <label for="twHandle">Twitter Handle*</label>
                    <input type="text" id="twHandle" required placeholder="e.g. jules_dev">
                </div>
            `;
            personalStep.insertAdjacentHTML('beforeend', twitterField);
        },
        generatePreview: (state) => {
            const { fullName, twHandle, bio, profilePicture } = state;
            return `
                <div class="twitter-profile-preview">
                    <div class="tw-header">
                        <img src="${profilePicture}" alt="Profile" class="tw-profile-pic">
                        <div class="tw-names">
                            <h4>${fullName || 'Your Name'}</h4>
                            <p>@${twHandle || 'handle'}</p>
                        </div>
                    </div>
                    <div class="tw-body">
                        <p>${bio || 'This is a sample tweet bio!'}</p>
                    </div>
                    <div class="tw-footer">
                        <p><a href="https://twitter.com/${twHandle}" target="_blank">View on Twitter</a></p>
                    </div>
                </div>
            `;
        }
    },
    youtube: {
        setupForm: () => {
            const personalStep = document.getElementById('personalStep');
            const youtubeField = `
                <div class="form-group" id="youtube-channel-group">
                    <label for="ytChannel">YouTube Channel Name*</label>
                    <input type="text" id="ytChannel" required placeholder="e.g. CoolContentCreator">
                </div>
            `;
            personalStep.insertAdjacentHTML('beforeend', youtubeField);
        },
        generatePreview: (state) => {
            const { fullName, ytChannel, bio, profilePicture } = state;
            return `
                <div class="youtube-profile-preview">
                    <div class="yt-header">
                        <div class="yt-cover-photo"></div>
                        <img src="${profilePicture}" alt="Profile" class="yt-profile-pic">
                    </div>
                    <div class="yt-body">
                        <h3>${ytChannel || 'Your Channel Name'}</h3>
                        <p>${fullName || 'Your Name'} &bull; @${ytChannel || 'handle'}</p>
                        <p class="yt-bio">${bio || 'Welcome to my channel! Subscribe for amazing content.'}</p>
                        <button class="yt-subscribe-btn">Subscribe</button>
                    </div>
                </div>
            `;
        }
    },
    facebook: {
        setupForm: () => {
            const personalStep = document.getElementById('personalStep');
            const facebookField = `
                <div class="form-group" id="facebook-name-group">
                    <label for="fbName">Facebook Profile Name*</label>
                    <input type="text" id="fbName" required placeholder="e.g. j.doe">
                </div>
            `;
            personalStep.insertAdjacentHTML('beforeend', facebookField);
        },
        generatePreview: (state) => {
            const { fullName, fbName, bio, profilePicture } = state;
            return `
                <div class="facebook-profile-preview">
                    <div class="fb-header">
                        <div class="fb-cover-photo"></div>
                        <img src="${profilePicture}" alt="Profile" class="fb-profile-pic">
                        <h2>${fullName || 'Your Name'}</h2>
                        <p>${bio || 'Add a bio...'}</p>
                    </div>
                    <div class="fb-actions">
                        <button><i class="fas fa-plus"></i> Add to Story</button>
                        <button><i class="fas fa-pen"></i> Edit Profile</button>
                    </div>
                </div>
            `;
        }
    },
};

// --- PREVIEW MANAGEMENT ---
function updatePreview() {
    if (!selectedPlatform) return;

    // 1. Get current form state
    const currentState = {
        profilePicture: profilePreview.src,
        fullName: document.getElementById('fullName').value,
        title: document.getElementById('title').value,
        bio: document.getElementById('bio').value,
        skills: skills,
        experiences: experiences,
        social: {
            linkedin: document.getElementById('linkedin').value,
            github: document.getElementById('github').value,
            twitter: document.getElementById('twitter').value,
            website: document.getElementById('website').value
        },
        // platform specific state
        ghUsername: document.getElementById('ghUsername')?.value,
        liIndustry: document.getElementById('liIndustry')?.value,
        twHandle: document.getElementById('twHandle')?.value,
        ytChannel: document.getElementById('ytChannel')?.value,
        fbName: document.getElementById('fbName')?.value,
    };

    // 2. Get the correct generator
    const generator = platformGenerators[selectedPlatform] || platformGenerators.generic;

    // 3. Generate and set the preview HTML
    previewCard.innerHTML = generator.generatePreview(currentState);
}

// --- FORM AND STEP MANAGEMENT ---
function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`${getStepId(step)}`).classList.add('active');
    
    prevStepBtn.style.display = step === 1 ? 'none' : 'block';
    nextStepBtn.textContent = step === totalSteps ? 'Generate Profile' : 'Next';
    
    const steps = document.querySelectorAll('.step');
    steps.forEach((s, index) => s.classList.toggle('active', index + 1 === step));
}

function getStepId(step) {
    return { 1: 'personalStep', 2: 'experienceStep', 3: 'socialStep' }[step];
}

function setupFormNavigation() {
    prevStepBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    nextStepBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        } else {
            // Final step action
            downloadHtmlBtn.disabled = false;
            downloadImageBtn.disabled = false;
            showToast('Profile ready for download!');
        }
    });
}


// --- DYNAMIC FORM SETUP ---
function setupPlatformForm(platform) {
    // Reset form to a clean state if needed
    const ghGroup = document.getElementById('github-username-group');
    if (ghGroup) ghGroup.remove();
    const liGroup = document.getElementById('linkedin-industry-group');
    if (liGroup) liGroup.remove();
    const twGroup = document.getElementById('twitter-handle-group');
    if (twGroup) twGroup.remove();
    const ytGroup = document.getElementById('youtube-channel-group');
    if (ytGroup) ytGroup.remove();
    const fbGroup = document.getElementById('facebook-name-group');
    if (fbGroup) fbGroup.remove();

    const generator = platformGenerators[platform] || platformGenerators.generic;
    if (generator.setupForm) {
        generator.setupForm();
    }

    // Add event listeners to new fields
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

// --- PLATFORM SELECTION ---
function setupPlatformSelection() {
    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.currentTarget.classList.contains('coming-soon')) {
                showToast('This platform is coming soon!', 3000);
                return;
            }

            selectedPlatform = e.currentTarget.dataset.platform;
            
            // Hide selection screen, show main content
            document.querySelector('.welcome-section').style.display = 'none';
            document.querySelector('.platform-grid').style.display = 'none';
            document.querySelector('.form-section').style.display = 'block';
            document.querySelector('.preview-section').style.display = 'block';

            // Customize form and preview for the selected platform
            setupPlatformForm(selectedPlatform);
            updatePreview();
        });
    });
}

// --- FILE DOWNLOADS ---
function setupDownloads() {
    downloadHtmlBtn.addEventListener('click', () => {
        const name = document.getElementById('fullName').value || 'profile';
        const cssLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">';
        const customStyles = `<style>
            body { font-family: sans-serif; margin: 2rem; }
            .skill-tag { display: inline-block; background: #eee; padding: 5px 10px; border-radius: 5px; margin: 2px; }
            .github-profile-preview img { max-width: 100%; }
            /* Add more styles from the preview */
        </style>`;
        
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${name}'s Profile</title>
                ${cssLink}
                ${customStyles}
            </head>
            <body>${previewCard.innerHTML}</body>
            </html>
        `;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-profile.html`;
        a.click();
        URL.revokeObjectURL(url);
    });

    downloadImageBtn.addEventListener('click', async () => {
        const name = document.getElementById('fullName').value || 'profile';
        downloadImageBtn.disabled = true;
        downloadImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

        try {
            const canvas = await html2canvas(previewCard, { useCORS: true });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-profile.png`;
            a.click();
        } catch (error) {
            console.error(error);
            showToast('Error generating image. Please try again.');
        } finally {
            downloadImageBtn.disabled = false;
            downloadImageBtn.innerHTML = '<i class="fas fa-image"></i> Download as Image';
        }
    });
}

// --- INITIALIZATION ---
function init() {
    // Setup Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
    themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-theme')));

    // Setup Modals and Toasts
    setupHelpModal();

    // Setup Core Functionality
    setupPlatformSelection();
    setupFormNavigation();
    setupDownloads();

    // Generic form listeners
    profilePicture.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });
    
    skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const skill = skillInput.value.trim();
            if (skill && !skills.has(skill)) {
                skills.add(skill);
                const tag = document.createElement('div');
                tag.className = 'skill-tag';
                tag.innerHTML = `${skill} <button onclick="removeSkill(this, '${skill}')">&times;</button>`;
                skillTags.appendChild(tag);
                skillInput.value = '';
                updatePreview();
            }
        }
    });
    
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function removeSkill(button, skill) {
    skills.delete(skill);
    button.parentElement.remove();
    updatePreview();
}

// Run initialization
init();
