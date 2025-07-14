import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom'; 
import styles from './map.module.scss';
import { startSimulation, getSimulationState, addCommentToPoint } from '../../utils/simulation';
import type { SimulationPoint } from '../../utils/simulation';

const DEMO_FEATURES = [
  '<b>Абсолютная свобода от рекламы.</b><br />Наслаждайтесь контентом в его первозданной красоте, без назойливых прерываний и отвлекающих элементов.',
  '<b>Персональный геоконтроль.</b><br />Будьте в курсе всех значимых событий в любой точке мира! Настройте уведомления на интересующие вас локации и получайте актуальную информацию мгновенно.',
  '<b>Уникальный стиль.</b><br />Преобразите свой профиль по собственному вкусу и подчеркните свой статус премиум-значком. Пусть все видят, что вы выбираете лучшее!',
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
      className: styles.incidentMarkerImg,
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
      className: styles.incidentMarkerDot,
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
    className: styles.userLocationIcon,
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

const MapPage: React.FC<{ 
   
  onOpenGoLive?: () => void;
}> = ({   onOpenGoLive }) => { 
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [activeIncident, setActiveIncident] = useState<SimulationPoint | null>(null);
  // const [showLocationModal, setShowLocationModal] = useState(false);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
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
  const [subscriptions, setSubscriptions] = useState<Set<number>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [hidePremiumButton, setHidePremiumButton] = useState(false);

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

  // Сначала показываем карту, затем проверяем разрешение на геолокацию
  useEffect(() => { 
    
    // Проверяем только если разрешение уже дано
    if (!navigator.permissions || !navigator.geolocation) {
      console.log('Geolocation not supported');
      return;
    }
    
    navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
      if (result.state === 'granted') {
        // Если разрешение уже дано, получаем позицию
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
          },
          (e) => {
            console.log('Error getting position:', e);
          }
        );
      }
    });
  }, []);

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
      return;
    }
     
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (e) => {
        console.log('Error getting position:', e);  
      }
    );
  };

  // Запрос разрешения на камеру при открытии Go Live
  useEffect(() => {
    if (showGoLiveModal) {
      // Сначала запрашиваем разрешение на камеру
      const constraints: MediaStreamConstraints = { 
        video: { facingMode: { exact: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "environment" : "user" } }
      };

      console.log('constraints', constraints);
      

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
      video: { facingMode: { exact: isFrontCamera ? "environment" : "user" } }
    };

    navigator.mediaDevices?.getUserMedia(constraints)
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Камера переключена:', !isFrontCamera ? 'на заднюю' : 'на фронтальную');
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

  // Слушаем вызовы функции onOpenGoLive извне
  useEffect(() => {
    if (onOpenGoLive) {
      const handleOpenGoLive = () => {
        setShowGoLiveModal(true);
      };
      
      // Добавляем обработчик к window для глобального доступа
      (window as Window & { openGoLiveModal?: () => void }).openGoLiveModal = handleOpenGoLive;
      
      return () => {
        delete (window as Window & { openGoLiveModal?: () => void }).openGoLiveModal;
      };
    }
  }, [onOpenGoLive]);

  // Инициализация подписок из localStorage
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions');
    if (savedSubscriptions) {
      try {
        const subscriptionIds = JSON.parse(savedSubscriptions) as number[];
        // Фильтруем только существующие ID
        const validIds = subscriptionIds.filter(id => 
          INCIDENTS.some(incident => incident.id === id) ||
          simulationPoints.some(point => point.id === id)
        );
        setSubscriptions(new Set(validIds));
        // Сохраняем обратно только валидные ID
        localStorage.setItem('subscriptions', JSON.stringify(validIds));
      } catch (error) {
        console.error('Ошибка при загрузке подписок:', error);
        localStorage.removeItem('subscriptions');
      }
    }
  }, [simulationPoints]);

  // Функция для переключения подписки
  const toggleSubscription = (incidentId: number) => {
    const newSubscriptions = new Set(subscriptions);
    if (newSubscriptions.has(incidentId)) {
      newSubscriptions.delete(incidentId);
    } else {
      newSubscriptions.add(incidentId);
    }
    setSubscriptions(newSubscriptions);
    localStorage.setItem('subscriptions', JSON.stringify(Array.from(newSubscriptions)));
  };

  // Функция для проверки подписки
  const isSubscribed = (incidentId: number) => {
    return subscriptions.has(incidentId);
  };

  // Функция для поделиться
  const handleShare = async (incident?: SimulationPoint) => {
    const shareData = {
      title: 'CITIZEN - Безопасность в реальном времени',
      text: incident 
        ? `Событие: ${incident.title} - ${incident.address}` 
        : 'Откройте для себя мир без границ с премиум-подпиской!',
      url: window.location.origin + window.location.pathname
    };

    try {
      if (navigator.share) {
        // Используем Web Share API если доступен
        await navigator.share(shareData);
      } else {
        // Fallback: копируем ссылку в буфер обмена
        await navigator.clipboard.writeText(shareData.url);
        alert('Ссылка скопирована в буфер обмена!');
      }
    } catch (error) {
      console.error('Ошибка при попытке поделиться:', error);
      // Fallback: показываем ссылку в alert
      alert(`Ссылка на приложение: ${shareData.url}`);
    }
  };

    return (
      <div className={styles.mapContainer}>
        {/* Модалка поиска */}
        {searchOpen && (
          <div className={styles.searchModal}>
            <div className={styles.searchHeader}>
              <button onClick={() => setSearchOpen(false)} className={styles.searchBackButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div className={styles.searchInputContainer}>
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск места..."
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#fff" strokeWidth="2"><circle cx="10" cy="10" r="7"/><path d="M20 20l-4-4"/></svg>
                </span>
                {search && (
                  <button onClick={()=>setSearch('')} className={styles.searchClearButton}>&times;</button>
                )}
              </div>
            </div>
            <div className={styles.searchResults}>
              {searchResult.length === 0 && <div className={styles.noResults}>Ничего не найдено</div>}
              {searchResult.map(item => (
                <div key={item.id} onClick={() => { setFlyTo(item.position as [number, number]); setSearchOpen(false); }} className={styles.searchResultItem}>
                  <div className={styles.searchResultIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                  </div>
                  <div className={styles.searchResultContent}>
                    <div className={styles.searchResultTitle}>{item.title}</div>
                    <div className={styles.searchResultAddress}>{item.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Верхние кнопки поверх карты */}
        <div className={styles.topLeftButton}>
          <button
            className={styles.topButton}
            onClick={() => navigate('/profile')}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="12" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M14 9a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M7 22c0-3 3-5 7-5s7 2 7 5" stroke="#fff" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>
        <div className={styles.topRightButton}>
          <button
            className={styles.topButton}
            onClick={() => setSearchOpen(true)}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="8" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M21 21l-4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <MapContainer zoomControl={true} center={(flyTo || position || [55.7558, 37.6173]) as [number, number]} zoom={16} className={styles.mapWrapper}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
          />
          {position && (
            <Marker 
              position={position as [number, number]} 
              icon={getUserLocationIcon()}
              // eventHandlers={{ click: () => setShowLocationModal(true) }}
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
        {activeIncident && (
          <>
            {showComments && (
              <div className={styles.chatModal}>
                <div className={styles.chatModalHeader}>
                  <button onClick={() => setShowComments(false)} className={styles.chatModalBackButton}>&larr;</button>
                  <div className={styles.chatModalTitle}>Чат · {activeIncident.comments?.length || 0}</div>
                </div>
                <div className={styles.chatModalMessages}>
                  {activeIncident.comments?.map((c: SimulationPoint['comments'][0]) => (
                    <div key={c.id} className={styles.chatMessage}>
                      <div className={styles.chatMessageAvatar}>{c.user[0]}</div>
                      <div className={styles.chatMessageContent}>
                        <div className={styles.chatMessageUser}>{c.user}</div>
                        {c.text && <div className={styles.chatMessageText}>{c.text}</div>}
                        {c.image && <img src={c.image} alt="комментарий" className={styles.chatMessageImage} />}
                        <div className={styles.chatMessageTime}>{c.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.chatInputContainer}>
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Написать комментарий..."
                    className={styles.chatInput}
                  />
                  <input type="file" accept="image/*" className={styles.chatImageUpload} id="comment-image-upload" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setCommentImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor="comment-image-upload" className={styles.chatImageUploadLabel}>
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
                    className={styles.chatSendButton}
                  >Отправить</button>
                </div>
              </div>
            )}
          <div className={styles.incidentModal} style={{display: showComments ? 'none' : 'flex'}}>
            <div className={styles.incidentModalContent}>
              <div className={styles.incidentModalHeader}>
                <div className={styles.incidentModalTitle}>{activeIncident.title}</div>
                <button onClick={() => setActiveIncident(null)} className={styles.incidentModalClose}>&times;</button>
              </div>
              <div className={styles.incidentModalAddress}>{activeIncident.address}</div>
              <div className={styles.incidentModalBody}>
                <div className={styles.incidentModalDescription}>
                  <div className={styles.incidentModalText}>{activeIncident.description}</div>
                  <div className={styles.incidentModalMeta}>
                    Обновлено {activeIncident.updated} · {activeIncident.views} просмотров
                  </div>
                </div>
                <div className={styles.incidentModalImage}>
                  <img src={activeIncident.image} alt="incident" />
                </div>
              </div>
            </div>
            <div className={styles.incidentModalActions}>
              <button onClick={() => setShowComments(true)} className={styles.incidentModalAction}>
                <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {activeIncident.comments?.length}
              </button>
              <button 
                onClick={() => toggleSubscription(activeIncident.id)}
                className={styles.incidentModalAction}
              >
                {isSubscribed(activeIncident.id) ? (
                  <>
                    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                    Подписан
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v8M8 12h8"/>
                    </svg>
                    Подписаться
                  </>
                )}
              </button>
              <button 
                onClick={() => handleShare(activeIncident)}
                className={styles.incidentModalAction}
              >
                <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 12h16M14 6l6 6-6 6"/>
                </svg>
                Поделиться
              </button>
            </div>
          </div>
          </>
        )}

        {/* Полноэкранная модалка Go Live */}
        {showGoLiveModal && cameraAllowed !== false && (
          <div className={styles.goLiveModal}>
            {/* Верхняя панель */}
            <div className={styles.goLiveHeader}>
              <div className={styles.textBlock}>
                <div className={styles.goLiveTitle}>Начать трансляцию</div>
                <div className={styles.goLiveSubtitle}>12 граждан в радиусе 1.5 км</div>
              </div>
              <button onClick={handleCloseGoLive} className={styles.goLiveCloseButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M7 10l5 5 5-5"/></svg>
              </button>
            </div>
            {/* Видео */}
            <video ref={videoRef} autoPlay playsInline className={styles.goLiveVideo} />
            {/* Нижняя панель */}
            <div className={styles.goLiveControls}>
              {/* Кнопка переключения камеры, только если камер больше одной */}
              <div className={styles.goLiveSwitchButton}>
{videoDevices.length > 1 && (
                <button onClick={handleSwitchCamera} >
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 18a10 10 0 1 1-4.1-7.98" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
  <path d="M24 6v6h6" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
</svg></button>
              )}
              </div>
              
              <div className={styles.goLiveTabContainer}>
                <div className={styles.goLiveTabs}>
                  <span 
                    className={`${styles.goLiveTab} ${activeTab === 'Инцидент' ? styles.active : ''}`}
                    onClick={() => setActiveTab('Инцидент')}
                  >
                    Инцидент
                  </span>
                  <span 
                    className={`${styles.goLiveTab} ${activeTab === 'Событие' ? styles.active : ''}`}
                    onClick={() => setActiveTab('Событие')}
                  >
                    Событие
                  </span>
                </div>
                <button 
                  onClick={handleStartRecording}
                  className={styles.goLiveRecordButton}
                >
                  <div className={`${styles.goLiveRecordInner} ${activeTab === 'Инцидент' ? styles.incident : styles.event}`}></div>
                </button>
              </div>
              <button className={styles.goLiveExtraButton}>
                <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16"/><path d="M18 10v16"/><path d="M10 18h16"/></svg>
              </button>
            </div>
          </div>
        )}

        {showVideoModal && videoIncident && (
          <div className={styles.videoModal}>
            {/* Видео на весь экран */}
            <video 
              src={videoIncident.video} 
              autoPlay 
              playsInline
              className={styles.videoModalVideo}
            />
            {/* Верхняя панель поверх видео */}
            <div className={styles.videoModalHeader}>
              <img src={videoIncident.image} alt="" className={styles.videoModalAvatar} />
              {/* <span className={styles.videoModalTitle}>{videoIncident.title}</span> */}
              <span className={styles.videoModalLive}>ПРЯМОЙ ЭФИР</span>
              <span className={styles.videoModalViews}>👁 {videoIncident.views}</span>
              <button onClick={() => setShowVideoModal(false)} className={styles.videoModalClose}>&times;</button>
            </div>
            {/* Чат поверх видео, снизу */}
            <div className={styles.videoModalChat}>
              <div className={styles.videoModalMessages}>
                {videoIncident.comments.map(c => (
                  <div key={c.id} className={styles.videoModalMessage}>
                    <b>{c.user}:</b> {c.text} <span className={styles.videoModalMessageTime}>{c.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className={styles.videoModalInputContainer}>
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Комментарий"
                  className={styles.videoModalInput}
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
                  className={styles.videoModalSendButton}
                >Отправить</button>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка премиум внизу слева */}
        {!hidePremiumButton && (
          <div className={styles.premiumButton}>
            <button
              className={styles.premiumButtonInner}
              onClick={() => setShowPremiumModal(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" fill="#fff"/>
              </svg>
            </button>
          </div>
        )}

        {/* Кнопка геопозиции внизу справа */}
        <div className={styles.locationButton}>
          <button
            className={styles.locationButtonInner}
            onClick={handleShowLocation}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#fff"/>
            </svg>
          </button>
        </div>

        {/* Модалка премиум */}
        {showPremiumModal && (
          <div className={styles.premiumModal}>
            <div className={styles.premiumModalContent}>
                <button onClick={() => setShowPremiumModal(false)} className={styles.premiumModalClose}>&times;</button>
              <div className={styles.premiumModalHeader}>
                <div className={styles.premiumModalTitle}>Откройте для себя мир без границ с премиум-подпиской!</div>
              </div>
              <div className={styles.premiumModalSubtitle}>Что ждёт вас в премиум-клубе:</div>
              <ul className={styles.premiumModalFeatures}>
                {DEMO_FEATURES.map((f, i) => (
                  <li key={i} className={styles.premiumModalFeature}>
                    <span className={styles.premiumModalFeatureIcon}>✔</span> <span dangerouslySetInnerHTML={{__html: f}} />
                  </li>
                ))}
              </ul>
              <div className={styles.premiumModalDescription}>
                Станьте частью элитарного сообщества уже сегодня. Ваш комфорт — наш приоритет!
              </div>
              <button
                className={styles.premiumModalButton}
                onClick={() => {
                  setShowPremiumModal(false);
                  setHidePremiumButton(true);
                }}
              >
                Присоединиться!
              </button>
              {/* {error && <div className={styles.premiumModalError}>{error}</div>} */}
            </div>
          </div>
        )}
      </div>
    );

  
};

export default MapPage; 