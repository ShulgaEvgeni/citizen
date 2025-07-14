import { INCIDENTS } from '../pages/map/MapPage';
import demoVideo1 from '../assets/video-1.mp4';
import demoVideo2 from '../assets/video-2.mp4';
import demoVideo3 from '../assets/video-3.mp4';
import demoVideo4 from '../assets/video-4.mp4'; 

export interface SimulationPoint {
  id: number;
  position: [number, number];
  title: string;
  address: string;
  description: string;
  image?: string;
  color?: string;
  updated: string;
  views: number;
  comments: Array<{
    id: number;
    user: string;
    text?: string;
    image?: string;
    time: string;
  }>;
  video?: string;
  lastCommentTime?: number; // Добавляем время последнего комментария
}

interface SimulationState {
  points: SimulationPoint[];
  startTime: number;
  isRunning: boolean;
  commentsIntervals: { [key: number]: number }; // Хранит ID интервалов для каждой точки
  center?: [number, number]; // Центр симуляции
}

const SIMULATION_DURATION = 2 * 60 * 1000; // 7 минут в миллисекундах
const POINTS_INTERVAL = 30000; // Интервал появления точек (30 секунд)
const COMMENTS_INTERVAL = 5000; // Уменьшаем интервал комментариев до 5 секунд
const RESPONSE_DELAY = 2000; // Задержка ответа на сообщение пользователя (2 секунды)

export const generateRandomPoint = (userPosition?: [number, number]): SimulationPoint => {
  // Используем переданную позицию или центр из состояния симуляции
  const state = getSimulationState();
  const center = userPosition || state.center || [55.7558, 37.6173];
  
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * 0.01; // Примерно 1 км
  const lat = center[0] + randomDistance * Math.cos(randomAngle);
  const lng = center[1] + randomDistance * Math.sin(randomAngle);

  const randomIncident = INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];

  // Всегда добавляем изображение
  const image = randomIncident.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80';
  // Случайный выбор видео
  const videos = [demoVideo1, demoVideo2, demoVideo3, demoVideo4];
  const video = videos[Math.floor(Math.random() * videos.length)];

  const point: SimulationPoint = {
    ...randomIncident,
    position: [lat, lng] as [number, number],
    comments: [],
    image,
    video,
    lastCommentTime: Date.now()
  };

  // Планируем удаление видео через 1-2 минуты
  const removeVideoDelay = (1 + Math.random()) * 60 * 1000; // 1-2 минуты
  setTimeout(() => {
    const state = getSimulationState();
    const pointIndex = state.points.findIndex(p => p.id === point.id);
    if (pointIndex !== -1) {
      state.points[pointIndex].video = undefined;
      localStorage.setItem('simulationState', JSON.stringify(state));
    }
  }, removeVideoDelay);

  return point;
};

export const generateRandomComment = (isResponse: boolean = false): SimulationPoint['comments'][0] => {
  const users = ['Алексей', 'Мария', 'Дмитрий', 'Елена', 'Сергей'];
  const texts = isResponse ? [
    'Согласен с вами',
    'Спасибо за информацию',
    'Да, я тоже это заметил',
    'Интересное наблюдение',
    'Хорошо, что вы сообщили'
  ] : [
    'Всё спокойно',
    'Вижу полицию на месте',
    'Ситуация под контролем',
    'Нужна помощь',
    'Спасибо за информацию'
  ];

  return {
    id: Date.now(),
    user: users[Math.floor(Math.random() * users.length)],
    text: texts[Math.floor(Math.random() * texts.length)],
    time: 'только что'
  };
};

