import {DATA_TOKEN, DEFAULT_CATEGORIES, CATEGORIES_ICONS} from '../data/categories';

export default {
    state: () => ({
       items: [],
       icons: []
    }),
    mutations: {
        updateCategories(state, categories) {
            state.items = categories;
        },
        updateCategoriesStoreState(state, data) {
            state.icons = data.icons;
            state.items = data.items;
        }
    },
    actions: {
        create(store, item) {
            const newItem = {...item};
            newItem.id = Date.now();
            const items = [...store.state.items, newItem];
            return store.dispatch('saveCategoriesInStore', items);
        },
        update(store, item) {
            const items = store.state.items.map((current) => {
                return current.id === item.id ? {...item} : {...current}
            });
            return store.dispatch('saveCategoriesInStore', items);
        },
        delete(store, id) {
            const items = store.state.items.filter((item) => item.id !== id);
            return store.dispatch('saveCategoriesInStore', items);
        },
        saveCategoriesInStore(store, items) {
            localStorage.setItem(DATA_TOKEN, JSON.stringify(items));
            store.commit('updateCategories', items);
            return Promise.resolve();
        }, 
        initCategoriesData(store) {
            const savedData = localStorage.getItem(DATA_TOKEN);
            const items = savedData ? JSON.parse(savedData) : DEFAULT_CATEGORIES;
            store.commit(
                'updateCategoriesStoreState', 
                {
                    items,
                    icons: CATEGORIES_ICONS
                }
            );
            return Promise.resolve();
        }
    }
}