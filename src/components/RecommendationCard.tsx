import { motion } from 'framer-motion';
import { Book, Film, MessageSquareQuote, Music, Sparkles, Users } from 'lucide-react';
import type { InspirationPerson } from '../types';

interface Props {
  title: string;
  items: string[] | InspirationPerson[];
  type: 'movies' | 'quotes' | 'books' | 'songs' | 'activities' | 'people';
  delay: number;
}

const icons = {
  movies: Film,
  quotes: MessageSquareQuote,
  books: Book,
  songs: Music,
  activities: Sparkles,
  people: Users,
};

export function RecommendationCard({ title, items, type, delay }: Props) {
  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ${type === 'people' ? 'col-span-full' : ''}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <ul className="space-y-4">
        {type === 'people' ? (
          (items as InspirationPerson[]).map((person, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <h3 className="font-semibold text-indigo-600 mb-2">{person.name}</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Situation:</span> {person.situation}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">How they overcame:</span> {person.overcome}
              </p>
            </motion.li>
          ))
        ) : (
          (items as string[]).map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + index * 0.1 }}
              className="flex items-center gap-2 text-gray-700"
            >
              <span className="text-indigo-500">•</span>
              {item}
            </motion.li>
          ))
        )}
      </ul>
    </motion.div>
  );
}