const startCommentsForPoint = (pointId: number) => {
  const state = getSimulationState();
  if (!state.isRunning) return;

  const intervalId = window.setInterval(() => {
    const currentState = getSimulationState();
    if (!currentState.isRunning) {
      clearInterval(intervalId);
      return;
    }

    const pointIndex = currentState.points.findIndex(p => p.id === pointId);
    if (pointIndex !== -1) {
      const point = currentState.points[pointIndex];
      const now = Date.now();
      
      // Проверяем, прошло ли достаточно времени с последнего комментария
      if (!point.lastCommentTime || now - point.lastCommentTime >= COMMENTS_INTERVAL) {
        point.comments.push(generateRandomComment());
        point.lastCommentTime = now;
        localStorage.setItem('simulationState', JSON.stringify(currentState));
      }
    } else {
      clearInterval(intervalId);
    }
  }, 1000); // Проверяем каждую секунду

  // Сохраняем ID интервала
  state.commentsIntervals[pointId] = intervalId;
  localStorage.setItem('simulationState', JSON.stringify(state));

  // Останавливаем комментарии через 7 минут
  setTimeout(() => {
    clearInterval(intervalId);
    const finalState = getSimulationState();
    delete finalState.commentsIntervals[pointId];
    localStorage.setItem('simulationState', JSON.stringify(finalState));
  }, SIMULATION_DURATION);
};

export const startSimulation = (userPosition: [number, number]) => {
  // Очищаем localStorage
  localStorage.removeItem('simulationState');
  
  const initialState: SimulationState = {
    points: [],
    startTime: Date.now(),
    isRunning: true,
    commentsIntervals: {},
    center: userPosition
  };
  
  localStorage.setItem('simulationState', JSON.stringify(initialState));
  
  // Создаем первую точку через 8 секунд
  setTimeout(() => {
    const state = getSimulationState();
    if (state.isRunning) {
      const newPoint = generateRandomPoint();
      state.points.push(newPoint);
      localStorage.setItem('simulationState', JSON.stringify(state));
      
      // Запускаем отдельный интервал для комментариев этой точки
      startCommentsForPoint(newPoint.id);
    }
  }, 8000); // 8 секунд

  // Запускаем интервал для создания последующих точек
  const pointsInterval = setInterval(() => {
    const state = getSimulationState();
    if (!state.isRunning) {
      clearInterval(pointsInterval);
      return;
    }

    const newPoint = generateRandomPoint();
    state.points.push(newPoint);
    localStorage.setItem('simulationState', JSON.stringify(state));
    
    // Запускаем отдельный интервал для комментариев этой точки
    startCommentsForPoint(newPoint.id);
  }, POINTS_INTERVAL);

  // Останавливаем всю симуляцию через 7 минут
  setTimeout(() => {
    const state = getSimulationState();
    state.isRunning = false;
    
    // Очищаем все интервалы комментариев
    Object.values(state.commentsIntervals).forEach(intervalId => {
      clearInterval(intervalId);
    });
    
    localStorage.setItem('simulationState', JSON.stringify(state));
    clearInterval(pointsInterval);
  }, SIMULATION_DURATION);
};

export const getSimulationState = (): SimulationState => {
  return JSON.parse(localStorage.getItem('simulationState') || '{"points":[],"isRunning":false,"commentsIntervals":{}}');
};

export const updateSimulationCenter = (newCenter: [number, number]) => {
  const state = getSimulationState();
  if (state.isRunning) {
    // Обновляем центр симуляции без сброса
    state.center = newCenter;
    localStorage.setItem('simulationState', JSON.stringify(state));
  }
};

export const addCommentToPoint = (pointId: number, comment: SimulationPoint['comments'][0]) => {
  const state = getSimulationState();
  const pointIndex = state.points.findIndex(p => p.id === pointId);
  if (pointIndex !== -1) {
    const point = state.points[pointIndex];
    point.comments.push(comment);
    point.lastCommentTime = Date.now();
    localStorage.setItem('simulationState', JSON.stringify(state));

    // Добавляем ответ на сообщение пользователя через небольшую задержку
    setTimeout(() => {
      const currentState = getSimulationState();
      const currentPointIndex = currentState.points.findIndex(p => p.id === pointId);
      if (currentPointIndex !== -1) {
        currentState.points[currentPointIndex].comments.push(generateRandomComment(true));
        currentState.points[currentPointIndex].lastCommentTime = Date.now();
        localStorage.setItem('simulationState', JSON.stringify(currentState));
      }
    }, RESPONSE_DELAY);
  }
}; 