import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom'; 
import styles from './map.module.scss';
import { startSimulation, getSimulationState, addCommentToPoint } from '../../utils/simulation';
import type { SimulationPoint } from '../../utils/simulation';

const DEMO_FEATURES = [
  'Круглосуточный доступ к агенту безопасности, который может активно следить за вашей безопасностью',
  'Экстренные службы направляются на ваше точное местоположение в случае чрезвычайной ситуации',
  'Создание инцидентов для получения помощи от вашего сообщества',
  'Тихий текстовый чат с агентом, когда вам нужна помощь конфиденциально',
];

export const INCIDENTS: SimulationPoint[] = [
  // Московская область (20)
  {
    id: 1,
    position: [55.7558, 37.6173],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
    title: 'Красная площадь',
    address: 'Красная площадь, Москва',
    description: 'Главная площадь Москвы.',
    comments: [],
    updated: '1ч назад',
    views: 120,
    video: undefined
  },
  {
    id: 2,
    position: [55.7517, 37.6176],
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=200&q=80',
    color: 'red',
    title: 'Пожар',
    address: 'ул. Тверская, 7',
    description: 'Сообщение о пожаре.',
    comments: [],
    updated: '2ч назад',
    views: 98,
    video: undefined
  },
  {
    id: 3,
    position: [55.7601, 37.6187],
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=200&q=80',
    color: 'yellow',
    title: 'Пробка',
    address: 'ул. Новый Арбат',
    description: 'Большая пробка.',
    comments: [],
    updated: '3ч назад',
    views: 76,
    video: undefined
  },
  {
    id: 4,
    position: [55.7339, 37.5886],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80',
    color: 'green',
    title: 'Парк Горького',
    address: 'ул. Крымский Вал, 9',
    description: 'Всё спокойно.',
    comments: [],
    updated: '4ч назад',
    views: 110,
    video: undefined
  },
  {
    id: 5,
    position: [55.7520, 37.5950],
    image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=200&q=80',
    color: 'gray',
    title: 'Арбат',
    address: 'ул. Арбат',
    description: 'Много туристов.',
    comments: [],
    updated: '5ч назад',
    views: 85,
    video: undefined
  },
  {
    id: 6,
    position: [55.7485, 37.5377],
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80',
    title: 'Москва-Сити',
    address: 'Пресненская наб., 12',
    description: 'Деловой центр.',
    comments: [],
    updated: '6ч назад',
    views: 140,
    video: undefined
  },
  {
    id: 7,
    position: [55.7299, 37.6036],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    color: 'red',
    title: 'ДТП',
    address: 'ул. Садовая',
    description: 'Авария на дороге.',
    comments: [],
    updated: '7ч назад',
    views: 67,
    video: undefined
  },
  {
    id: 8,
    position: [55.7824, 37.5986],
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200&q=80',
    color: 'yellow',
    title: 'Праздник',
    address: 'ВДНХ',
    description: 'Массовое мероприятие.',
    comments: [],
    updated: '8ч назад',
    views: 150,
    video: undefined
  },
  {
    id: 9,
    position: [55.7033, 37.5302],
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=200&q=80',
    color: 'green',
    title: 'Лужники',
    address: 'ул. Лужники, 24',
    description: 'Спортивное событие.',
    comments: [],
    updated: '9ч назад',
    views: 60,
    video: undefined
  },
  {
    id: 10,
    position: [55.7652, 37.6387],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80',
    color: 'gray',
    title: 'Сад Эрмитаж',
    address: 'ул. Каретный Ряд, 3',
    description: 'Исторический парк.',
    comments: [],
    updated: '10ч назад',
    views: 45,
    video: undefined
  },
  {
    id: 11,
    position: [55.8000, 37.5833],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
    title: 'Север Москвы',
    address: 'ул. Ленина, 1',
    description: 'Северный район.',
    comments: [],
    updated: '11ч назад',
    views: 30,
    video: undefined
  },
  {
    id: 12,
    position: [55.7100, 37.6000],
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=200&q=80',
    color: 'red',
    title: 'Полиция',
    address: 'ул. Южная, 5',
    description: 'Полиция на месте.',
    comments: [],
    updated: '12ч назад',
    views: 22,
    video: undefined
  },
  {
    id: 13,
    position: [55.7200, 37.6500],
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=200&q=80',
    color: 'yellow',
    title: 'Маршрут изменён',
    address: 'ул. Восточная, 8',
    description: 'Изменение маршрута.',
    comments: [],
    updated: '13ч назад',
    views: 18,
    video: undefined
  },
  {
    id: 14,
    position: [55.7300, 37.6700],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80',
    color: 'green',
    title: 'Открытие',
    address: 'ул. Новая, 10',
    description: 'Открытие магазина.',
    comments: [],
    updated: '14ч назад',
    views: 12,
    video: undefined
  },
  {
    id: 15,
    position: [55.7400, 37.6800],
    image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=200&q=80',
    color: 'gray',
    title: 'Тихо',
    address: 'ул. Западная, 12',
    description: 'Всё спокойно.',
    comments: [],
    updated: '15ч назад',
    views: 8,
    video: undefined
  },
  {
    id: 16,
    position: [55.7500, 37.6900],
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80',
    title: 'Центр',
    address: 'ул. Центральная, 14',
    description: 'Центральный район.',
    comments: [],
    updated: '16ч назад',
    views: 5,
    video: undefined
  },
  {
    id: 17,
    position: [55.7600, 37.7000],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    color: 'red',
    title: 'Скорая',
    address: 'ул. Медицинская, 16',
    description: 'Вызов скорой.',
    comments: [],
    updated: '17ч назад',
    views: 3,
    video: undefined
  },
  {
    id: 18,
    position: [55.7700, 37.7100],
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200&q=80',
    color: 'yellow',
    title: 'Потеряно',
    address: 'ул. Потерянная, 18',
    description: 'Потеряна вещь.',
    comments: [],
    updated: '18ч назад',
    views: 2,
    video: undefined
  },
  {
    id: 19,
    position: [55.7800, 37.7200],
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=200&q=80',
    color: 'green',
    title: 'Найдено',
    address: 'ул. Найденная, 20',
    description: 'Найдена вещь.',
    comments: [],
    updated: '19ч назад',
    views: 1,
    video: undefined
  },
  {
    id: 20,
    position: [55.7900, 37.7300],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80',
    color: 'gray',
    title: 'Безопасно',
    address: 'ул. Безопасная, 22',
    description: 'Всё хорошо.',
    comments: [],
    updated: '20ч назад',
    views: 0,
    video: undefined
  },
  // Санкт-Петербург (20)
  {
    id: 21,
    position: [59.9343, 30.3351],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
    title: 'Невский проспект',
    address: 'Невский проспект, СПб',
    description: 'Главная улица города.',
    comments: [],
    updated: '1ч назад',
    views: 200,
    video: undefined
  },
  {
    id: 22,
    position: [59.9311, 30.3609],
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=200&q=80',
    color: 'red',
    title: 'ДТП',
    address: 'ул. Садовая, СПб',
    description: 'Авария на дороге.',
    comments: [],
    updated: '2ч назад',
    views: 180,
    video: undefined
  },
  {
    id: 23,
    position: [59.9386, 30.3141],
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=200&q=80',
    color: 'yellow',
    title: 'Пробка',
    address: 'ул. Литейный, СПб',
    description: 'Большая пробка.',
    comments: [],
    updated: '3ч назад',
    views: 160,
    video: undefined
  },
  {
    id: 24,
    position: [59.9457, 30.3896],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80',
    color: 'green',
    title: 'Парк',
    address: 'ул. Парк, СПб',
    description: 'Всё спокойно.',
    comments: [],
    updated: '4ч назад',
    views: 140,
    video: undefined
  },
  {
    id: 25,
    position: [59.9500, 30.3167],
    image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=200&q=80',
    color: 'gray',
    title: 'Петропавловская крепость',
    address: 'Петропавловская крепость, СПб',
    description: 'Историческое место.',
    comments: [],
    updated: '5ч назад',
    views: 120,
    video: undefined
  },
  {
    id: 26,
    position: [59.9600, 30.3200],
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80',
    title: 'Север СПб',
    address: 'ул. Северная, СПб',
    description: 'Северный район.',
    comments: [],
    updated: '6ч назад',
    views: 100,
    video: undefined
  },
  {
    id: 27,
    position: [59.9700, 30.3300],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    color: 'red',
    title: 'Пожар',
    address: 'ул. Пожарная, СПб',
    description: 'Сообщение о пожаре.',
    comments: [],
    updated: '7ч назад',
    views: 90,
    video: undefined
  },
  {
    id: 28,
    position: [59.9800, 30.3400],
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200&q=80',
    color: 'yellow',
    title: 'Праздник',
    address: 'ул. Праздничная, СПб',
    description: 'Массовое мероприятие.',
    comments: [],
    updated: '8ч назад',
    views: 80,
    video: undefined
  },
  {
    id: 29,
    position: [59.9900, 30.3500],
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=200&q=80',
    color: 'green',
    title: 'Стадион',
    address: 'ул. Спортивная, СПб',
    description: 'Спортивное событие.',
    comments: [],
    updated: '9ч назад',
    views: 70,
    video: undefined
  },
  {
    id: 30,
    position: [59.9950, 30.3600],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80',
    color: 'gray',
    title: 'Тихо',
    address: 'ул. Тихая, СПб',
    description: 'Всё спокойно.',
    comments: [],
    updated: '10ч назад',
    views: 60,
    video: undefined
  },
  {
    id: 31,
    position: [59.9000, 30.3000],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
    title: 'Юг СПб',
    address: 'ул. Южная, СПб',
    description: 'Южный район.',
    comments: [],
    updated: '11ч назад',
    views: 50,
    video: undefined
  },
  {
    id: 32,
    position: [59.9100, 30.3100],
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=200&q=80',
    color: 'red',
    title: 'Полиция',
    address: 'ул. Полицейская, СПб',
    description: 'Полиция на месте.',
    comments: [],
    updated: '12ч назад',
    views: 40,
    video: undefined
  },
  {
    id: 33,
    position: [59.9200, 30.3200],
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=200&q=80',
    color: 'yellow',
    title: 'Маршрут изменён',
    address: 'ул. Изменённая, СПб',
    description: 'Изменение маршрута.',
    comments: [],
    updated: '13ч назад',
    views: 30,
    video: undefined
  },
  {
    id: 34,
    position: [59.9300, 30.3300],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80',
    color: 'green',
    title: 'Открытие',
    address: 'ул. Новая, СПб',
    description: 'Открытие магазина.',
    comments: [],
    updated: '14ч назад',
    views: 20,
    video: undefined
  },
  {
    id: 35,
    position: [59.9400, 30.3400],
    image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=200&q=80',
    color: 'gray',
    title: 'Безопасно',
    address: 'ул. Безопасная, СПб',
    description: 'Всё хорошо.',
    comments: [],
    updated: '15ч назад',
    views: 10,
    video: undefined
  },
  {
    id: 36,
    position: [59.9500, 30.3500],
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80',
    title: 'Центр СПб',
    address: 'ул. Центральная, СПб',
    description: 'Центральный район.',
    comments: [],
    updated: '16ч назад',
    views: 8,
    video: undefined
  },
  {
    id: 37,
    position: [59.9600, 30.3600],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    color: 'red',
    title: 'Скорая',
    address: 'ул. Медицинская, СПб',
    description: 'Вызов скорой.',
    comments: [],
    updated: '17ч назад',
    views: 6,
    video: undefined
  },
  {
    id: 38,
    position: [59.9700, 30.3700],
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200&q=80',
    color: 'yellow',
    title: 'Потеряно',
    address: 'ул. Потерянная, СПб',
    description: 'Потеряна вещь.',
    comments: [],
    updated: '18ч назад',
    views: 4,
    video: undefined
  },
  {
    id: 39,
    position: [59.9800, 30.3800],
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=200&q=80',
    color: 'green',
    title: 'Найдено',
    address: 'ул. Найденная, СПб',
    description: 'Найдена вещь.',
    comments: [],
    updated: '19ч назад',
    views: 2,
    video: undefined
  },
  {
    id: 40,
    position: [59.9900, 30.3900],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80',
    color: 'gray',
    title: 'Тестовая точка',
    address: 'ул. Тестовая, СПб',
    description: 'Тест.',
    comments: [],
    updated: '20ч назад',
    views: 1,
    video: undefined
  },
];

