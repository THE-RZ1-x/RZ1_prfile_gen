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
let currentStep = 1;
const totalSteps = 3;
let skills = new Set();
let experiences = [];

// Theme Toggle
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('span');

function setTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
setTheme(isDark);

themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-theme'));
});

// Help Modal
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

// Toast Notification
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Form Navigation
function updateStepIndicators() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`${getStepId(step)}`).classList.add('active');
    
    prevStepBtn.style.display = step === 1 ? 'none' : 'block';
    nextStepBtn.textContent = step === totalSteps ? 'Generate Profile' : 'Next';
    
    updateStepIndicators();
}

function getStepId(step) {
    const stepMap = {
        1: 'personalStep',
        2: 'experienceStep',
        3: 'socialStep'
    };
    return stepMap[step];
}

prevStepBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
});

nextStepBtn.addEventListener('click', () => {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        } else {
            generateProfile();
        }
    }
});

// Form Validation
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            const name = document.getElementById('fullName').value;
            const bio = document.getElementById('bio').value;
            if (!name || !bio) {
                showToast('Please fill in all required fields');
                return false;
            }
            break;
        case 2:
            // Experience step is optional
            break;
        case 3:
            const urls = ['linkedin', 'github', 'twitter', 'portfolio']
                .map(id => document.getElementById(id).value)
                .filter(url => url !== '');
            
            for (const url of urls) {
                try {
                    new URL(url);
                } catch {
                    showToast('Please enter valid URLs for social media links');
                    return false;
                }
            }
            break;
    }
    return true;
}

// Profile Picture Management
profilePicture.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size should be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePreview.src = e.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
});

// Skills Management
skillInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const skill = skillInput.value.trim();
        if (skill && !skills.has(skill)) {
            skills.add(skill);
            addSkillTag(skill);
            skillInput.value = '';
            updatePreview();
        }
    }
});

function addSkillTag(skill) {
    const tag = document.createElement('div');
    tag.className = 'skill-tag';
    tag.innerHTML = `
        ${skill}
        <button onclick="removeSkill('${skill}')">&times;</button>
    `;
    skillTags.appendChild(tag);
}

function removeSkill(skill) {
    skills.delete(skill);
    updateSkillTags();
    updatePreview();
}

function updateSkillTags() {
    skillTags.innerHTML = '';
    skills.forEach(addSkillTag);
}

// Experience Management
addExperience.addEventListener('click', () => {
    const experience = {
        id: Date.now(),
        title: '',
        company: '',
        description: ''
    };
    experiences.push(experience);
    addExperienceItem(experience);
    updatePreview();
});

function addExperienceItem(experience) {
    const item = document.createElement('div');
    item.className = 'experience-item';
    item.dataset.id = experience.id;
    item.innerHTML = `
        <button class="remove-exp" onclick="removeExperience(${experience.id})">&times;</button>
        <div class="form-group">
            <label>Title</label>
            <input type="text" class="exp-title" value="${experience.title}" placeholder="e.g. Senior Developer">
        </div>
        <div class="form-group">
            <label>Company</label>
            <input type="text" class="exp-company" value="${experience.company}" placeholder="Company name">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="exp-description" rows="3" placeholder="Describe your role and achievements">${experience.description}</textarea>
        </div>
    `;
    
    experienceList.appendChild(item);
    
    // Add input listeners
    const inputs = item.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const index = experiences.findIndex(exp => exp.id === experience.id);
            if (index !== -1) {
                experiences[index] = {
                    ...experiences[index],
                    title: item.querySelector('.exp-title').value,
                    company: item.querySelector('.exp-company').value,
                    description: item.querySelector('.exp-description').value
                };
                updatePreview();
            }
        });
    });
}

function removeExperience(id) {
    experiences = experiences.filter(exp => exp.id !== id);
    document.querySelector(`.experience-item[data-id="${id}"]`).remove();
    updatePreview();
}

// Preview Management
function updatePreview() {
    const name = document.getElementById('fullName').value;
    const title = document.getElementById('title').value;
    const bio = document.getElementById('bio').value;
    const social = {
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        twitter: document.getElementById('twitter').value,
        portfolio: document.getElementById('portfolio').value
    };

    previewCard.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <img src="${profilePreview.src}" alt="Profile" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
            <h2 style="margin: 0.5rem 0;">${name || 'Your Name'}</h2>
            ${title ? `<h3 style="margin: 0.5rem 0; color: var(--primary-color);">${title}</h3>` : ''}
        </div>
        
        ${bio ? `<p style="margin-bottom: 1.5rem;">${bio}</p>` : ''}
        
        ${skills.size > 0 ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem;">Skills</h3>
                <div class="skill-tags">
                    ${Array.from(skills).map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
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
                <div style="display: flex; gap: 1rem;">
                    ${social.linkedin ? `<a href="${social.linkedin}" target="_blank" style="color: var(--primary-color);"><i class="fab fa-linkedin fa-2x"></i></a>` : ''}
                    ${social.github ? `<a href="${social.github}" target="_blank" style="color: var(--primary-color);"><i class="fab fa-github fa-2x"></i></a>` : ''}
                    ${social.twitter ? `<a href="${social.twitter}" target="_blank" style="color: var(--primary-color);"><i class="fab fa-twitter fa-2x"></i></a>` : ''}
                    ${social.portfolio ? `<a href="${social.portfolio}" target="_blank" style="color: var(--primary-color);"><i class="fas fa-globe fa-2x"></i></a>` : ''}
                </div>
            </div>
        ` : ''}
    `;
}

// Platform Selection
document.querySelectorAll('.platform-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const platform = e.currentTarget.dataset.platform;
        if (platform === 'github') {
            window.location.href = 'github-profile.html';
        } else if (platform === 'linkedin') {
            window.location.href = 'linkedin-profile.html';
        } else if (platform === 'twitter') {
            window.location.href = 'twitter-profile.html';
        } else if (platform === 'youtube') {
            window.location.href = 'youtube-profile.html';
        } else if (platform === 'facebook') {
            window.location.href = 'facebook-profile.html';
        } else if (!e.currentTarget.classList.contains('coming-soon')) {
            showToast('This platform is coming soon!', 3000);
        }
    });
});

// Profile Generation and Download
function generateProfile() {
    if (!validateCurrentStep()) return;
    
    const name = document.getElementById('fullName').value;
    downloadHtmlBtn.disabled = false;
    downloadImageBtn.disabled = false;
    showToast('Profile generated successfully!');
}

downloadHtmlBtn.addEventListener('click', () => {
    const name = document.getElementById('fullName').value;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${name}'s Profile</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
            <style>
                :root {
                    --primary-color: #4361ee;
                    --text-color: #2b2d42;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: var(--text-color);
                    max-width: 800px;
                    margin: 2rem auto;
                    padding: 0 1rem;
                }
                a { color: var(--primary-color); text-decoration: none; }
                .skill-tag {
                    display: inline-block;
                    background: var(--primary-color);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 30px;
                    margin: 0.2rem;
                    font-size: 0.9rem;
                }
            </style>
        </head>
        <body>
            ${previewCard.innerHTML}
        </body>
        </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-profile.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

downloadImageBtn.addEventListener('click', async () => {
    const name = document.getElementById('fullName').value;
    downloadImageBtn.disabled = true;
    downloadImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    try {
        const canvas = await html2canvas(previewCard);
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-profile.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        showToast('Error generating image. Please try again.');
    } finally {
        downloadImageBtn.disabled = false;
        downloadImageBtn.innerHTML = '<i class="fas fa-image"></i> Download as Image';
    }
});

// Initialize
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', updatePreview);
});

updatePreview();
