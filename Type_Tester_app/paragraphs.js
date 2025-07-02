// Collection of sample paragraphs for typing practice
// Each paragraph is designed to test different aspects of typing

export const paragraphs = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it perfect for testing typing skills and ensuring all keys are working properly on a keyboard.",
  
  "Technology has revolutionized the way we communicate, work, and live our daily lives. From smartphones that fit in our pockets to powerful computers that can process vast amounts of data, innovation continues to shape our future in remarkable ways.",
  
  "The art of cooking combines creativity with precision, requiring both passion and patience. A great chef understands that the finest ingredients, when prepared with care and attention to detail, can create memorable experiences that bring people together.",
  
  "Education is the most powerful weapon which you can use to change the world. It opens doors to opportunities, broadens perspectives, and empowers individuals to make meaningful contributions to society while pursuing their dreams and aspirations.",
  
  "The natural world around us is filled with incredible beauty and complexity. From the smallest microorganisms to the largest mammals, every living creature plays a vital role in maintaining the delicate balance of our ecosystem.",
  
  "Music has the extraordinary ability to transcend language barriers and connect people from different cultures and backgrounds. Whether it's classical compositions, jazz improvisations, or modern pop songs, music speaks to the human soul in universal ways.",
  
  "The process of writing requires discipline, creativity, and countless hours of revision. Great writers understand that the first draft is just the beginning, and that true excellence comes through careful editing and continuous improvement of their craft.",
  
  "Physical fitness and mental health are closely interconnected aspects of overall wellbeing. Regular exercise not only strengthens the body but also releases endorphins that improve mood, reduce stress, and enhance cognitive function throughout the day.",
  
  "The history of human civilization is marked by periods of great innovation and discovery. From the invention of the wheel to the development of the internet, each breakthrough has built upon previous knowledge to advance society forward.",
  
  "Effective communication is essential in both personal relationships and professional environments. The ability to express ideas clearly, listen actively, and respond thoughtfully can make the difference between success and failure in many situations.",
  
  "The study of astronomy reveals the incredible vastness and mystery of the universe. With billions of stars, galaxies, and celestial bodies yet to be explored, space continues to captivate scientists and dreamers alike with its endless possibilities.",
  
  "Environmental conservation is one of the most pressing challenges of our time. As climate change accelerates and natural resources become scarce, it becomes increasingly important for individuals and communities to adopt sustainable practices.",
  
  "The development of artificial intelligence represents both tremendous opportunities and significant challenges for humanity. As machines become more capable of performing complex tasks, we must carefully consider the ethical implications of this technology.",
  
  "Travel broadens the mind and enriches the soul by exposing us to different cultures, traditions, and ways of life. Each journey teaches valuable lessons about diversity, tolerance, and the common threads that connect all human beings.",
  
  "The power of friendship cannot be underestimated in its ability to provide support, joy, and meaning to our lives. True friends stand by us through difficult times, celebrate our successes, and help us become better versions of ourselves."
];

/**
 * Get a random paragraph from the collection
 * @returns {string} A random paragraph for typing practice
 */
export function getRandomParagraph() {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  return paragraphs[randomIndex];
}

/**
 * Get a specific paragraph by index
 * @param {number} index - The index of the paragraph to retrieve
 * @returns {string} The paragraph at the specified index
 */
export function getParagraphByIndex(index) {
  if (index >= 0 && index < paragraphs.length) {
    return paragraphs[index];
  }
  return getRandomParagraph();
}

/**
 * Get the total number of available paragraphs
 * @returns {number} The total count of paragraphs
 */
export function getParagraphCount() {
  return paragraphs.length;
}