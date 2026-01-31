/**
 * Cinematic Intro Engine for Geography of Absence
 * "47 Years. One Voice." - Expanded Cut
 * 
 * Manages the 6-scene intro sequence with dynamic audio layers:
 * - Scene 0: "The Testimony" (Vahid Afkari prison audio)
 * - Scene 1: The Beginning (text reveal)
 * - Scene 2: The Roots (years timeline)
 * - Scene 3: 2026 (crack effect)
 * - Scene 4: The Meaning of the Tulip (martyrdom)
 * - Scene 5: Transition to Map (land remembers)
 */

import gsap from 'gsap';
import { getSoundEnabled } from './persistence.js';
import { getCurrentLanguage, t } from './i18n.js';

class TestimonyParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.audioLevel = 0;
        this.active = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.active = true;
        this.initParticles();
        this.animate();
    }

    stop() {
        this.active = false;
    }

    setAudioLevel(level) {
        this.audioLevel = level;
    }

    initParticles() {
        this.particles = [];
        const count = 60;
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + Math.random() * 100,
            size: 1 + Math.random() * 3,
            speed: 0.5 + Math.random() * 1.5,
            opacity: 0.1 + Math.random() * 0.4,
            drift: (Math.random() - 0.5) * 0.5
        };
    }

    animate() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.y -= p.speed * (1 + this.audioLevel * 3);
            p.x += p.drift;

            if (p.y < -20) {
                this.particles[i] = this.createParticle();
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * (1 + this.audioLevel * 0.7), 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${150 + Math.random() * 50}, 0, 0, ${p.opacity * (1 + this.audioLevel)})`;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = 'rgba(139, 0, 0, 0.5)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Audio layer volumes for each scene
const AUDIO_LAYERS = {
    0: { memory: 0.1, resistance: 0.05, silence: 0.3 },
    1: { memory: 0.4, resistance: 0.3, silence: 0.1 },  // Timeline scene
    2: { memory: 0.4, resistance: 0.05, silence: 0.3 }, // Tulip scene
    3: { memory: 0.2, resistance: 0.3, silence: 0.1 }  // Transition scene
};

const PROTESTS_DATA = {
    fa: [
        { year: "۱۳۵۷", title: "اعتراضات ۱۷ اسفند", reason: "اجباری شدن حجاب", video: "", audio: "" },
        { year: "۱۳۷۸", title: "۱۸ تیر (کوی دانشگاه)", reason: "توقیف روزنامه سلام و محدودیت مطبوعات", video: "", audio: "" },
        { year: "۱۳۸۸", title: "جنبش سبز", reason: "اعتراض به نتایج انتخابات ریاست‌جمهوری", video: "", audio: "" },
        { year: "۱۳۹۶", title: "اعتراضات دی‌ماه", reason: "گرانی و مسائل معیشتی (شروع از مشهد)", video: "", audio: "" },
        { year: "۱۳۹۸", title: "آبان خونین", reason: "افزایش ناگهانی ۳ برابری قیمت بنزین", video: "", audio: "" },
        { year: "۱۳۹۸", title: "پرواز ۷۵۲", reason: "پنهان‌کاری در شلیک به هواپیمای اوکراینی", video: "", audio: "" },
        { year: "۱۴۰۱", title: "جنبش زن، زندگی، آزادی", reason: "جان باختن مهسا امینی در بازداشت گشت ارشاد", video: "", audio: "" },
        { year: "۱۴۰۴", title: "آخرین نبرد", reason: "مطالبات معیشتی و آزادی‌های مدنی", video: "", audio: "" }
    ],
    en: [
        { year: "1979", title: "March 8 Protests", reason: "Mandatory hijab implementation", video: "", audio: "" },
        { year: "1999", title: "Student Uprising (18 Tir)", reason: "Closure of Salam newspaper & press restrictions", video: "", audio: "" },
        { year: "2009", title: "Green Movement", reason: "Protest against presidential election results", video: "", audio: "" },
        { year: "2018", title: "January Protests", reason: "Economic hardship (started in Mashhad)", video: "", audio: "" },
        { year: "2019", title: "Bloody November", reason: "Sudden 3x increase in fuel prices", video: "", audio: "" },
        { year: "2020", title: "Flight 752", reason: "Cover-up of the Ukrainian plane shootdown", video: "", audio: "" },
        { year: "2022", title: "Woman, Life, Freedom", reason: "Death of Mahsa Amini in morality police custody", video: "", audio: "" },
        { year: "2026", title: "The Final Battle", reason: "Livelihood demands and civil liberties", video: "", audio: "" }
    ]
};

// Vahid Afkari Testimony Sync (Timestamps in seconds)
const TESTIMONY_SYNC = [
    { segment: 1, start: 0.5 },
    { segment: 2, start: 4.0 },
    { segment: 3, start: 4.5 },
    {
        segment: 4,
        start: 9.0,
        words: [9.0, 9.4, 9.8, 10.3, 10.8, 11.2, 11.6, 12.1] // Estimated word beats
    }
];

// Persian translations for intro text
const INTRO_TEXT_FA = {
    scene0: {
        identity: {
            name: 'وحید افکاری',
            meta: 'اعدام ۱۳۹۹'
        },
        quote: [
            'روی صحبت من فقط با ایران نیست',
            'مخاطب من هر آدمیه که دم از انسانیت میزنه',
            'و ذره‌ای از شرافت توی وجودش هست',
            ['سکوت', 'شــمـا', 'یـعنـی', 'حمایت', 'از', 'ظــلـم', 'و', 'ظــالم']
        ]
    },
    scene1: [
        'این در ۱۴۰۴ شروع نشد.',
        '۴۷ سال پیش شروع شد.',
        'با آزادی دزدیده شده.',
        'با صداهای خاموش شده.'
    ],
    scene2: {
        years: [
            { number: '۱۳۷۸', title: 'کوی دانشگاه' },
            { number: '۱۳۸۸', title: 'جنبش سبز' },
            { number: '۱۳۹۸', title: 'آبان خونین' },
            { number: '۱۴۰۱', title: 'زن. زندگی. آزادی.' }
        ],
        text: [
            'هر قیام با گلوله پاسخ داده شد.',
            'هر سکوت با خون پرداخت شد.'
        ]
    },
    scene3: [
        'در ۱۴۰۴، ایران دوباره برخاست.',
        'نه برای اصلاحات.',
        'نه برای سازش.',
        'بلکه برای آزادی.'
    ],
    scene4: [
        'در فرهنگ ایرانی، لاله سرخ از خون می‌روید.',
        'نماد شهادت است.',
        'آنانی که می‌میرند تا ملتی زنده بماند.',
        'هر لاله یک زندگی گرفته‌شده است.',
        'هر کدام از فراموشی سر باز می‌زند.'
    ],
    scene5: ['این سرزمین هر نامی را به یاد دارد.'],
    scroll: 'برای کاوش، اسکرول کنید',
    skip: 'رد شدن'
};

export class CinematicIntro {
    constructor() {
        this.container = document.getElementById('cinematic-intro');
        this.scenes = document.querySelectorAll('.intro-scene');
        this.skipButton = document.getElementById('skip-intro');
        this.scrollHint = document.getElementById('scroll-hint');

        // Particles
        const particleCanvas = document.getElementById('testimony-particles');
        if (particleCanvas) {
            this.testimonyParticles = new TestimonyParticles(particleCanvas);
        }

        this.currentScene = 0;
        this.isComplete = false;
        this.isTransitioning = false;
        this.scrollAccumulator = 0;
        this.scrollThreshold = 1500; // Total "scroll units" to progress to next scene

        // Audio elements
        this.audioLayers = {
            memory: document.getElementById('audio-memory-layer'),
            resistance: document.getElementById('audio-resistance-layer'),
            silence: document.getElementById('audio-silence-layer')
        };

        // Scene-specific audio
        this.sceneAudio = {
            scene0: {
                vahid: document.getElementById('audio-scene0-mother'), // User renamed to vahid in HTML, check ID
                chant: document.getElementById('audio-scene0-chant'),
                wind: document.getElementById('audio-scene0-wind')
            },
            scene1: {
                azadi: document.getElementById('audio-scene1-azadi'),
                protest: document.getElementById('audio-scene1-protest')
            },
            scene2: {
                chant: document.getElementById('audio-scene2-chant'),
                woman: document.getElementById('audio-scene2-woman'),
                father: document.getElementById('audio-scene2-father')
            },
            scene3: {
                crowd: document.getElementById('audio-scene3-crowd')
            },
            scene4: {
                narrator: document.getElementById('audio-scene4-narrator')
            },
            scene3: {
                bass: document.getElementById('audio-scene5-bass')
            }
        };

        this.currentProtestIndex = 0;
        this.protestTypingInterval = null;

        this.onComplete = null;
    }

    /**
     * Initialize the cinematic intro
     */
    init() {
        this.setupEventListeners();
        this.applyLanguage();
        this.container.classList.remove('hidden');

        // Start with scene 0
        this.playScene(0);

        // Start audio layers if sound is enabled
        if (getSoundEnabled()) {
            this.startAudioLayers();
        }
    }

    /**
     * Apply current language to intro text
     */
    applyLanguage() {
        const lang = getCurrentLanguage();

        if (lang === 'fa') {
            this.applyPersianText();
            this.skipButton.textContent = INTRO_TEXT_FA.skip;
            if (this.scrollHint) {
                const textEl = this.scrollHint.querySelector('.scroll-text');
                if (textEl) textEl.textContent = INTRO_TEXT_FA.scroll;
            }
        }
    }

    /**
     * Apply Persian text to all scenes
     */
    applyPersianText() {
        // Scene 0 - Testimony
        const identityName = document.querySelector('.identity-name');
        const identityMeta = document.querySelector('.identity-meta');
        if (identityName) identityName.textContent = INTRO_TEXT_FA.scene0.identity.name;
        if (identityMeta) identityMeta.textContent = INTRO_TEXT_FA.scene0.identity.meta;

        const testimonyLines = document.querySelectorAll('.testimony-line');
        INTRO_TEXT_FA.scene0.quote.forEach((text, i) => {
            const line = testimonyLines[i];
            if (!line) return;

            if (Array.isArray(text)) {
                // Handle vertical stack for impact
                const words = line.querySelectorAll('.impact-word');
                text.forEach((wordText, wordIdx) => {
                    if (words[wordIdx]) words[wordIdx].textContent = wordText;
                });
            } else {
                line.textContent = text;
            }
        });

        // Scene 1 - Timeline (Handled dynamically in initTimeline/updateProtest)

        // Scene 2 - Tulip
        const scene2Lines = this.scenes[2].querySelectorAll('.intro-text-line');
        INTRO_TEXT_FA.scene4.forEach((text, i) => {
            if (scene2Lines[i]) scene2Lines[i].textContent = text;
        });

        // Scene 3 - Land Remembers
        const scene3Lines = this.scenes[3].querySelectorAll('.intro-text-line');
        INTRO_TEXT_FA.scene5.forEach((text, i) => {
            if (scene3Lines[i]) scene3Lines[i].textContent = text;
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.skipButton.addEventListener('click', () => this.skip());

        const handleKeydown = (e) => {
            if (e.key === 'Escape' || e.key === ' ') {
                e.preventDefault();
                this.skip();
            }
        };
        window.addEventListener('keydown', handleKeydown);

        const handleWheel = (e) => {
            if (this.isComplete || this.isTransitioning) return;
            this.handleScroll(e.deltaY);
        };

        let touchStartY = 0;
        const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
        const handleTouchMove = (e) => {
            if (this.isComplete || this.isTransitioning) return;
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            this.handleScroll(deltaY * 2);
            touchStartY = touchY;
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        this._keydownHandler = handleKeydown;
        this._wheelHandler = handleWheel;
        this._touchstartHandler = handleTouchStart;
        this._touchmoveHandler = handleTouchMove;
    }

    /**
     * Handle scroll-based progression
     */
    handleScroll(deltaY) {
        if (deltaY <= 0) return;

        if (this.scrollAccumulator > 300 && this.scrollHint) {
            this.scrollHint.classList.add('hidden');
        }

        this.scrollAccumulator += deltaY;
        this.applyMotion(deltaY);

        if (this.scrollAccumulator >= this.scrollThreshold) {
            this.scrollAccumulator = 0;
            this.progress();
        }
    }

    /**
     * Apply subtle motion/parallax
     */
    applyMotion(deltaY) {
        const currentScene = this.scenes[this.currentScene];
        if (!currentScene) return;

        const textWrapper = currentScene.querySelector('.intro-text-wrapper');
        const dust = currentScene.querySelector('.dust-particles');

        if (textWrapper) {
            gsap.to(textWrapper, {
                y: `-=${deltaY * 0.05}px`,
                duration: 0.5,
                ease: 'power1.out'
            });
        }

        if (dust) {
            gsap.to(dust, {
                y: `-=${deltaY * 0.1}px`,
                duration: 1,
                ease: 'power1.out'
            });
        }
    }

    /**
     * Progress to the next scene
     */
    progress() {
        if (this.isTransitioning) return;

        // Don't progress automatically from Timeline scene
        if (this.currentScene === 1) return;

        this.stopSceneAudio(this.currentScene);
        this.playScene(this.currentScene + 1);
    }

    /**
     * Update audio layer volumes
     */
    updateAudioLayers(sceneIndex) {
        if (!getSoundEnabled()) return;
        const layerVolumes = AUDIO_LAYERS[sceneIndex] || AUDIO_LAYERS[0];
        Object.entries(layerVolumes).forEach(([name, volume]) => {
            const audio = this.audioLayers[name];
            if (audio) gsap.to(audio, { volume, duration: 2 });
        });
    }

    /**
     * Start audio layers
     */
    startAudioLayers() {
        Object.entries(this.audioLayers).forEach(([name, audio]) => {
            if (audio) {
                audio.volume = 0;
                audio.play().catch(e => console.warn(`Audio layer ${name} failed:`, e));
            }
        });
        this.updateAudioLayers(0);
    }

    /**
     * Play scene-specific audio
     */
    playSceneAudio(sceneIndex) {
        if (!getSoundEnabled()) return;
        const sceneKey = `scene${sceneIndex}`;
        const audioSet = this.sceneAudio[sceneKey];
        if (!audioSet) return;

        Object.entries(audioSet).forEach(([name, audio]) => {
            if (audio) {
                audio.volume = 0;
                audio.play().catch(e => console.warn(`Scene audio ${name} failed:`, e));
                gsap.to(audio, { volume: 0.3, duration: 1 });
            }
        });
    }

    /**
     * Stop scene-specific audio
     */
    stopSceneAudio(sceneIndex) {
        const sceneKey = `scene${sceneIndex}`;
        const audioSet = this.sceneAudio[sceneKey];
        if (!audioSet) return;
        Object.values(audioSet).forEach(audio => {
            if (audio) {
                gsap.to(audio, {
                    volume: 0,
                    duration: 1,
                    onComplete: () => { audio.pause(); audio.currentTime = 0; }
                });
            }
        });
    }

    /**
     * Play a specific scene
     */
    playScene(index) {
        if (this.isComplete || index >= this.scenes.length) {
            this.complete();
            return;
        }

        this.isTransitioning = true;
        this.currentScene = index;
        this.scrollAccumulator = 0;

        this.scenes.forEach(scene => scene.classList.remove('active'));
        const currentScene = this.scenes[index];
        currentScene.classList.add('active');

        const textWrapper = currentScene.querySelector('.intro-text-wrapper');
        if (textWrapper) gsap.set(textWrapper, { y: 0 });

        this.updateAudioLayers(index);

        // Special handling for Scenes
        if (index === 0) {
            this.animateScene0(currentScene);
        } else if (index === 1) {
            this.initTimeline();
        } else {
            this.playSceneAudio(index);
            this.animateScene(index);
        }

        if (index === 0 && this.scrollAccumulator < 100 && this.scrollHint) {
            this.scrollHint.classList.remove('hidden');
        }

        setTimeout(() => { this.isTransitioning = false; }, 1500);
    }

    /**
     * Scene 0: The Testimony
     * Syncs Vahid Afkari's audio with typography and visuals
     */
    animateScene0(scene) {
        const identity = scene.querySelector('.testimony-identity');
        const portrait = scene.querySelector('.testimony-portrait');
        const lines = scene.querySelectorAll('.testimony-line');
        const vahidAudio = document.getElementById('audio-scene0-mother');
        const portraitGlow = scene.querySelector('.portrait-glow');

        if (!portrait) console.warn('Testimony portrait not found in current scene');
        if (!vahidAudio) console.warn('Vahid audio element not found');

        // 0. Start particles
        if (this.testimonyParticles) {
            this.testimonyParticles.start();
        }

        // 1. Identity appears first (quietly)
        gsap.delayedCall(1.2, () => {
            if (identity) identity.classList.add('visible');
        });

        // 2. Portrait appears shortly after identity
        gsap.delayedCall(2.5, () => {
            if (portrait) {
                portrait.classList.add('visible');
            }
        });

        // 3. Audio starts after identity and portrait reveal
        gsap.delayedCall(4, () => {
            this.playSceneAudio(0);

            if (vahidAudio) {
                // Monitor audio time for precise syncing and audio levels
                const checkSync = () => {
                    if (this.currentScene !== 0 || this.isComplete) {
                        vahidAudio.removeEventListener('timeupdate', checkSync);
                        if (this.testimonyParticles) this.testimonyParticles.stop();
                        return;
                    }

                    const currentTime = vahidAudio.currentTime;

                    // Simple audio level simulation for particles and pulse
                    // In a real app we'd use Web Audio API for true levels
                    // Here we'll simulate some variance during speech
                    const speechLevel = vahidAudio.paused ? 0 : 0.1 + Math.random() * 0.4;
                    if (this.testimonyParticles) {
                        this.testimonyParticles.setAudioLevel(speechLevel);
                    }

                    if (portraitGlow) {
                        gsap.set(portraitGlow, { opacity: 0.2 + speechLevel * 0.8 });
                    }

                    TESTIMONY_SYNC.forEach((segment) => {
                        const lineIdx = segment.segment - 1;
                        if (currentTime >= segment.start) {
                            const line = lines[lineIdx];
                            if (line && !line.classList.contains('visible') && !line.classList.contains('dimmed')) {
                                // Transition previous lines to dimmed
                                lines.forEach((prevLine, prevIdx) => {
                                    if (prevIdx < lineIdx) {
                                        // Keeping lines 2 and 3 active simultaneously if needed
                                        if (lineIdx === 2 && prevIdx === 1) return;
                                        prevLine.classList.add('dimmed');
                                        prevLine.classList.remove('visible');
                                    }
                                });

                                // Reveal current line
                                line.classList.add('visible');

                                // Impact line logic
                                if (line.classList.contains('impact')) {
                                    scene.classList.add('impact-active');
                                    // Hide previous lines entirely
                                    lines.forEach((prevLine, prevIdx) => {
                                        if (prevIdx < lineIdx) {
                                            const wrapper = prevLine.closest('.testimony-line-wrapper');
                                            if (wrapper) wrapper.style.display = 'none';
                                        }
                                    });
                                }
                            }

                            // Word-by-word reveal for the impact stack (segment 4)
                            if (segment.segment === 4 && segment.words) {
                                const wordElements = line.querySelectorAll('.impact-word');
                                segment.words.forEach((wordStart, wordIdx) => {
                                    if (currentTime >= wordStart) {
                                        if (wordElements[wordIdx] && !wordElements[wordIdx].classList.contains('visible')) {
                                            wordElements[wordIdx].classList.add('visible');

                                            // Shake effect on word reveal
                                            gsap.fromTo(scene,
                                                { x: -2 },
                                                { x: 2, duration: 0.05, repeat: 3, yoyo: true, onComplete: () => gsap.set(scene, { x: 0 }) }
                                            );
                                        }
                                    }
                                });
                            }
                        }
                    });
                };

                vahidAudio.addEventListener('timeupdate', checkSync);
            } else {
                // Fallback if audio fails to load properly
                lines.forEach((line, i) => {
                    gsap.delayedCall(i * 4 + 2, () => line.classList.add('visible'));
                });
            }
        });
    }

    /**
     * Animate other scenes
     */
    animateScene(index) {
        const scene = this.scenes[index];
        switch (index) {
            case 2: this.animateScene4(scene); break; // Renumbered Tulip
            case 3: this.animateScene5(scene); break; // Renumbered Transition
        }
    }

    /**
     * Initialize Timeline Scene logic
     */
    initTimeline() {
        this.currentProtestIndex = 0;
        this.setupTimelineEvents();
        this.updateProtest(true);
    }

    setupTimelineEvents() {
        const prevBtn = document.getElementById('prev-protest');
        const nextBtn = document.getElementById('next-protest');

        if (prevBtn && !prevBtn._hasHandler) {
            prevBtn.onclick = () => this.navigateProtest(-1);
            prevBtn._hasHandler = true;
        }
        if (nextBtn && !nextBtn._hasHandler) {
            nextBtn.onclick = () => this.navigateProtest(1);
            nextBtn._hasHandler = true;
        }
    }

    navigateProtest(direction) {
        const lang = getCurrentLanguage();
        const data = PROTESTS_DATA[lang];

        const nextIndex = this.currentProtestIndex + direction;

        if (nextIndex < 0) return;
        if (nextIndex >= data.length) {
            // End of timeline, move to next scene
            this.stopSceneAudio(1);
            this.playScene(2);
            return;
        }

        this.currentProtestIndex = nextIndex;
        this.updateProtest();
    }

    updateProtest(isFirst = false) {
        const lang = getCurrentLanguage();
        const protest = PROTESTS_DATA[lang][this.currentProtestIndex];

        const yearEl = document.getElementById('timeline-year');
        const titleEl = document.getElementById('protest-title');
        const reasonEl = document.getElementById('protest-reason');
        const video = document.getElementById('timeline-bg-video');
        const audio = document.getElementById('timeline-protest-audio');

        // Reset elements
        if (this.protestTypingInterval) clearInterval(this.protestTypingInterval);
        yearEl.textContent = "";

        // Visual transitions
        gsap.to([titleEl, reasonEl], {
            opacity: 0, y: 10, duration: 0.3, onComplete: () => {
                titleEl.textContent = protest.title;
                reasonEl.textContent = protest.reason;

                gsap.to([titleEl, reasonEl], { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 });
            }
        });

        // Typing effect for year
        let idx = 0;
        this.protestTypingInterval = setInterval(() => {
            if (idx < protest.year.length) {
                yearEl.textContent += protest.year[idx];
                idx++;
            } else {
                clearInterval(this.protestTypingInterval);
            }
        }, 150);

        // Audio & Video
        if (video) {
            if (protest.video) {
                video.src = protest.video;
                video.classList.remove('hidden');
                video.play();
            } else {
                video.classList.add('hidden');
                video.pause();
            }
        }

        if (audio) {
            if (protest.audio) {
                audio.src = protest.audio;
                audio.volume = 0.5;
                audio.play();
            } else {
                audio.pause();
            }
        }
    }

    animateScene1(scene) {
        const lines = scene.querySelectorAll('.intro-text-line');
        const heartbeat = scene.querySelector('.heartbeat-pulse');

        lines.forEach((line, i) => {
            gsap.to(line, {
                opacity: 1, y: 0, duration: 1.5, delay: i * 2.5, ease: 'power2.out',
                onStart: () => line.classList.add('visible')
            });
            if (i < lines.length - 1) {
                gsap.to(line, { opacity: 0, duration: 1, delay: i * 2.5 + 2 });
            }
        });
        if (heartbeat) gsap.to(heartbeat, { opacity: 1, duration: 0.5, delay: (lines.length - 1) * 2.5 });
    }

    animateScene2(scene) {
        const years = scene.querySelectorAll('.year-item');
        const textLines = scene.querySelectorAll('.scene-2-text .intro-text-line');
        this.createDustParticles(scene.querySelector('.dust-particles'));

        years.forEach((year, i) => {
            gsap.to(year, {
                opacity: 1, scale: 1, duration: 1.5, delay: i * 2, ease: 'power2.out',
                onStart: () => year.classList.add('visible'),
                onComplete: () => {
                    if (i < years.length - 1) {
                        gsap.to(year, { opacity: 0.2, scale: 0.9, duration: 0.5, delay: 1, onComplete: () => year.classList.add('passed') });
                    }
                }
            });
        });

        const textDelay = years.length * 2 + 1;
        textLines.forEach((line, i) => {
            gsap.to(line, {
                opacity: 1, y: 0, duration: 1.5, delay: textDelay + i * 2, ease: 'power2.out',
                onStart: () => line.classList.add('visible')
            });
        });
    }

    createDustParticles(container) {
        if (!container) return;
        const names = ['نام', 'Name', 'زندگی', 'Life', 'یاد', 'Memory', 'آزادی', 'Freedom'];
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('span');
            particle.className = 'dust-particle';
            particle.textContent = names[Math.floor(Math.random() * names.length)];
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.animationDuration = `${15 + Math.random() * 10}s`;
            container.appendChild(particle);
        }
    }

    animateScene3(scene) {
        const crack = scene.querySelector('.crack-effect');
        const lines = scene.querySelectorAll('.intro-text-line');
        gsap.delayedCall(2, () => { if (crack) crack.classList.add('active'); });
        lines.forEach((line, i) => {
            gsap.to(line, { opacity: 1, y: 0, duration: 1.5, delay: i * 2, ease: 'power2.out', onStart: () => line.classList.add('visible') });
        });
    }

    animateScene4(scene) {
        const lines = scene.querySelectorAll('.intro-text-line');
        lines.forEach((line, i) => {
            gsap.to(line, { opacity: 1, y: 0, duration: 2, delay: 1 + i * 2.5, ease: 'power2.out', onStart: () => line.classList.add('visible') });
        });
    }

    animateScene5(scene) {
        const lines = scene.querySelectorAll('.intro-text-line');
        lines.forEach((line, i) => {
            gsap.to(line, { opacity: 1, y: 0, duration: 1.5, delay: i * 0.5, ease: 'power2.out', onStart: () => line.classList.add('visible') });
        });
    }

    skip() {
        if (this.isComplete) return;
        Object.values(this.sceneAudio).forEach(audioSet => {
            if (audioSet) Object.values(audioSet).forEach(audio => { if (audio) { audio.pause(); audio.currentTime = 0; } });
        });
        this.complete();
    }

    complete() {
        if (this.isComplete) return;
        this.isComplete = true;

        if (this._keydownHandler) window.removeEventListener('keydown', this._keydownHandler);
        if (this._wheelHandler) window.removeEventListener('wheel', this._wheelHandler);
        if (this._touchstartHandler) window.removeEventListener('touchstart', this._touchstartHandler);
        if (this._touchmoveHandler) window.removeEventListener('touchmove', this._touchmoveHandler);

        gsap.to(this.container, {
            opacity: 0, duration: 2, ease: 'power2.in',
            onComplete: () => {
                this.container.style.display = 'none';
                if (this.onComplete) this.onComplete();
            }
        });

        if (getSoundEnabled()) {
            Object.values(this.audioLayers).forEach(audio => {
                if (audio) gsap.to(audio, { volume: 0, duration: 2, onComplete: () => audio.pause() });
            });
        }
    }
}
