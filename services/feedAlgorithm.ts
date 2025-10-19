
import { Post, Creator, PostInteractionMetrics } from '../types';

// Helper to parse subscriber string like '15.7K' into a number
const parseSubscribers = (subscribers: string): number => {
    const value = parseFloat(subscribers);
    if (subscribers.toUpperCase().includes('K')) return value * 1000;
    if (subscribers.toUpperCase().includes('M')) return value * 1000000;
    return value;
};

export const calculatePostScore = (post: Post, allCreators: Creator[]): number => {
    const now = new Date();
    const postDate = new Date(post.timestamp);
    
    // --- 1. Popularity Score (Likes & Comments) ---
    // Comments are weighted more heavily as they indicate higher engagement.
    const likeWeight = 1.5;
    const commentWeight = 3.0;
    const popularityScore = (post.likedBy.length * likeWeight) + (post.comments.length * commentWeight);

    // --- 2. Recency Score (Exponential Decay) ---
    // Newer posts get a higher score, which decays over time.
    const ageInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
    const recencyDecayFactor = 0.05; // Adjust this to control how quickly scores fall off
    const recencyScore = Math.exp(-ageInHours * recencyDecayFactor);

    // --- 3. Creator Quality Score (Based on Subscribers) ---
    // Using a logarithmic scale to give a boost to established creators 
    // without completely drowning out new ones.
    const creator = allCreators.find(c => c.id === post.creator.id);
    const subscriberCount = creator ? parseSubscribers(creator.stats.subscribers) : 0;
    const creatorScore = Math.log10(subscriberCount + 1); // +1 to avoid log(0)

    // --- 4. Content Type Multiplier ---
    // Richer media types get a boost.
    let contentTypeMultiplier = 1.0;
    if (post.media.some(m => m.type === 'video')) {
        contentTypeMultiplier = 1.4;
    } else if (post.media.length > 1) {
        contentTypeMultiplier = 1.2;
    }

    // --- 5. Randomness Factor ---
    // Adds a bit of unpredictability to the feed to surface hidden gems.
    const randomFactor = 1 + (Math.random() * 0.05); // Up to a 5% random boost

    // --- Final Score Calculation ---
    // Combine the scores with weights.
    const popularityWeight = 1.0;
    const recencyWeight = 20.0; // Give significant weight to freshness
    const creatorWeight = 5.0;

    const finalScore = 
        (
            (popularityScore * popularityWeight) + 
            (recencyScore * recencyWeight) + 
            (creatorScore * creatorWeight)
        ) 
        * contentTypeMultiplier
        * randomFactor;
    
    return finalScore;
};

/**
 * Calculates a personalized score for a post based on user interests.
 * @param post - The post to score.
 * @param allCreators - The list of all creators.
 * @param userInterests - A map of category slugs to their weight based on user subscriptions.
 * @param interactionMetrics - Optional metrics from the user's current session.
 * @returns A numerical score for the post.
 */
export const calculatePersonalizedPostScore = (
    post: Post,
    allCreators: Creator[],
    userInterests: Map<string, number>,
    interactionMetrics?: PostInteractionMetrics | null
): number => {
    // Start with the base score for guests, which covers popularity, recency, etc.
    const baseScore = calculatePostScore(post, allCreators);

    // --- 1. Interest Score Multiplier (from subscriptions) ---
    let interestMultiplier = 1.0;
    const postCategories = new Set<string>();
    if (post.creator.mainCategory) {
        postCategories.add(post.creator.mainCategory.slug);
    }
    post.creator.subCategories.forEach(sc => postCategories.add(sc.slug));

    let hasInterestMatch = false;
    postCategories.forEach(slug => {
        if (userInterests.has(slug)) {
            interestMultiplier += 0.75 * (userInterests.get(slug) || 1);
            hasInterestMatch = true;
        }
    });
    
    // --- 2. Interaction Score (from current session) ---
    let interactionScore = 0;
    if (interactionMetrics) {
        // Dwell time: 1 point for every 2 seconds, capped at 20 points.
        interactionScore += Math.min(20, (interactionMetrics.dwellTime || 0) / 2000);
        // Video completion: 15 points per completion.
        interactionScore += (interactionMetrics.videoCompletionCount || 0) * 15;
        // Text expansion: 10 points.
        interactionScore += (interactionMetrics.textExpanded ? 10 : 0);
        // Profile click: 15 points.
        interactionScore += (interactionMetrics.profileClicked ? 15 : 0);
    }
    const interactionWeight = 1.5;

    // --- 3. Exploration Boost ---
    let explorationBoost = 1.0;
    if (!hasInterestMatch) {
        if (Math.random() < 0.15) {
            explorationBoost = 1.7;
        }
    }

    // Combine base score with implicit signals
    return (baseScore * interestMultiplier * explorationBoost) + (interactionScore * interactionWeight);
};