function SetViewOnLocation({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 16);
  }, [position, map]);
  return null;
}

// Кастомная функция для создания иконки
function getIncidentIcon(image?: string, color?: string) {
  // Всегда используем изображение, если оно есть
  if (image) {
    let border = '#bbb';
    if (color === 'red') border = '#e53935';
    if (color === 'yellow') border = '#ffd600';
    if (color === 'green') border = '#43a047';
    if (color === 'gray') border = '#888';
    return L.divIcon({
      className: 'incident-marker-img',
      html: `<div style="width:54px;height:74px;display:flex;align-items:center;justify-content:center;background:none;"><div style='width:54px;height:74px;background:rgba(0,0,0,0.0);display:flex;align-items:center;justify-content:center;'><img src='${image}' style='width:54px;height:74px;object-fit:cover;border-radius:16px;border:3px solid ${border};box-shadow:0 2px 8px rgba(0,0,0,0.18);background:#222;'/></div></div>`,
      iconSize: [54, 74],
      iconAnchor: [27, 74],
      popupAnchor: [0, -74],
    });
  } else {
    // Если изображения нет, используем цветную точку
    let bg = '#bbb';
    if (color === 'red') bg = '#e53935';
    if (color === 'yellow') bg = '#ffd600';
    if (color === 'green') bg = '#43a047';
    if (color === 'gray') bg = '#888';
    return L.divIcon({
      className: 'incident-marker-dot',
      html: `<div style='width:28px;height:28px;border-radius:50%;background:${bg};box-shadow:0 2px 8px rgba(0,0,0,0.18);'></div>` ,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });
  }
}

