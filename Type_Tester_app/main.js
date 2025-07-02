/**
 * Typing Speed Test Application
 * A comprehensive typing test with real-time statistics and performance tracking
 */

import { getRandomParagraph } from './paragraphs.js';
import { 
  calculateWPM, 
  calculateAccuracy, 
  formatTime, 
  debounce, 
  animateValue,
  getPerformanceRating,
  playSound 
} from './utils.js';

class TypingSpeedTest {
  constructor() {
    // DOM elements
    this.textDisplay = document.getElementById('textDisplay');
    this.typingInput = document.getElementById('typingInput');
    this.wpmElement = document.getElementById('wpm');
    this.accuracyElement = document.getElementById('accuracy');
    this.timerElement = document.getElementById('timer');
    this.charactersElement = document.getElementById('characters');
    this.resetBtn = document.getElementById('resetBtn');
    this.newTextBtn = document.getElementById('newTextBtn');
    this.resultsModal = document.getElementById('resultsModal');
    this.tryAgainBtn = document.getElementById('tryAgainBtn');
    this.newTestBtn = document.getElementById('newTestBtn');

    // Test state variables
    this.currentText = '';
    this.userInput = '';
    this.startTime = null;
    this.endTime = null;
    this.timer = null;
    this.timeElapsed = 0;
    this.isTestActive = false;
    this.isTestCompleted = false;
    
    // Statistics
    this.correctCharacters = 0;
    this.incorrectCharacters = 0;
    this.totalCharactersTyped = 0;
    this.currentWPM = 0;
    this.currentAccuracy = 100;

    // Initialize the application
    this.init();
  }

  /**
   * Initialize the typing test application
   */
  init() {
    this.setupEventListeners();
    this.loadNewText();
    this.setupDebouncedUpdate();
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Input event listener with real-time updates
    this.typingInput.addEventListener('input', (e) => {
      this.handleInput(e);
    });

    // Prevent paste operation to ensure fair testing
    this.typingInput.addEventListener('paste', (e) => {
      e.preventDefault();
      this.showMessage('Pasting is not allowed during the test!', 'warning');
    });

    // Button event listeners
    this.resetBtn.addEventListener('click', () => this.resetTest());
    this.newTextBtn.addEventListener('click', () => this.loadNewText());
    this.tryAgainBtn.addEventListener('click', () => this.resetTest());
    this.newTestBtn.addEventListener('click', () => {
      this.hideResults();
      this.loadNewText();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isTestCompleted) {
        this.hideResults();
      }
    });

    // Focus management
    this.typingInput.addEventListener('focus', () => {
      this.textDisplay.classList.add('active');
    });

