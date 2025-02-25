export interface InspirationPerson {
  name: string;
  situation: string;
  overcome: string;
}

export interface Recommendation {
  movies: string[];
  quotes: string[];
  books: string[];
  songs: string[];
  activities: string[];
  inspirational_people: InspirationPerson[];
}