// Кастомная иконка местоположения пользователя
function getUserLocationIcon() {
  return L.divIcon({
    className: 'user-location-icon',
    html: `
      <svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="28" fill="#7fa88c"/>
        <circle cx="28" cy="22" r="9" fill="#5b7f64"/>
        <path d="M28 34c-9 0-16 4.5-16 9v1h32v-1c0-4.5-7-9-16-9z" fill="#5b7f64"/>
      </svg>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

const MapPage: React.FC<{ onShowRealMapChange?: (show: boolean) => void }> = ({ onShowRealMapChange }) => {
  const [showRealMap, setShowRealMap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [activeIncident, setActiveIncident] = useState<SimulationPoint | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(INCIDENTS);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [goLiveMarker] = useState<[number, number] | null>(null);
  const [simulationPoints, setSimulationPoints] = useState<SimulationPoint[]>([]);
  const navigate = useNavigate();
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoIncident, setVideoIncident] = useState<SimulationPoint | null>(null);
  const [activeTab, setActiveTab] = useState<'Инцидент' | 'Событие'>('Инцидент');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Функция для обновления состояния из localStorage
  const updateStateFromStorage = useCallback(() => {
    const state = getSimulationState();
    setSimulationPoints(state.points);
    
    // Если у нас открыт чат, обновляем активный инцидент
    if (activeIncident) {
      const updatedPoint = state.points.find(p => p.id === activeIncident.id);
      if (updatedPoint) {
        setActiveIncident(updatedPoint);
      }
    }
  }, [activeIncident]);

  // Эффект для запуска симуляции при получении позиции
  useEffect(() => {
    if (position) {
      startSimulation(position);
    }
  }, [position]);

  // Эффект для обновления точек симуляции
  useEffect(() => {
    const interval = setInterval(() => {
      updateStateFromStorage();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateStateFromStorage]);

  // Эффект для отслеживания изменений в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      updateStateFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateStateFromStorage]);

  // Проверяем разрешение на геолокацию при монтировании
  useEffect(() => {
    if (!navigator.permissions || !navigator.geolocation) return;
    navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
      if (result.state === 'granted') {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
            setShowRealMap(true);
            onShowRealMapChange?.(true);
          },
          (e) => {
            console.log(e);
            setError('Location permission denied.')}
        );
      }
    });
  }, [onShowRealMapChange]);

  useEffect(() => {
    if (search.trim() === '') {
      setSearchResult(INCIDENTS);
    } else {
      setSearchResult(INCIDENTS.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        (i.address && i.address.toLowerCase().includes(search.toLowerCase()))
      ));
    }
  }, [search]);

  const handleShowLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (e) => {
        console.log(e);
        setError('Location permission denied.')}
    );
    setShowRealMap(true);
    onShowRealMapChange?.(true);
  };

  // Запрос разрешения на камеру при открытии Go Live
  useEffect(() => {
    if (showGoLiveModal) {
      // Сначала запрашиваем разрешение на камеру
      const constraints: MediaStreamConstraints = { 
        video: { facingMode: { exact: "environment" } }
      };

      navigator.mediaDevices?.getUserMedia(constraints)
        /* .then(stream => {
          // Останавливаем тестовый поток
          stream.getTracks().forEach(track => track.stop());
          setVideoStream(stream);
          // Теперь получаем список устройств
          return navigator.mediaDevices?.enumerateDevices();
        }) */
        .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setVideoStream(stream);
            return navigator.mediaDevices?.enumerateDevices();
          })
        .then(devices => {
          const videos = devices?.filter(d => d.kind === 'videoinput') || [];
          console.log('videos', videos);
          setVideoDevices(videos);
          // Если есть камеры и currentDeviceId не выставлен, выставляем первую
          if (videos.length > 0 && !currentDeviceId) {
            setCurrentDeviceId(videos[0].deviceId);
          }
        })
        .catch(error => {
          console.error('Ошибка при запросе разрешений на камеру:', error);
          setCameraAllowed(false);
          setShowGoLiveModal(false);
        });
    } else {
      // Сброс currentDeviceId при закрытии модалки
      setCurrentDeviceId(null);
    }
  }, [showGoLiveModal]);

  // Эффект для активации камеры после получения разрешений
/*   useEffect(() => {
    if (showGoLiveModal && currentDeviceId) {
      const constraints: MediaStreamConstraints = { 
        video: { deviceId: { exact: currentDeviceId } }
      };
      console.log('constraints', constraints);
      
      navigator.mediaDevices?.getUserMedia(constraints)
        .then(stream => {
          console.log('stream', stream);
          setCameraAllowed(true);
          setVideoStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.error('Ошибка при активации камеры:', error);
          setCameraAllowed(false);
          setShowGoLiveModal(false);
        });
    }
  }, [showGoLiveModal, currentDeviceId]); */

  // Функция для переключения камеры
  const handleSwitchCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }

    // Запускаем новый поток с новой камерой
    const constraints: MediaStreamConstraints = { 
      video: { facingMode: { exact: !isFrontCamera ? "environment" : "user" } }
    };

    navigator.mediaDevices?.getUserMedia(constraints)
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Камера переключена:', isFrontCamera ? 'на заднюю' : 'на фронтальную');
        }
        setVideoStream(stream);
      })
      .catch(error => {
        console.error('Ошибка при переключении камеры:', error);
        // В случае ошибки возвращаемся к предыдущей камере
        setIsFrontCamera(!isFrontCamera);
      });
  };

  // Функция для закрытия Go Live
  const handleCloseGoLive = () => {
    setShowGoLiveModal(false);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  };

  // Функция для начала записи
  const handleStartRecording = () => {
    if (position && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(blob);

        const newPoint: SimulationPoint = {
          id: Date.now(),
          position: position,
          title: activeTab === 'Инцидент' ? 'Новый инцидент' : 'Новое событие',
          address: 'Ваше местоположение',
          description: 'Прямая трансляция',
          updated: 'только что',
          views: 0,
          comments: [],
          color: activeTab === 'Инцидент' ? 'red' : 'green',
          video: videoUrl,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80'
        };

        // Добавляем точку в симуляцию
        const state = getSimulationState();
        state.points.push(newPoint);
        localStorage.setItem('simulationState', JSON.stringify(state));
        setSimulationPoints(state.points);
        
        setVideoIncident(newPoint);
        setShowVideoModal(true);
        setShowGoLiveModal(false);
      };

      // Начинаем запись
      mediaRecorder.start();
      
      // Останавливаем запись через 10 секунд
      setTimeout(() => {
        mediaRecorder.stop();
        // Останавливаем камеру после записи
        if (videoRef.current) {
          const stream = videoRef.current.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          videoRef.current.srcObject = null;
        }
      }, 10000);
    }
  };

  useEffect(() => {
    console.log('videoStream', videoStream);
  }, [videoStream]);

  useEffect(() => {
    if (showVideoModal && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [videoIncident?.comments, showVideoModal]);

  useEffect(() => {
    if (showVideoModal && videoIncident) {
      const updated = simulationPoints.find(p => p.id === videoIncident.id);
      if (updated) setVideoIncident(updated);
    }
  }, [simulationPoints, showVideoModal, videoIncident]);

  if (showRealMap) {
    return (
      <div style={{height: '100dvh', width: '100vw', position: 'relative', paddingBottom: 90}}>
        {/* Модалка поиска */}
        {searchOpen && (
          <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 2001, display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', alignItems: 'center', padding: '24px 16px 12px 16px'}}>
              <button onClick={() => setSearchOpen(false)} style={{width: 40, height: 40, borderRadius: '50%', background: 'rgba(60,60,60,0.95)', border: 'none', marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div style={{flex: 1, position: 'relative', display: 'flex', alignItems: 'center'}}>
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск места..."
                  style={{flex: 1, width: '100%', background: '#222', color: '#fff', border: 'none', borderRadius: 24, fontSize: 20, padding: '12px 44px 12px 44px', outline: 'none'}}
                />
                <span style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)'}}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#fff" strokeWidth="2"><circle cx="10" cy="10" r="7"/><path d="M20 20l-4-4"/></svg>
                </span>
                {search && (
                  <button onClick={()=>setSearch('')} style={{position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer'}}>&times;</button>
                )}
              </div>
            </div>
            <div style={{flex: 1, overflowY: 'auto', padding: '0 0 16px 0'}}>
              {searchResult.length === 0 && <div style={{color: '#aaa', textAlign: 'center', marginTop: 32, fontSize: 18}}>Ничего не найдено</div>}
              {searchResult.map(item => (
                <div key={item.id} onClick={() => { setFlyTo(item.position as [number, number]); setSearchOpen(false); }} style={{display: 'flex', alignItems: 'center', padding: '18px 20px', cursor: 'pointer', borderBottom: '1px solid #222'}}>
                  <div style={{width: 44, height: 44, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{color: '#fff', fontSize: 18, fontWeight: 600}}>{item.title}</div>
                    <div style={{color: '#aaa', fontSize: 15}}>{item.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Верхние кнопки поверх карты */}
        <div style={{position: 'fixed', top: 16, left: 16, zIndex: 1101}}>
          <button
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: hoverLeft ? 'rgba(60,60,60,0.95)' : 'rgba(30,30,30,0.85)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              cursor: 'pointer',
              transition: 'background 0.18s'
            }}
            onMouseEnter={() => setHoverLeft(true)}
            onMouseLeave={() => setHoverLeft(false)}
            onClick={() => navigate('/profile')}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="12" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M14 9a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M7 22c0-3 3-5 7-5s7 2 7 5" stroke="#fff" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>
        <div style={{position: 'fixed', top: 16, right: 16, zIndex: 1101}}>
          <button
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: hoverRight ? 'rgba(60,60,60,0.95)' : 'rgba(30,30,30,0.85)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              cursor: 'pointer',
              transition: 'background 0.18s'
            }}
            onMouseEnter={() => setHoverRight(true)}
            onMouseLeave={() => setHoverRight(false)}
            onClick={() => setSearchOpen(true)}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="8" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M21 21l-4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <MapContainer center={(flyTo || position) as [number, number]} zoom={16} style={{height: '100dvh', width: '100vw', paddingBottom: 90}}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
          />
          {position && (
            <Marker 
              position={position as [number, number]} 
              icon={getUserLocationIcon()}
              eventHandlers={{ click: () => setShowLocationModal(true) }}
            >
              <Popup className={styles.popup}   closeButton={false} autoPan={false}  >
                <div style={{
                  background: '#181818',
                  borderRadius: 16,
                  padding: '10px 18px 8px 18px',
                  minWidth: 120,
                  maxWidth: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{color: '#fff', fontWeight: 700, fontSize: 22, lineHeight: 1, marginBottom: 2}}>2.3K граждан</div>
                  <div style={{color: '#aaa', fontSize: 15, fontWeight: 500}}>в пределах 0.2 км</div>
                </div>
              </Popup>
            </Marker>
          )}
          {flyTo && <SetViewOnLocation position={flyTo} />}
          {position &&
          <SetViewOnLocation position={position} />
          } 
            {[...INCIDENTS, ...simulationPoints].map(point => (
              <Marker
                key={point.id}
                position={point.position}
                eventHandlers={{
                  click: () => {
                    if (point.video) {
                      setVideoIncident(point);
                      setShowVideoModal(true);
                    } else {
                      setActiveIncident(point);
                    }
                  }
                }}
                icon={getIncidentIcon(point.video ? point.image : undefined , point.color) as L.Icon}
              />
            ))} 
          {goLiveMarker && (
            <Marker 
              position={goLiveMarker} 
              icon={getIncidentIcon(undefined, 'yellow')}
              eventHandlers={{ click: () => setActiveIncident({
                id: 99999,
                position: goLiveMarker,
                color: 'yellow',
                title: 'Go Live завершён',
                address: 'Ваше местоположение',
                description: 'Трансляция завершена.',
                updated: 'только что',
                views: 0,
                comments: []
              }) }}
            /> 
          )}
        </MapContainer>
        <div style={{
          position: 'fixed',
          top: 16,
          right: 16,
          width: 90,
          height: 90,
          background: 'rgba(30,30,30,0.7)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
        }}>
          {/* Camera preview */}
          {/* {cameraStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{width: 70, height: 50, borderRadius: 8, marginBottom: 8, objectFit: 'cover', background: '#222'}}
            />
          ) : (
            <div style={{width: 70, height: 50, background: '#222', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12}}>
              Camera
            </div>
          )}
          <div style={{display: 'flex', gap: 8}}>
            <span style={{width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 1l4 4-4 4"/><path d="M21 5H7a4 4 0 0 0 0 8h1"/><path d="M7 23l-4-4 4-4"/><path d="M3 19h14a4 4 0 0 0 0-8h-1"/></svg>
            </span>
            <span style={{width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/></svg>
            </span>
          </div> */}
        </div>
        {/*
        <div style={{position: 'fixed', left: 0, bottom: 0, width: '100vw', background: 'rgba(0,0,0,0.95)', padding: '16px 8px 24px 8px', display: 'flex', gap: 8, zIndex: 1000}}>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Message Agent..."
            style={{flex: 1, borderRadius: 24, border: 'none', padding: '12px 16px', fontSize: 16, outline: 'none'}}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button
            onClick={handleSend}
            style={{background: '#1856f5', color: '#fff', border: 'none', borderRadius: 24, padding: '0 24px', fontSize: 16, fontWeight: 700, cursor: 'pointer'}}
          >
            Send
          </button>
        </div>
        */}
        {activeIncident && (
          <>
            {showComments && (
              <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 3000, display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', alignItems: 'center', padding: '20px 16px 12px 16px'}}>
                  <button onClick={() => setShowComments(false)} style={{width: 40, height: 40, borderRadius: '50%', background: 'rgba(60,60,60,0.95)', border: 'none', marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24}}>&larr;</button>
                  <div style={{fontSize: 20, fontWeight: 700, color: '#fff'}}>Чат · {activeIncident.comments?.length || 0}</div>
                </div>
                <div style={{flex: 1, overflowY: 'auto', padding: '0 0 12px 0'}}>
                  {activeIncident.comments?.map((c: SimulationPoint['comments'][0]) => (
                    <div key={c.id} style={{padding: '12px 20px', display: 'flex', alignItems: 'flex-start', gap: 12}}>
                      <div style={{width: 36, height: 36, borderRadius: '50%', background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18}}>{c.user[0]}</div>
                      <div style={{flex: 1}}>
                        <div style={{color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 2}}>{c.user}</div>
                        {c.text && <div style={{color: '#fff', fontSize: 16, marginBottom: c.image ? 8 : 0}}>{c.text}</div>}
                        {c.image && <img src={c.image} alt="комментарий" style={{maxWidth: 180, borderRadius: 12, marginBottom: 4}} />}
                        <div style={{color: '#aaa', fontSize: 13}}>{c.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{padding: '8px 12px 18px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0.05))', display: 'flex', alignItems: 'center', gap: 8}}>
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Написать комментарий..."
                    style={{flex: 1, borderRadius: 24, border: 'none', background: '#222', color: '#fff', fontSize: 17, padding: '12px 16px', outline: 'none'}}
                  />
                  <input type="file" accept="image/*" style={{display: 'none'}} id="comment-image-upload" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setCommentImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor="comment-image-upload" style={{cursor: 'pointer', color: '#fff', fontSize: 22, padding: '0 8px'}}>
                    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 17l2-2a2 2 0 0 1 2.8 0l2 2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                  </label>
                  <button
                    onClick={() => {
                      if (commentText.trim() || commentImage) {
                        const newComment = {
                          id: Date.now(),
                          user: 'Вы',
                          text: commentText,
                          ...(commentImage ? { image: commentImage } : {}),
                          time: 'только что'
                        };
                        addCommentToPoint(activeIncident.id, newComment);
                        setCommentText('');
                        setCommentImage(null);
                      }
                    }}
                    style={{background: '#1856f5', color: '#fff', border: 'none', borderRadius: 24, fontWeight: 700, fontSize: 17, padding: '10px 18px', marginLeft: 4, cursor: 'pointer'}}
                  >Отправить</button>
                </div>
              </div>
            )}
          <div style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#181818',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            boxShadow: '0 -2px 24px rgba(0,0,0,0.25)',
            zIndex: 2000,
            padding: 0,
            maxWidth: 480,
            margin: '0 auto',
            width: '100vw',
            color: '#fff',
              display: showComments ? 'none' : 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s',
              marginBottom: 87,
              paddingBottom: 15,
            }}>
              <div style={{padding: '20px 16px 0 16px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                  <div style={{fontSize: 28, fontWeight: 700, lineHeight: 1.1}}>{activeIncident.title}</div>
                  <button onClick={() => setActiveIncident(null)} style={{background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', marginLeft: 8}}>&times;</button>
                </div>
                <div style={{color: '#ffd700', fontSize: 15, fontWeight: 600, marginBottom: 2}}>{activeIncident.address}</div>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: 16, marginTop: 10}}>
                  <div style={{flex: 1}}>
                    <div style={{color: '#fff', fontSize: 16, marginBottom: 8}}>{activeIncident.description}</div>
                    <div style={{color: '#aaa', fontSize: 14, marginBottom: 8}}>
                      Обновлено {activeIncident.updated} · {activeIncident.views} просмотров
                    </div>
                  </div>
                  <div style={{width: 90, height: 90, borderRadius: 16, overflow: 'hidden', background: '#222', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img src={activeIncident.image} alt="incident" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0, padding: '0 16px 8px 16px', marginTop: 18}}>
                <button onClick={() => setShowComments(true)} style={{background: 'none', border: 'none', color: '#fff', fontWeight: 600, fontSize: 17, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flex: 1, justifyContent: 'flex-start'}}>
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {activeIncident.comments?.length}
                </button>
                <button style={{background: 'none', border: 'none', color: '#fff', fontWeight: 600, fontSize: 17, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flex: 1, justifyContent: 'center'}}>
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                  Подписаться
                </button>
                <button style={{background: 'none', border: 'none', color: '#fff', fontWeight: 600, fontSize: 17, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flex: 1, justifyContent: 'flex-end'}}>
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>
                  Поделиться
                </button>
              </div>
            </div>
          </>
        )}
        {/* Модалка местоположения */}
        {showLocationModal && (
          <div style={{
            position: 'fixed',
            left: '50%',
            bottom: 87,
            transform: 'translateX(-50%)',
            width: '100vw',
            maxWidth: '544px',
            background: '#181818',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            boxShadow: '0 -2px 24px rgba(0,0,0,0.25)',
            zIndex: 2000,
            color: '#fff',
          }}>
            <div style={{padding: '20px 16px'}}>
              <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16}}>
                <div>
                  <div style={{fontSize: 15, color: '#aaa', marginBottom: 4}}>0.4 км · Центр</div>
                  <div style={{fontSize: 24, fontWeight: 700, marginBottom: 8}}>Ваше местоположение</div>
                </div>
                <button 
                  onClick={() => setShowLocationModal(false)}
                  style={{background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer'}}
                >
                  &times;
                </button>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: 16,
                  background: '#222',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {/* Здесь можно добавить мини-карту или изображение локации */}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 16, marginBottom: 8}}>11 оповещений за последние 24 часа</div>
                  <button style={{
                    background: '#e53935',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 20,
                    padding: '8px 16px',
                    fontSize: 15,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                    onClick={() => {
                      setShowLocationModal(false);
                      setShowGoLiveModal(true);
                    }}
                  >
                    <span style={{display: 'flex', alignItems: 'center'}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="4"/>
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </span>
                    Начать трансляцию
                  </button>
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
                <button style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  0
                </button>
                <button style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                  Подписаться
                </button>
                <button style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 12h16M14 6l6 6-6 6"/>
                  </svg>
                  Поделиться
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Полноэкранная модалка Go Live */}
        {showGoLiveModal && cameraAllowed !== false && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 3000,
            width: '100vw',
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Верхняя панель */}
            <div style={{padding: '32px 20px 0 20px', color: '#fff'}}>
              <div style={{fontSize: 32, fontWeight: 700, marginBottom: 8}}>Начать трансляцию</div>
              <div style={{fontSize: 18, color: '#ccc', marginBottom: 0}}>12 граждан в радиусе 1.5 км</div>
              <button onClick={handleCloseGoLive} style={{position: 'absolute', top: 24, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M7 10l5 5 5-5"/></svg>
              </button>
            </div>
            {/* Видео */}
            <video ref={videoRef} autoPlay playsInline style={{flex: 1, width: '100%', height: '100%', objectFit: 'cover', background: '#000', display: 'block', position: 'absolute', top: 0, left: 0, zIndex: -1}} />
            {/* Нижняя панель */}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
              {/* Кнопка переключения камеры, только если камер больше одной */}
              {videoDevices.length > 1 && (
                <button onClick={handleSwitchCamera} style={{background: 'none', border: 'none', color: '#fff', fontSize: 32, margin: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 18a10 10 0 1 1-4.1-7.98" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
  <path d="M24 6v6h6" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
</svg></button>
              )}
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 24px'}}>
                <div style={{display: 'flex', gap: 24, marginBottom: 12}}>
                  <span 
                    style={{
                      color: '#fff', 
                      fontWeight: activeTab === 'Инцидент' ? 700 : 500, 
                      fontSize: 20,
                      opacity: activeTab === 'Инцидент' ? 1 : 0.7,
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('Инцидент')}
                  >
                    Инцидент
                  </span>
                  <span 
                    style={{
                      color: '#fff', 
                      fontWeight: activeTab === 'Событие' ? 700 : 500, 
                      fontSize: 20,
                      opacity: activeTab === 'Событие' ? 1 : 0.7,
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('Событие')}
                  >
                    Событие
                  </span>
                </div>
                <button 
                  onClick={handleStartRecording}
                  style={{
                    width: 90, 
                    height: 90, 
                    borderRadius: '50%', 
                    background: '#000', 
                    border: '6px solid #fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    boxShadow: '0 0 0 4px #222',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    background: activeTab === 'Инцидент' ? '#e53935' : '#43a047', 
                    border: '4px solid #222'
                  }}></div>
                </button>
              </div>
              <button style={{background: 'none', border: 'none', color: '#fff', fontSize: 32, margin: '0 24px'}}>
                <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16"/><path d="M18 10v16"/><path d="M10 18h16"/></svg>
              </button>
            </div>
          </div>
        )}

        {showVideoModal && videoIncident && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 4000, background: '#000',
            width: '100vw', height: '100dvh',
            overflow: 'hidden',
          }}>
            {/* Видео на весь экран */}
            <video 
              src={videoIncident.video} 
              autoPlay 
              playsInline
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100vw', height: '100dvh',
                objectFit: 'cover',
                zIndex: 4000,
                background: '#000'
              }}
            />
            {/* Верхняя панель поверх видео */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              zIndex: 4100,
              display: 'flex', alignItems: 'center', padding: 16
            }}>
              <img src={videoIncident.image} alt="" style={{width: 40, height: 40, borderRadius: '50%', marginRight: 12}} />
              <span style={{color: '#fff', fontWeight: 700, fontSize: 18}}>{videoIncident.title}</span>
              <span style={{background: '#e53935', color: '#fff', borderRadius: 8, padding: '2px 8px', marginLeft: 12, fontWeight: 600, fontSize: 14}}>ПРЯМОЙ ЭФИР</span>
              <span style={{color: '#fff', marginLeft: 'auto', fontSize: 16}}>👁 {videoIncident.views}</span>
              <button onClick={() => setShowVideoModal(false)} style={{marginLeft: 16, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer'}}>&times;</button>
            </div>
            {/* Чат поверх видео, снизу */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0, bottom: 0,
              height: '40dvh',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7)  33%, rgb(0, 0, 0, 0.5) 73%, rgba(0, 0, 0, 0))',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              zIndex: 4100
            }}>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                {videoIncident.comments.map(c => (
                  <div key={c.id} style={{color: '#fff', marginBottom: 8}}>
                    <b>{c.user}:</b> {c.text} <span style={{color: '#aaa', fontSize: 12}}>{c.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div style={{display: 'flex', padding: 12}}>
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Комментарий"
                  style={{flex: 1, borderRadius: 24, border: 'none', background: '#222', color: '#fff', fontSize: 17, padding: '12px 16px', outline: 'none'}}
                />
                <button
                  onClick={() => {
                    if (commentText.trim()) {
                      const newComment = {
                        id: Date.now(),
                        user: 'Вы',
                        text: commentText,
                        time: 'только что'
                      };
                      addCommentToPoint(videoIncident.id, newComment);
                      setCommentText('');
                    }
                  }}
                  style={{background: '#1856f5', color: '#fff', border: 'none', borderRadius: 24, fontWeight: 700, fontSize: 17, padding: '10px 18px', marginLeft: 4, cursor: 'pointer'}}
                >Отправить</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Экран с кнопкой только если разрешение не получено
  return (
    <div style={{height: '100dvh', width: '100vw', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
      <div style={{marginBottom: 32, textAlign: 'center'}}>
        <div style={{fontSize: 32, fontWeight: 700, marginBottom: 12}}>Настройка Премиум завершена</div>
        <div style={{fontSize: 18, opacity: 0.7, marginBottom: 24}}>Ваше Премиум-членство включает:</div>
        <ul style={{textAlign: 'left', fontSize: 18, lineHeight: 1.5, margin: '0 auto 24px auto', maxWidth: 400}}>
          {DEMO_FEATURES.map((f, i) => (
            <li key={i} style={{marginBottom: 10, listStyle: 'none'}}>
              <span style={{color: '#1856f5', marginRight: 8}}>✔</span>{f}
            </li>
          ))}
        </ul>
        <div style={{fontSize: 16, opacity: 0.7, marginBottom: 24}}>
          Узнайте, каково это - быть подключенным к вашему агенту безопасности
        </div>
        <button
          style={{background: '#1856f5', color: '#fff', fontSize: 20, border: 'none', borderRadius: 32, padding: '16px 32px', width: 320, maxWidth: '90vw', fontWeight: 700, cursor: 'pointer'}}
          onClick={handleShowLocation}
        >
          Показать мое местоположение
        </button>
        {error && <div style={{color: 'red', marginTop: 16}}>{error}</div>}
      </div>
    </div>
  );
};

export default MapPage; 