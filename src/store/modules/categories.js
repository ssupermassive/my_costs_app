import {
    DATA_TOKEN, 
    DEFAULT_CATEGORIES, 
    CATEGORIES_ICONS,
    DEMO_CATEGORIES
} from '../data/categories';

import {
    UPDATE_CATEGORIES,
    UPDATE_CATEGORIES_STATE
} from '../mutationsType/categories';

import {
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    SAVE_CATEGORIES_TO_STORE,
    INIT_CATEGORIES_DATA,
    APPLY_DEMO_CATEGORIES,
    APPLY_NEW_CATEGORIES
} from '../actionsType/categories';

import {
    DELETE_COSTS_BY_CATEGORY,
    UPDATE_COSTS_BY_CATEGORY_DATA
} from '../actionsType/costs';



export default {
    state: () => ({
       items: [],
       icons: []
    }),
    mutations: {
        [UPDATE_CATEGORIES](state, categories) {
            state.items = categories;
        },
        [UPDATE_CATEGORIES_STATE](state, data) {
            state.icons = data.icons;
            state.items = data.items;
        }
    },
    actions: {
        async [CREATE_CATEGORY](store, item) {
            const newItem = {...item};
            newItem.id = Date.now();
            const items = [...store.state.items, newItem];
            await store.dispatch(APPLY_NEW_CATEGORIES, items);
        },
        async [UPDATE_CATEGORY](store, item) {
            const items = store.state.items.map((current) => {
                return current.id === item.id ? {...item} : {...current}
            });
            await store.dispatch(APPLY_NEW_CATEGORIES, items);
        },
        async [DELETE_CATEGORY](store, id) {
            const items = store.state.items.filter((item) => item.id !== id);

            await Promise.all(
                [
                store.dispatch(SAVE_CATEGORIES_TO_STORE, items),
                store.dispatch(DELETE_COSTS_BY_CATEGORY, id)
                ]
            )
        },
        [SAVE_CATEGORIES_TO_STORE](store, items) {
            localStorage.setItem(DATA_TOKEN, JSON.stringify(items));
            store.commit(UPDATE_CATEGORIES, items);
            return Promise.resolve();
        }, 
        async [APPLY_NEW_CATEGORIES](store, items) {
            await store.dispatch(SAVE_CATEGORIES_TO_STORE, items);
            await store.dispatch(UPDATE_COSTS_BY_CATEGORY_DATA, store.rootState.costs.items)
        },
        [INIT_CATEGORIES_DATA](store) {
            const savedData = localStorage.getItem(DATA_TOKEN);
            const items = savedData ? JSON.parse(savedData) : DEFAULT_CATEGORIES;
            store.commit(
                UPDATE_CATEGORIES_STATE, 
                {
                    items,
                    icons: CATEGORIES_ICONS
                }
            );
            return Promise.resolve();
        },
        async [APPLY_DEMO_CATEGORIES](store) {
            store.dispatch(SAVE_CATEGORIES_TO_STORE, DEMO_CATEGORIES);
        }
    }
}