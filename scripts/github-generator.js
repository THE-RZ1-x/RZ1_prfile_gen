// Skill sets
const skills = {
    programmingLanguages: [
        { name: 'JavaScript', icon: 'javascript' },
        { name: 'Python', icon: 'python' },
        { name: 'Java', icon: 'java' },
        { name: 'C++', icon: 'cplusplus' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'PHP', icon: 'php' },
        { name: 'Ruby', icon: 'ruby' },
        { name: 'Swift', icon: 'swift' },
        { name: 'Go', icon: 'go' }
    ],
    frontendSkills: [
        { name: 'HTML5', icon: 'html5' },
        { name: 'CSS3', icon: 'css3' },
        { name: 'React', icon: 'react' },
        { name: 'Vue.js', icon: 'vuejs' },
        { name: 'Angular', icon: 'angular' },
        { name: 'Sass', icon: 'sass' },
        { name: 'Bootstrap', icon: 'bootstrap' },
        { name: 'Tailwind', icon: 'tailwindcss' }
    ],
    backendSkills: [
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Express', icon: 'express' },
        { name: 'MongoDB', icon: 'mongodb' },
        { name: 'MySQL', icon: 'mysql' },
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'Django', icon: 'django' },
        { name: 'Flask', icon: 'flask' },
        { name: 'Firebase', icon: 'firebase' }
    ]
};

// Initialize skill checkboxes
function initializeSkills() {
    Object.keys(skills).forEach(category => {
        const container = document.getElementById(category);
        skills[category].forEach(skill => {
            const label = document.createElement('label');
            label.className = 'skill-checkbox';
            label.innerHTML = `
                <input type="checkbox" value="${skill.icon}">
                ${skill.name}
            `;
            container.appendChild(label);
        });
    });
}

// GitHub username handling
let githubUsername = '';

function fetchGitHubInfo() {
    const usernameInput = document.getElementById('ghUsername');
    const username = usernameInput.value.trim();
    const fetchBtn = document.querySelector('.fetch-btn');
    
    if (!username) {
        showToast('Please enter a GitHub username', 3000);
        return;
    }

    // Add loading state
    fetchBtn.classList.add('loading');

    // Fetch GitHub user info
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            githubUsername = username;
            // Auto-fill some fields if they're empty
            if (!document.getElementById('ghTitle').value) {
                document.getElementById('ghTitle').value = `Hi 👋, I'm ${data.name || username}`;
            }
            if (!document.getElementById('ghSubtitle').value && data.bio) {
                document.getElementById('ghSubtitle').value = data.bio;
            }
            showToast('GitHub info fetched successfully! 🎉', 3000);
            generateMarkdown();
        })
        .catch(error => {
            showToast('Error: ' + error.message, 3000);
        })
        .finally(() => {
            fetchBtn.classList.remove('loading');
        });
}

// Generate Markdown
function generateMarkdown() {
    const username = document.getElementById('ghUsername').value.trim() || 'YOUR_USERNAME';
    const title = document.getElementById('ghTitle').value || "Hi 👋, I'm";
    const subtitle = document.getElementById('ghSubtitle').value || "A passionate developer";
    const description = document.getElementById('ghDescription').value;
    const currentWork = document.getElementById('ghCurrentWork').value;
    const learning = document.getElementById('ghLearning').value;
    const collaboration = document.getElementById('ghCollaboration').value;
    const email = document.getElementById('ghEmail').value;
    const twitter = document.getElementById('ghTwitter').value;
    const linkedin = document.getElementById('ghLinkedin').value;
    const statsTheme = document.getElementById('statsTheme').value;

    let markdown = `# ${title}\n\n`;
    markdown += `### ${subtitle}\n\n`;

    if (description) {
        markdown += `${description}\n\n`;
    }

    // Current activities
    if (currentWork) markdown += `- 🔭 I'm currently working on **${currentWork}**\n`;
    if (learning) markdown += `- 🌱 I'm currently learning **${learning}**\n`;
    if (collaboration) markdown += `- 👯 I'm looking to collaborate on **${collaboration}**\n`;
    
    // Skills section
    const selectedSkills = getSelectedSkills();
    if (selectedSkills.length > 0) {
        markdown += '\n<h3 align="left">Languages and Tools:</h3>\n';
        markdown += '<p align="left">';
        selectedSkills.forEach(skill => {
            markdown += `<a href="#" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/${skill}//${skill}-original.svg" alt="${skill}" width="40" height="40"/> </a> `;
        });
        markdown += '</p>\n\n';
    }

    // Social links
    if (email || twitter || linkedin) {
        markdown += '<h3 align="left">Connect with me:</h3>\n<p align="left">\n';
        if (email) markdown += `<a href="mailto:${email}" target="blank"><img align="center" src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/></a>\n`;
        if (twitter) markdown += `<a href="https://twitter.com/${twitter}" target="blank"><img align="center" src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"/></a>\n`;
        if (linkedin) markdown += `<a href="https://linkedin.com/in/${linkedin}" target="blank"><img align="center" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>\n`;
        markdown += '</p>\n\n';
    }

    // GitHub stats
    if (document.getElementById('showStats').checked) {
        markdown += `<p><img align="center" src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}" alt="GitHub Stats" /></p>\n\n`;
    }
    if (document.getElementById('showStreak').checked) {
        markdown += `<p><img align="center" src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${statsTheme}" alt="GitHub Streak" /></p>\n\n`;
    }
    if (document.getElementById('showLanguages').checked) {
        markdown += `<p><img align="left" src="https://github-readme-stats.vercel.app/api/top-langs?username=${username}&show_icons=true&locale=en&layout=compact&theme=${statsTheme}" alt="Most Used Languages" /></p>\n`;
    }

    document.getElementById('markdownPreview').textContent = markdown;
    updateRenderedPreview(markdown);
}

