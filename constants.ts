
import { Collection, Lesson, Vocabulary } from './types';

export const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'c1', name: 'TOEIC Essentials', description: 'Common business words for TOEIC exam', category: 'Academic', imageUrl: '📈' },
  { id: 'c2', name: 'IELTS Mastery', description: 'Academic vocabulary for high scores', category: 'Academic', imageUrl: '🎓' },
  { id: 'c3', name: 'Daily Life', description: 'Essential phrases for everyday communication', category: 'General', imageUrl: '🏠' }
];

export const INITIAL_LESSONS: Lesson[] = [
  { id: 'l1', collectionId: 'c1', name: 'Office Work' },
  { id: 'l2', collectionId: 'c1', name: 'Personnel' },
  { id: 'l3', collectionId: 'c2', name: 'Environment' },
  { id: 'l4', collectionId: 'c3', name: 'Greetings' }
];

export const INITIAL_VOCABULARY: Vocabulary[] = [
  { id: '1', lessonId: 'l1', word: 'Persistence', meaning: 'Sự kiên trì', pronunciation: '/pəˈsɪstəns/', example: 'His persistence paid off when he finally got the job.' },
  { id: '2', lessonId: 'l1', word: 'Benevolent', meaning: 'Nhân từ, tốt bụng', pronunciation: '/bəˈnevələnt/', example: 'A benevolent uncle paid for her education.' },
  { id: '3', lessonId: 'l1', word: 'Ambiguous', meaning: 'Mơ hồ, nhập nhằng', pronunciation: '/æmˈbɪɡjuəs/', example: 'The ending of the movie was deliberately ambiguous.' },
  { id: '4', lessonId: 'l2', word: 'Pragmatic', meaning: 'Thực dụng, thực tế', pronunciation: '/præɡˈmætɪk/', example: 'We need to take a pragmatic approach to this problem.' },
  { id: '5', lessonId: 'l3', word: 'Resilient', meaning: 'Kiên cường, mau phục hồi', pronunciation: '/rɪˈzɪliənt/', example: 'She is a resilient girl who soon got over her disappointment.' },
  { id: '6', lessonId: 'l3', word: 'Eloquent', meaning: 'Hùng hồn, có tài hùng biện', pronunciation: '/ˈeləkwənt/', example: 'He gave an eloquent speech about human rights.' },
  { id: '7', lessonId: 'l2', word: 'Meticulous', meaning: 'Tỉ mỉ, kỹ lưỡng', pronunciation: '/məˈtɪkjələs/', example: 'Many hours of meticulous preparation have gone into writing the book.' },
  { id: '8', lessonId: 'l4', word: 'Pensive', meaning: 'Trầm ngâm, sâu sắc', pronunciation: '/ˈprensɪv/', example: 'She sat with a pensive expression on her face.' },
  { id: '9', lessonId: 'l4', word: 'Candid', meaning: 'Thật thà, ngay thẳng', pronunciation: '/ˈkændɪd/', example: 'The ex-president gave a candid interview about his life.' },
  { id: '10', lessonId: 'l2', word: 'Exuberant', meaning: 'Hồ hởi, dồi dào', pronunciation: '/ɪɡˈzjuːbərənt/', example: 'He is an exuberant person who loves life.' }
];

export const STORAGE_KEYS = {
  USER_VOCAB: 'srs_vocab_user_data',
  CUSTOM_COLLECTIONS: 'srs_vocab_custom_collections',
  CUSTOM_LESSONS: 'srs_vocab_custom_lessons',
  CUSTOM_VOCAB: 'srs_vocab_custom_vocabulary'
};

export const FUZZY_THRESHOLD = 2;