    this.typingInput.addEventListener('blur', () => {
      this.textDisplay.classList.remove('active');
    });
  }

  /**
   * Set up debounced update function to improve performance
   */
  setupDebouncedUpdate() {
    this.debouncedUpdateStats = debounce(() => {
      this.updateStatistics();
    }, 100);
  }

  /**
   * Handle user input and test logic
   */
  handleInput(event) {
    const inputValue = event.target.value;
    
    // Start the test on first character
    if (!this.isTestActive && inputValue.length > 0) {
      this.startTest();
    }

    // Update user input and check progress
    this.userInput = inputValue;
    this.updateDisplay();
    this.debouncedUpdateStats();

    // Check if test is completed
    if (this.userInput.length === this.currentText.length && this.isTestActive) {
      this.completeTest();
    }
  }

  /**
   * Start the typing test
   */
  startTest() {
    this.isTestActive = true;
    this.startTime = new Date();
    this.textDisplay.classList.add('active');
    
    // Start the timer
    this.timer = setInterval(() => {
      this.timeElapsed = Math.floor((new Date() - this.startTime) / 1000);
      this.timerElement.textContent = formatTime(this.timeElapsed);
    }, 1000);

    // Disable the new text button during the test
    this.newTextBtn.disabled = true;
    
    console.log('Typing test started');
  }

  /**
   * Complete the typing test
   */
  completeTest() {
    this.isTestActive = false;
    this.isTestCompleted = true;
    this.endTime = new Date();
    
    // Stop the timer
    clearInterval(this.timer);
    
    // Disable the input
    this.typingInput.disabled = true;
    
    // Calculate final statistics
    this.calculateFinalStats();
    
    // Show results after a brief delay for better UX
    setTimeout(() => {
      this.showResults();
      playSound('complete');
    }, 500);
    
    console.log('Typing test completed');
  }

  /**
   * Reset the typing test
   */
  resetTest() {
    // Stop any running timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Reset all state variables
    this.userInput = '';
    this.startTime = null;
    this.endTime = null;
    this.timeElapsed = 0;
    this.isTestActive = false;
    this.isTestCompleted = false;
    
    // Reset statistics
    this.correctCharacters = 0;
    this.incorrectCharacters = 0;
    this.totalCharactersTyped = 0;
    this.currentWPM = 0;
    this.currentAccuracy = 100;

    // Reset UI elements
    this.typingInput.value = '';
    this.typingInput.disabled = false;
    this.newTextBtn.disabled = false;
    this.textDisplay.classList.remove('active');
    
    // Reset statistics display
    this.wpmElement.textContent = '0';
    this.accuracyElement.textContent = '100%';
    this.timerElement.textContent = '0s';
    this.charactersElement.textContent = '0';

    // Update display
    this.updateDisplay();
    this.hideResults();
    
    // Focus back to input
    this.typingInput.focus();
    
    console.log('Typing test reset');
  }

  /**
   * Load a new random text for typing
   */
  loadNewText() {
    // Reset the test first
    this.resetTest();
    
    // Load new paragraph
    this.currentText = getRandomParagraph();
    this.updateDisplay();
    
    // Add loading animation
    this.textDisplay.classList.add('fade-in');
    setTimeout(() => {
      this.textDisplay.classList.remove('fade-in');
    }, 500);
    
    console.log('New text loaded');
  }

  /**
   * Update the text display with colored characters
   */
  updateDisplay() {
    let displayHTML = '';
    
    for (let i = 0; i < this.currentText.length; i++) {
      const char = this.currentText[i];
      let className = '';
      
      if (i < this.userInput.length) {
        // Character has been typed
        if (this.userInput[i] === char) {
          className = 'correct';
        } else {
          className = 'incorrect';
        }
      } else if (i === this.userInput.length) {
        // Current character to be typed
        className = 'current';
      }
      
      // Handle spaces for better visibility
      const displayChar = char === ' ' ? '&nbsp;' : char;
      displayHTML += `<span class="${className}">${displayChar}</span>`;
    }
    
    this.textDisplay.innerHTML = displayHTML;
  }

  /**
   * Update real-time statistics
   */
  updateStatistics() {
    if (!this.isTestActive) return;

    // Calculate current statistics
    this.totalCharactersTyped = this.userInput.length;
    this.correctCharacters = 0;
    this.incorrectCharacters = 0;

    // Count correct and incorrect characters
    for (let i = 0; i < this.userInput.length; i++) {
      if (this.userInput[i] === this.currentText[i]) {
        this.correctCharacters++;
      } else {
        this.incorrectCharacters++;
      }
    }

    // Calculate WPM and accuracy
    this.currentWPM = calculateWPM(this.correctCharacters, this.timeElapsed);
    this.currentAccuracy = calculateAccuracy(this.correctCharacters, this.totalCharactersTyped);

    // Update display with animations
    this.animateStatUpdate(this.wpmElement, this.currentWPM);
    this.animateStatUpdate(this.accuracyElement, `${this.currentAccuracy}%`);
    this.animateStatUpdate(this.charactersElement, this.totalCharactersTyped);
  }

  /**
   * Animate statistic updates for better visual feedback
   */
  animateStatUpdate(element, newValue) {
    element.style.transform = 'scale(1.1)';
    element.style.color = 'var(--primary-color)';
    element.textContent = newValue;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.color = '';
    }, 200);
  }

  /**
   * Calculate final statistics for the results display
   */
  calculateFinalStats() {
    const finalTimeInSeconds = Math.floor((this.endTime - this.startTime) / 1000);
    
    // Update final time display
    this.timerElement.textContent = formatTime(finalTimeInSeconds);
    
    // Calculate final metrics
    const finalWPM = calculateWPM(this.correctCharacters, finalTimeInSeconds);
    const finalAccuracy = calculateAccuracy(this.correctCharacters, this.totalCharactersTyped);
    
    // Store final results
    this.finalResults = {
      wpm: finalWPM,
      accuracy: finalAccuracy,
      time: finalTimeInSeconds,
      totalCharacters: this.totalCharactersTyped,
      correctCharacters: this.correctCharacters,
      incorrectCharacters: this.incorrectCharacters,
      rating: getPerformanceRating(finalWPM)
    };
  }

  /**
   * Show the results modal with final statistics
   */
  showResults() {
    // Update result values in the modal
    document.getElementById('finalWPM').textContent = this.finalResults.wpm;
    document.getElementById('finalAccuracy').textContent = `${this.finalResults.accuracy}%`;
    document.getElementById('finalTime').textContent = formatTime(this.finalResults.time);
    document.getElementById('finalCharacters').textContent = this.finalResults.totalCharacters;
    document.getElementById('correctChars').textContent = this.finalResults.correctCharacters;
    document.getElementById('wrongChars').textContent = this.finalResults.incorrectCharacters;

    // Show modal with animation
    this.resultsModal.classList.add('show');
    
    // Add performance rating to the title
    const resultsTitle = this.resultsModal.querySelector('h2');
    resultsTitle.innerHTML = `Test Complete! ${this.finalResults.rating.emoji}<br>
      <small style="font-size: 0.6em; color: ${this.finalResults.rating.color}">
        ${this.finalResults.rating.rating}
      </small>`;
    
    // Focus management
    this.tryAgainBtn.focus();
  }

  /**
   * Hide the results modal
   */
  hideResults() {
    this.resultsModal.classList.remove('show');
  }

  /**
   * Show temporary messages to the user
   */
  showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
      case 'success':
        messageEl.style.backgroundColor = 'var(--success-color)';
        break;
      case 'error':
        messageEl.style.backgroundColor = 'var(--error-color)';
        break;
      case 'warning':
        messageEl.style.backgroundColor = 'var(--warning-color)';
        break;
      default:
        messageEl.style.backgroundColor = 'var(--primary-color)';
    }
    
    // Add to page and animate in
    document.body.appendChild(messageEl);
    setTimeout(() => {
      messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      messageEl.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(messageEl);
      }, 300);
    }, 3000);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create typing test instance
  const typingTest = new TypingSpeedTest();
  
  // Focus on the input field
  document.getElementById('typingInput').focus();
  
  console.log('Typing Speed Test Application initialized');
});

// Handle page visibility changes to pause/resume test
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden - test paused');
  } else {
    console.log('Page visible - test resumed');
  }
});