// Update rendered preview
function updateRenderedPreview(markdown) {
    const rendered = document.querySelector('.rendered-preview');
    // Convert markdown to HTML (basic conversion for preview)
    let html = markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    rendered.innerHTML = html;
}

// Get selected skills
function getSelectedSkills() {
    const selectedSkills = [];
    document.querySelectorAll('.skill-checkbox input:checked').forEach(checkbox => {
        selectedSkills.push(checkbox.value);
    });
    return selectedSkills;
}

// Update preview when inputs change
function initializePreviewUpdates() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', generateMarkdown);
    });
}

// Copy markdown to clipboard
function copyMarkdown() {
    const markdown = document.getElementById('markdownPreview').textContent;
    navigator.clipboard.writeText(markdown).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
}

// Switch between markdown and rendered preview
function initializePreviewToggle() {
    const previewBtns = document.querySelectorAll('.preview-btn');
    previewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            previewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            document.querySelector('.markdown-preview').classList.toggle('active', view === 'markdown');
            document.querySelector('.rendered-preview').classList.toggle('active', view === 'rendered');
        });
    });
}

// AI Generation
function generateWithAI() {
    const apiKey = localStorage.getItem('googleAiApiKey');
    if (!apiKey) {
        showToast('Please set your Google AI API Key in the settings first.', 4000);
        // Maybe open the settings modal automatically
        // document.getElementById('settingsModal').style.display = 'block';
        return;
    }

    const title = document.getElementById('ghTitle').value || "a passionate developer";
    const learning = document.getElementById('ghLearning').value;
    const collaboration = document.getElementById('ghCollaboration').value;
    const skills = getSelectedSkills().join(', ');

    const prompt = `
        Generate a friendly and professional "About Me" section for a GitHub profile README, in 2-3 sentences.
        The user has provided the following information about themselves:
        - Their title is: "${title}"
        - They are currently learning: "${learning}"
        - They want to collaborate on: "${collaboration}"
        - Their skills include: "${skills}"

        Based on this, write a creative and engaging bio.
        For example: "I'm a passionate developer, currently diving deep into [learning]. I'm always looking for exciting projects to collaborate on, especially in the world of [collaboration]."
        Keep it concise and professional.
    `;

    const descriptionTextarea = document.getElementById('ghDescription');
    const originalText = descriptionTextarea.value;
    descriptionTextarea.value = "🤖 Generating with AI...";

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.candidates && data.candidates.length > 0) {
            const generatedText = data.candidates[0].content.parts[0].text;
            descriptionTextarea.value = generatedText;
            generateMarkdown(); // Update the preview
        } else {
            descriptionTextarea.value = originalText; // Restore original text on failure
            showToast('Sorry, the AI could not generate content. Please try again.', 4000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        descriptionTextarea.value = originalText; // Restore original text on error
        showToast('Failed to generate content. Check your API key or the console for errors.', 5000);
    });
}

// GitHub Commit (Coming Soon)
function commitToGitHub() {
    showToast('GitHub commit feature coming soon! 🚀', 3000);
}

// Show toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow and add visible class
    toast.offsetHeight;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
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

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeSkills();
    initializePreviewUpdates();
    initializePreviewToggle();
    generateMarkdown(); // Generate initial preview
});

// Back button functionality
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Fetch GitHub info button functionality
document.querySelector('.fetch-btn').addEventListener('click', fetchGitHubInfo);

// Settings Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = settingsModal.querySelector('.close-modal');
    const saveSettingsButton = document.getElementById('saveSettings');
    const apiKeyInput = document.getElementById('apiKey');

    // Load API Key from localStorage
    if (apiKeyInput) {
        apiKeyInput.value = localStorage.getItem('googleAiApiKey') || '';
    }

    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            settingsModal.style.display = 'block';
        });
    }

    if (closeSettingsModal) {
        closeSettingsModal.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    }

    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', () => {
            if (apiKeyInput) {
                localStorage.setItem('googleAiApiKey', apiKeyInput.value);
                showToast('API Key saved!', 2000);
            }
            settingsModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
});
