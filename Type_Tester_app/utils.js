/**
 * Utility functions for the typing speed test application
 */

/**
 * Calculate Words Per Minute (WPM) based on characters typed and time elapsed
 * Standard formula: (characters typed / 5) / (time in minutes)
 * @param {number} charactersTyped - Total number of characters typed
 * @param {number} timeInSeconds - Time elapsed in seconds
 * @returns {number} Words per minute, rounded to nearest integer
 */
export function calculateWPM(charactersTyped, timeInSeconds) {
  if (timeInSeconds === 0) return 0;
  const timeInMinutes = timeInSeconds / 60;
  const words = charactersTyped / 5; // Standard word length is 5 characters
  return Math.round(words / timeInMinutes);
}

/**
 * Calculate typing accuracy percentage
 * @param {number} correctCharacters - Number of correctly typed characters
 * @param {number} totalCharacters - Total number of characters typed
 * @returns {number} Accuracy percentage, rounded to one decimal place
 */
export function calculateAccuracy(correctCharacters, totalCharacters) {
  if (totalCharacters === 0) return 100;
  return Math.round((correctCharacters / totalCharacters) * 1000) / 10;
}

/**
 * Format time in seconds to a readable string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (e.g., "1m 30s" or "45s")
 */
export function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Debounce function to limit the frequency of function calls
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Smooth animation helper using requestAnimationFrame
 * @param {Function} callback - Function to call on each frame
 * @param {number} duration - Animation duration in milliseconds
 */
export function animateValue(callback, duration = 300) {
  const startTime = performance.now();
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    callback(easeProgress);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Generate a performance rating based on WPM
 * @param {number} wpm - Words per minute
 * @returns {object} Object containing rating and color
 */
export function getPerformanceRating(wpm) {
  if (wpm >= 70) {
    return { rating: 'Excellent', color: '#10b981', emoji: '🏆' };
  } else if (wpm >= 50) {
    return { rating: 'Good', color: '#3b82f6', emoji: '👍' };
  } else if (wpm >= 30) {
    return { rating: 'Average', color: '#f59e0b', emoji: '👌' };
  } else if (wpm >= 15) {
    return { rating: 'Below Average', color: '#ef4444', emoji: '📚' };
  } else {
    return { rating: 'Practice More', color: '#6b7280', emoji: '💪' };
  }
}

/**
 * Validate if a character is a valid typing character
 * @param {string} char - Character to validate
 * @returns {boolean} True if character is valid for typing
 */
export function isValidTypingCharacter(char) {
  // Allow letters, numbers, spaces, and common punctuation
  return /^[a-zA-Z0-9\s.,;:!?'"()\-–—]$/.test(char);
}

/**
 * Create a smooth scroll effect to an element
 * @param {HTMLElement} element - Element to scroll to
 * @param {number} duration - Scroll duration in milliseconds
 */
export function smoothScrollTo(element, duration = 500) {
  const targetPosition = element.offsetTop;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

/**
 * Play a subtle sound effect (if audio is enabled)
 * @param {string} type - Type of sound ('success', 'error', 'complete')
 */
export function playSound(type) {
  // Audio context for creating simple beep sounds
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequency based on sound type
    switch (type) {
      case 'success':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        break;
      case 'complete':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        break;
      default:
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    }
    
    // Set volume and duration
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    // Silently fail if audio is not supported
    console.log('Audio not supported or user interaction required');
  }
}