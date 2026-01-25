/**
 * Narrative Engine for Geography of Absence
 * Manages Acts I-III: The Unfinished Sentence and Transition
 */

import gsap from 'gsap';
import { victims, getSupabaseVictims } from '../data/victims.js';
import { t, getCurrentLanguage } from './i18n.js';

export class NarrativeManager {
    constructor() {
        this.container = document.getElementById('narrative-layer');
        this.textElement = document.getElementById('narrative-text');
        this.cursorElement = document.getElementById('narrative-cursor');
        this.hintElement = document.getElementById('scroll-hint');

        this.sentences = [
            "They were 16.",
            "They were walking home.",
            "They were learning English.",
            "They were someone’s only child.",
            "They were not a number."
        ];

        this.currentSentenceIndex = -1;
        this.isComplete = false;
        this.isTyping = false;
        this.clickCount = 0;
        this.maxSentences = 6; // After this many, the sentence breaks

        this.onComplete = null; // Callback for when narrative is done
    }

    async init() {
        // Ensure victims are loaded for dynamic sentences if needed
        await getSupabaseVictims();

        this.setupEventListeners();
        this.showNextSentence();
    }

    setupEventListeners() {
        const handleInteraction = () => {
            if (this.isTyping || this.isComplete) return;
            this.showNextSentence();
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > 20) handleInteraction();
        }, { passive: true });

        // Mobile touch
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            if (Math.abs(touchStartY - touchEndY) > 20) handleInteraction();
        }, { passive: true });
    }

    async showNextSentence() {
        this.clickCount++;

        if (this.clickCount > this.maxSentences) {
            this.handleSentenceBreak();
            return;
        }

        this.isTyping = true;

        // Fade out current text if any
        if (this.textElement.textContent) {
            await gsap.to(this.textElement, { opacity: 0, duration: 0.5 });
        }

        const sentence = this.getRandomSentence();
        this.textElement.textContent = "";
        this.textElement.style.opacity = 1;

        // Show scroll hint after first interaction
        if (this.clickCount === 1) {
            gsap.to(this.hintElement, { opacity: 0.4, duration: 2, delay: 1 });
        }

        await this.typeText(sentence);
        this.isTyping = false;
    }

    getRandomSentence() {
        // In the future, pull from victims data or localized strings
        const pool = this.sentences;
        this.currentSentenceIndex = (this.currentSentenceIndex + 1) % pool.length;
        return pool[this.currentSentenceIndex];
    }

    typeText(text) {
        return new Promise((resolve) => {
            let i = 0;
            const interval = setInterval(() => {
                this.textElement.textContent += text[i];
                i++;
                if (i === text.length) {
                    clearInterval(interval);
                    setTimeout(resolve, 500);
                }
            }, 50);
        });
    }

    async handleSentenceBreak() {
        this.isComplete = true;
        this.isTyping = true;

        // Fade out
        await gsap.to(this.textElement, { opacity: 0, duration: 0.5 });

        this.textElement.textContent = "They were...";
        this.textElement.style.opacity = 1;

        // Shake effect
        gsap.to(this.textElement, {
            x: 5,
            duration: 0.1,
            repeat: 10,
            yoyo: true,
            onComplete: async () => {
                this.textElement.classList.add('broken');

                const pivot = document.createElement('div');
                pivot.className = 'narrative-pivot';
                pivot.textContent = "The sentence ends here.\nTheir lives did not.";
                this.container.appendChild(pivot);

                gsap.fromTo(pivot,
                    { opacity: 0, y: 20 },
                    { opacity: 0.7, y: 0, duration: 2, delay: 1 }
                );

                // Wait and then trigger map transition
                setTimeout(() => {
                    if (this.onComplete) this.onComplete();
                }, 4000);
            }
        });
    }

    async transitionToMap() {
        // Act III: From Words -> Land
        // Fade backward into depth
        gsap.to(this.container, {
            opacity: 0,
            scale: 0.5,
            z: -500,
            duration: 4,
            ease: "power2.in",
            onComplete: () => {
                this.container.style.display = 'none';
            }
        });

        // Also fade the content specifically
        gsap.to('.narrative-content', {
            filter: 'blur(10px)',
            duration: 3
        });
    }
}
