import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { RecommendationCard } from './components/RecommendationCard';
import type { Recommendation } from './types';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyByhpyGU6Vj8SKBE_HhDnFAldglovXOZ7s');

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    if (!prompt.trim()) {
      setError('Please enter some text about your day or feelings');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const promptText = `Analyze the following text: "${prompt}" and recommend:
      - Three uplifting movies related to the mood expressed.
      - Three inspiring songs matching the emotion.
      - Three motivational quotes relevant to the sentiment.
      - Three book recommendations based on the mood.
      - Three examples of people who faced a similar situation and achieved greatness, including:
          - Name of the person.
          - A description of the situation they faced and how they overcame it.
      - Activity suggestions to improve mood based on the text.

      Respond strictly in JSON format without any additional formatting like backticks, text, or comments. The response should look like this:
      {
        "movies": ["movie1", "movie2", "movie3"],
        "songs": ["song1", "song2", "song3"],
        "quotes": ["quote1", "quote2", "quote3"],
        "books": ["book1", "book2", "book3"],
        "inspirational_people": [
          {
            "name": "Person 1",
            "situation": "Brief description of their challenge",
            "overcome": "How they overcame the challenge"
          },
          {
            "name": "Person 2",
            "situation": "Brief description of their challenge",
            "overcome": "How they overcame the challenge"
          },
          {
            "name": "Person 3",
            "situation": "Brief description of their challenge",
            "overcome": "How they overcame the challenge"
          }
        ],
        "activities": ["activity1", "activity2", "activity3"]
      }`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      console.log('AI Response:', text);

      try {
        const cleanText = text.match(/\{[\s\S]*\}/)?.[0]; // Extracts JSON part only
        const data = JSON.parse(cleanText);
        if (!data.movies || !data.quotes || !data.books || !data.songs || !data.activities || !data.inspirational_people) {
          throw new Error('Invalid response format');
        }
        setRecommendations(data);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Failed to parse AI response. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            Mood Maven <Sparkles className="w-8 h-8 text-indigo-600" />
          </h1>
          <p className="text-gray-600 text-lg">
            Share your thoughts and feelings, and let us recommend the perfect movies, books, and more! ✨
            - with love by shaaz
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <TextareaAutosize
            className="w-full p-4 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            minRows={3}
            placeholder="Tell me about your day, your feelings, or anything on your mind... 💭"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          {error && (
            <div className="mt-2 text-red-500 text-sm">
              {error}
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={analyzeText}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Analyzing...'
              ) : (
                <>
                  Get Recommendations
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecommendationCard title="Movies for You 🎬" items={recommendations.movies} type="movies" delay={0} />
            <RecommendationCard title="Inspiring Songs 🎵" items={recommendations.songs} type="songs" delay={0.1} />
            <RecommendationCard title="Motivational Quotes 💭" items={recommendations.quotes} type="quotes" delay={0.2} />
            <RecommendationCard title="Books to Read 📚" items={recommendations.books} type="books" delay={0.3} />
            <RecommendationCard title="Activities to Try ⭐" items={recommendations.activities} type="activities" delay={0.4} />
            <RecommendationCard title="Inspirational People 👥" items={recommendations.inspirational_people} type="people" delay={0.5} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
