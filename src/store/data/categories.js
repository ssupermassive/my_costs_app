export const CATEGORIES_ICONS = [
    {id: 1, value: 'house-door', color: '#00008B'},
    {id: 2, value: 'basket3', color: '#E9967A'},
    {id: 3, value: 'graph-up', color: '#7FFF00'},
    {id: 4, value: 'building', color: '#FF7F50'},
    {id: 5,  value: 'box-seam', color: '#FFB6C1'},
    {id: 6, value: 'cart4', color: '#006400'},
    {id: 7, value: 'controller', color: '#FFFF00'},
    {id: 8, value: 'cup', color: '#00FFFF'},
    {id: 9, value: 'gift', color: '#8A2BE2'},
    {id: 10, value: 'globe2', color: '#483D8B'},
    {id: 11, value: 'heart', color: '#FF0000'},
    {id: 12, value: 'scissors', color: '#808080'},
    {id: 13, value: 'tools', color: '#2F4F4F'},
    {id: 14, value: 'telephone', color: '#F08080'},
    {id: 15, value: 'music-note-list', color: '#FFA500'},
    {id: 16, value: 'cup-straw', color: '#00FF7F'},
    {id: 17, value: 'truck', color: '#FF4500'},
    {id: 18, value: 'tv', color: '#7B68EE'},
    {id: 19, value: 'people', color: '#8B4513'},
    {id: 20, value: 'flower1', color: '#FF00FF'},
    {id: 21, value: 'briefcase', color: ''},
    {id: 22, value: 'book', color: '#87CEEB'},
    {id: 23, value: 'film', color: '#D3D3D3'}
];

export const DEFAULT_CATEGORIES = [
    {id: 1, name: 'Жилье', icon: {id: 1, value: 'house-door', color: '#00008B'}},
    {id: 2, name: 'Продукты', icon: {id: 2, value: 'basket3', color: '#E9967A'}},
    {id: 3, name: 'Телефон', icon: {id: 14, value: 'telephone', color: '#F08080'}},
    {id: 4, name: 'Интернет', icon: {id: 10, value: 'globe2', color: '#483D8B'}},
    {id: 5, name: 'Кофебрэйк', icon: {id: 8, value: 'cup', color: '#00FFFF'}},
    {id: 6, name: 'Телевидение', icon: {id: 18, value: 'tv', color: '#7B68EE'}},
    {id: 7, name: 'Стиль', icon: {id: 12, value: 'scissors', color: '#808080'}},
    {id: 8, name: 'Игры', icon: {id: 7, value: 'controller', color: '#FFFF00'}},
    {id: 9, name: 'Бытовые расходы', icon: {id: 5, value: 'box-seam', color: '#FFB6C1'}},
    {id: 10, name: 'Подарки', icon: {id: 9,value: 'gift', color: '#8A2BE2'}}
]

export const DATA_TOKEN = "MC_CATEGORIES";

export const DEMO_CATEGORIES = [
    ...DEFAULT_CATEGORIES,
    {id: 11, name: 'Встречи', icon: {id: 19, value: 'people', color: '#8B4513'}},
    {id: 12, name: 'Книги', icon: {id: 22, value: 'book', color: '#87CEEB'}}
]