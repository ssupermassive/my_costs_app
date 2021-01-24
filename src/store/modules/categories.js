import {
    DATA_TOKEN, 
    DEFAULT_CATEGORIES, 
    CATEGORIES_ICONS,
    DEMO_CATEGORIES
} from '../data/categories';

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
        async createCategory(store, item) {
            const newItem = {...item};
            newItem.id = Date.now();
            const items = [...store.state.items, newItem];
            await store.dispatch('saveCategoriesInStore', items);
            await store.dispatch('recalculateCostsByCategory', store.state.items)
        },
        updateCategory(store, item) {
            const items = store.state.items.map((current) => {
                return current.id === item.id ? {...item} : {...current}
            });
            return store.dispatch('saveCategoriesInStore', items);
        },
        async deleteCategory(store, id) {
            const items = store.state.items.filter((item) => item.id !== id);

            await Promise.all(
                [
                store.dispatch('saveCategoriesInStore', items),
                store.dispatch('deleteCostsByCategory', id)
                ]
            )
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
        },
        async applyDemoCategories(store) {
            store.dispatch('saveCategoriesInStore', DEMO_CATEGORIES);
        }
    }
}