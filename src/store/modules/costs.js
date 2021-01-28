import {DATA_TOKEN, DEFAULT_COSTS, DEMO_COSTS} from '../data/costs';

import {
    UPDATE_STATISTICS,
    UPDATE_DETAILING,
    UPDATE_COSTS,
    UPDATE_COSTS_BY_CATEGORY,
    UPDATE_TOTAL,   
    UPDATE_COSTS_STATE
} from '../mutationsType/costs';

import {
    COMPUTE_STATISTICS,
    COMPUTE_DETAILING,
    COMPUTE_COSTS_BY_CATEGORY,
    CREATE_COST,
    SAVE_COSTS_TO_STORE,
    DELETE_COSTS_BY_CATEGORY,
    INIT_COSTS_DATA,
    APPLY_DEMO_COSTS,
    UPDATE_DETAILING_DATA,
    UPDATE_STATISTICS_DATA,
    UPDATE_COSTS_BY_CATEGORY_DATA,
    APPLY_NEW_COSTS
}  from '../actionsType/costs';

const MAX_ITEMS_BY_CATEGORY = 12;

export default {
    state: () => ({
        items: [],
        itemsByCategory: [],
        statistics: {colors: [], data: []},
        detailing: [],
        total: 0
    }),
    mutations: {
        [UPDATE_STATISTICS](state, statistics) {
            state.statistics = statistics;
        },
        [UPDATE_DETAILING](state, detailing) {
            state.detailing = detailing;
        },
        [UPDATE_COSTS](state, items) {
            state.items = items;
        },
        [UPDATE_COSTS_BY_CATEGORY](state, itemsByCategory) {
            state.itemsByCategory = itemsByCategory;
        },
        [UPDATE_TOTAL](state, total) {
            state.total = total;
        },
        [UPDATE_COSTS_STATE](state, data) {
            state.items = data.items;
            state.itemsByCategory = data.itemsByCategory;
            state.detailing = data.detailing;
            state.statistics = data.statistics;
            state.total = data.total;
        }
    },
    actions: {
        async [UPDATE_STATISTICS_DATA](store, items) {
            const data = await store.dispatch(COMPUTE_STATISTICS, items);
            this.commit(UPDATE_STATISTICS, data);
        },
        [UPDATE_DETAILING_DATA]() {
            // ToDo
            return Promise.resolve();
        },
        async [UPDATE_COSTS_BY_CATEGORY_DATA](store, items) {
            const {
                itemsByCategory, 
                total
            } = await store.dispatch(COMPUTE_COSTS_BY_CATEGORY, items);
            store.commit(UPDATE_COSTS_BY_CATEGORY, itemsByCategory);
            store.commit(UPDATE_TOTAL, total);
        },
        [COMPUTE_COSTS_BY_CATEGORY](store, data) {

            const items = data || store.state.items;
            let totalCosts = 0;

            // для каждой категории формируем список расходов по ней и общую сумму
            let result = store.rootState.categories.items.map((category) => {
                let total = 0;
                const costs = items.filter((cost) => {
                    const isNeeded  = cost.category === category.id;

                    if (isNeeded) {
                        total += cost.sum;
                    }

                    return isNeeded;
                });

                totalCosts += total;

                return {
                    ...category,
                    costs,
                    total
                }
            });

            // сортируем категории так, что бы категории по которым имеются расходы оказались впереди.
            // После высчитываем процент расходов по конкретной категории
            result = result.sort((a, b) => {
                return b.total - a.total;
            }).map((item) => {
                const part = Math.round(item.total * 100 / totalCosts);

                return {
                    ...item,
                    part
                }
            })

            // ищем все записи с ненулевой суммой
            const itemsWithTotal = result.filter((item) => !!item.total);

            // если таких записей больше 12 (столько выводится на экране),
            // то схлопнем 12-ю и все что за ней в одну служебную.
            if (itemsWithTotal.length > MAX_ITEMS_BY_CATEGORY) {
                const service = itemsWithTotal.slice(MAX_ITEMS_BY_CATEGORY - 1).reduce(
                    (prev, item) => {
                        prev.total += item.total;
                        prev.part += item.part;
                        return prev;
                    },
                    {total: 0, part: 0}
                );
                service.id = -1;
                service.name = 'Другие';
                service.icon = {id: -1, value: 'three-dots', color: '#CCCCCC'};
                itemsWithTotal.length = MAX_ITEMS_BY_CATEGORY;
                itemsWithTotal[MAX_ITEMS_BY_CATEGORY - 1] = service;
                result = itemsWithTotal;
            }

            return Promise.resolve(
                {
                    itemsByCategory: result, 
                    total: totalCosts
                }
            );
        },
        [COMPUTE_STATISTICS](store, items) {
                const colors = []
    
                const data = items.filter((item) => {
                    if (item.total) {
                        colors.push(item.icon.color);
                        return true;
                    }
                    return false;
                }).map((item) => {
                    return { 
                        id: item.id,
                        name: item.name, 
                        y: item.total
                    }
                });
    
                return Promise.resolve({
                    data,
                    colors
                });
        },
        [COMPUTE_DETAILING]() {
            // ToDo
            return Promise.resolve();

        },
        async [CREATE_COST](store, item) {
            const newItem = {...item};
            newItem.id = Date.now();
            const items = [newItem, ...store.state.items];
            
            await store.dispatch(APPLY_NEW_COSTS, items);
        },
        async [SAVE_COSTS_TO_STORE](store, items) {
            localStorage.setItem(DATA_TOKEN, JSON.stringify(items));
            store.commit(UPDATE_COSTS, items);
        },
        async [DELETE_COSTS_BY_CATEGORY](store, categoryKey) {
            const items = store.state.items.filter((item) => {
                return item.category !== categoryKey
            });

            await store.dispatch(APPLY_NEW_COSTS, items);
        },
        async [INIT_COSTS_DATA](store) {
            const savedData = localStorage.getItem(DATA_TOKEN);
            const items = savedData ? JSON.parse(savedData) : DEFAULT_COSTS;
            const { itemsByCategory, total } = await store.dispatch(COMPUTE_COSTS_BY_CATEGORY, items);
            const [ statistics, detailing ] = await Promise.all([
                store.dispatch(COMPUTE_STATISTICS, itemsByCategory),
                store.dispatch(COMPUTE_DETAILING, itemsByCategory),
            ]);

            this.commit(
                UPDATE_COSTS_STATE,
                {
                    items,
                    itemsByCategory,
                    statistics,
                    detailing,
                    total
                }
            );
        },
        async [APPLY_NEW_COSTS](store, items) {
            await Promise.all(
                [
                    store.dispatch(SAVE_COSTS_TO_STORE, items),
                    store.dispatch(UPDATE_COSTS_BY_CATEGORY_DATA, items)
                ]
            );
            await store.dispatch(UPDATE_STATISTICS_DATA, store.state.itemsByCategory);
        },
        async [APPLY_DEMO_COSTS](store) {
            await store.dispatch(APPLY_NEW_COSTS, DEMO_COSTS);
        }
    }
};