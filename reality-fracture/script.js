/**
 * STRANGER THINGS TRAILER - Enhanced Auto-Play Experience
 * Smooth transitions with background flicker and dynamic effects
 */

class StrangerThingsTrailer {
    constructor() {
        this.currentScene = 0;
        this.totalScenes = 8;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        // Smooth story-driven timing for each scene
        this.sceneDurations = [3500, 5000, 5500, 5000, 6000, 5500, 6000, 7000];
        this.isSoundOn = false;
        this.flickerInterval = null;

        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.createSceneDots();
        this.createParticles();
        this.startLoading();
    }

    cacheElements() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.scenes = document.querySelectorAll('.scene');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.sceneDotsContainer = document.getElementById('scene-dots');
        this.soundToggle = document.getElementById('sound-toggle');
        this.ambientSound = document.getElementById('ambient-sound');
        this.progressFill = document.getElementById('progress-fill');
        this.particleContainer = document.getElementById('particles');
        this.lightningContainer = document.getElementById('lightning');
        this.bgFlicker = document.getElementById('bg-flicker');
        this.autoplayIndicator = document.getElementById('autoplay-indicator');
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => {
            this.pauseAutoPlay();
            this.prevScene();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.pauseAutoPlay();
            this.nextScene();
        });

        // Sound toggle
        this.soundToggle?.addEventListener('click', () => this.toggleSound());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.pauseAutoPlay();
                this.nextScene();
            } else if (e.key === 'ArrowLeft') {
                this.pauseAutoPlay();
                this.prevScene();
            } else if (e.key === 'Escape') {
                this.pauseAutoPlay();
                this.skipToEnd();
            } else if (e.key === 'p' || e.key === 'P') {
                // Toggle auto-play with P key
                if (this.isAutoPlaying) {
                    this.pauseAutoPlay();
                } else {
                    this.startAutoPlay();
                }
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                this.pauseAutoPlay();
                if (diff > 0) {
                    this.nextScene();
                } else {
                    this.prevScene();
                }
            }
        });
    }

    createSceneDots() {
        if (!this.sceneDotsContainer) return;

        for (let i = 0; i < this.totalScenes; i++) {
            const dot = document.createElement('div');
            dot.className = 'scene-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                this.pauseAutoPlay();
                this.goToScene(i);
            });
            this.sceneDotsContainer.appendChild(dot);
        }
    }

    createParticles() {
        if (!this.particleContainer) return;

        const colors = [
            'rgba(139, 26, 26, 0.5)',     // Dark red
            'rgba(30, 58, 95, 0.5)',       // Dark blue
            'rgba(100, 30, 30, 0.3)',      // Muted red
            'rgba(50, 80, 110, 0.3)'       // Muted blue
        ];

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                width: ${Math.random() * 5 + 2}px;
                height: ${Math.random() * 5 + 2}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100 + 100}%;
                animation-delay: ${Math.random() * 20}s;
                animation-duration: ${Math.random() * 18 + 12}s;
            `;
            this.particleContainer.appendChild(particle);
        }
    }

    startLoading() {
        setTimeout(() => {
            this.loadingScreen?.classList.add('hidden');

            setTimeout(() => {
                this.showScene(0);
                this.startAutoPlay();
                this.startBackgroundFlicker();
                this.triggerRandomLightning();
            }, 600);
        }, 3800);
    }

    // Background flicker effect - subtle ambient lighting
    startBackgroundFlicker() {
        if (!this.bgFlicker) return;

        const flicker = () => {
            if (document.hidden) return;

            // Random flicker intensity
            const intensity = Math.random() * 0.15 + 0.02;
            const duration = Math.random() * 150 + 50;

            // Randomly choose between red and blue tint
            const isRed = Math.random() > 0.4;
            const color = isRed
                ? `rgba(139, 26, 26, ${intensity})`
                : `rgba(30, 58, 95, ${intensity})`;

            this.bgFlicker.style.background = `radial-gradient(ellipse at ${Math.random() * 100}% ${Math.random() * 100}%, ${color} 0%, transparent 70%)`;
            this.bgFlicker.style.opacity = '1';

            setTimeout(() => {
                this.bgFlicker.style.opacity = '0';
            }, duration);

            // Schedule next flicker
            const nextFlicker = Math.random() * 3000 + 500;
            this.flickerInterval = setTimeout(flicker, nextFlicker);
        };

        // Start flickering
        setTimeout(flicker, 1000);
    }

    showScene(index) {
        if (index < 0 || index >= this.totalScenes) return;

        const previousScene = this.currentScene;

        // Smooth exit animation
        this.scenes.forEach((scene, i) => {
            if (i === previousScene && i !== index) {
                scene.classList.add('exiting');
                scene.classList.remove('active');
            }
        });

        this.currentScene = index;

        // Smooth entry animation with slight delay
        setTimeout(() => {
            this.scenes.forEach((scene, i) => {
                scene.classList.remove('exiting');
                if (i === index) {
                    scene.classList.add('active');
                }
            });
        }, 150);

        this.updateDots();
        this.updateProgress();
        this.resetSceneAnimations();

        // Trigger dramatic effects on certain scenes
        if (index === 1 || index === 4 || index === 6) {
            setTimeout(() => this.triggerLightning(), 300);
        }

        // Extra flicker on intense scenes
        if (index >= 3 && index <= 6) {
            this.triggerIntenseFlicker();
        }
    }

    triggerIntenseFlicker() {
        if (!this.bgFlicker) return;

        // Quick successive flickers
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.bgFlicker.style.background = `radial-gradient(ellipse at 50% 50%, rgba(139, 26, 26, 0.2) 0%, transparent 60%)`;
                this.bgFlicker.style.opacity = '1';

                setTimeout(() => {
                    this.bgFlicker.style.opacity = '0';
                }, 80);
            }, i * 200);
        }
    }

    resetSceneAnimations() {
        const currentSceneEl = this.scenes[this.currentScene];

        // Reset all animated elements in the current scene
        const animatedElements = currentSceneEl?.querySelectorAll('[class*="line-"], .scene-caption, .vecna-quote, .vecna-name, .eleven-line, .radio-line');

        animatedElements?.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Force reflow
            el.style.animation = '';
        });
    }

    updateDots() {
        const dots = this.sceneDotsContainer?.querySelectorAll('.scene-dot');
        dots?.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentScene);
        });
    }

    updateProgress() {
        const progress = ((this.currentScene + 1) / this.totalScenes) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
    }

    nextScene() {
        if (this.currentScene < this.totalScenes - 1) {
            this.showScene(this.currentScene + 1);
        }
    }

    prevScene() {
        if (this.currentScene > 0) {
            this.showScene(this.currentScene - 1);
        }
    }

    goToScene(index) {
        this.showScene(index);
    }

    startAutoPlay() {
        this.isAutoPlaying = true;
        this.updateAutoplayIndicator();
        this.scheduleNextScene();
    }

    scheduleNextScene() {
        if (!this.isAutoPlaying) return;

        const duration = this.sceneDurations[this.currentScene] || 5000;

        this.autoPlayInterval = setTimeout(() => {
            if (this.currentScene < this.totalScenes - 1) {
                this.showScene(this.currentScene + 1);
                this.scheduleNextScene();
            } else {
                // Loop back to beginning or stop
                this.pauseAutoPlay();
            }
        }, duration);
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
        this.updateAutoplayIndicator();
        if (this.autoPlayInterval) {
            clearTimeout(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    updateAutoplayIndicator() {
        if (this.autoplayIndicator) {
            this.autoplayIndicator.classList.toggle('active', this.isAutoPlaying);
        }
    }

    toggleSound() {
        this.isSoundOn = !this.isSoundOn;

        if (this.ambientSound) {
            if (this.isSoundOn) {
                this.ambientSound.play().catch(() => { });
                this.ambientSound.volume = 0.25;
            } else {
                this.ambientSound.pause();
            }
        }

        const icon = this.soundToggle?.querySelector('.sound-icon');
        if (icon) {
            icon.textContent = this.isSoundOn ? '🔊' : '🔇';
        }
    }

    skipToEnd() {
        this.pauseAutoPlay();
        this.showScene(this.totalScenes - 1);
    }

    triggerLightning() {
        if (!this.lightningContainer) return;

        const flash = document.createElement('div');
        flash.className = 'lightning-flash';
        this.lightningContainer.appendChild(flash);

        setTimeout(() => flash.remove(), 250);

        // Double flash
        setTimeout(() => {
            const flash2 = document.createElement('div');
            flash2.className = 'lightning-flash';
            this.lightningContainer.appendChild(flash2);
            setTimeout(() => flash2.remove(), 180);
        }, 350);
    }

    triggerRandomLightning() {
        const randomInterval = () => Math.random() * 12000 + 6000;

        const flash = () => {
            if (document.hidden) return;

            // Only on story scenes
            if (this.currentScene >= 2 && this.currentScene <= 6) {
                this.triggerLightning();
            }

            setTimeout(flash, randomInterval());
        };

        setTimeout(flash, randomInterval());
    }
}

// Glitch effect for title
function addGlitchEffect() {
    const titles = document.querySelectorAll('.stranger-title, .finale-title');

    titles.forEach(title => {
        setInterval(() => {
            if (Math.random() > 0.96) {
                const offsetX = (Math.random() - 0.5) * 6;
                const offsetY = (Math.random() - 0.5) * 4;
                title.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                title.style.textShadow = `
                    ${2 + offsetX}px 0 rgba(0, 200, 255, 0.3),
                    ${-2 - offsetX}px 0 rgba(255, 50, 50, 0.3),
                    0 0 15px rgba(139, 26, 26, 0.5)
                `;

                setTimeout(() => {
                    title.style.transform = '';
                    title.style.textShadow = '';
                }, 80);
            }
        }, 120);
    });
}

// Wave animation for radio scene
function animateWave() {
    const wavePath = document.querySelector('.wave-path');
    if (!wavePath) return;

    let offset = 0;

    setInterval(() => {
        offset += 2;
        const wave = `M0,40 Q${25 + Math.sin(offset * 0.1) * 20},${40 + Math.sin(offset * 0.15) * 15} ${75},${20 + Math.sin(offset * 0.12) * 10} T${150},${40 + Math.sin(offset * 0.1) * 8} T${225},${60 - Math.sin(offset * 0.14) * 12} T${300},${40 + Math.sin(offset * 0.11) * 10} T${375},${20 + Math.sin(offset * 0.13) * 8} T${450},${40 - Math.sin(offset * 0.1) * 6} T${500},40`;
        wavePath.setAttribute('d', wave);
    }, 50);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.trailer = new StrangerThingsTrailer();
    addGlitchEffect();
    animateWave();

    // Console easter egg
    console.log('%c⚡ STRANGER THINGS ⚡', 'color: #8b1a1a; font-size: 28px; font-weight: bold;');
    console.log('%cThe Upside Down awaits...', 'color: #1e3a5f; font-size: 14px;');
    console.log('%c🎬 Auto-playing | Press P to pause/resume', 'color: #888; font-size: 11px;');
});

// Prevent context menu
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.trailer) {
        window.trailer.pauseAutoPlay();
    }
});
