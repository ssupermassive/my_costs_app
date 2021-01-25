import {DATA_TOKEN, DEFAULT_COSTS, DEMO_COSTS} from '../data/costs';

export default {
    state: () => ({
        items: [],
        itemsByCategory: [],
        statistics: {colors: [], data: []},
        detailing: [],
        total: 0
    }),
    mutations: {
        updateStatisticsData(state, statistics) {
            state.statistics = statistics;
        },
        updateDetailingData(state, detailing) {
            state.detailing = detailing;
        },
        updateCostsItems(state, items) {
            state.items = items;
        },
        updateCostsItemsByCategory(state, itemsByCategory) {
            state.itemsByCategory = itemsByCategory;
        },
        updateTotalCosts(state, total) {
            state.total = total;
        },
        updateCostsState(state, data) {
            state.items = data.items;
            state.itemsByCategory = data.itemsByCategory;
            state.detailing = data.detailing;
            state.statistics = data.statistics;
            state.total = data.total;
        }
    },
    actions: {
        async recalculateStatisticsData(store, items) {
            const data = await store.dispatch('getStatisticsData', items);
            this.commit('updateStatisticsData', data);
        },
        recalculateDetailingData() {
            return Promise.resolve();
        },
        async recalculateCostsByCategory(store, items) {
            const {
                itemsByCategory, 
                total
            } = await store.dispatch('getCostsGroupedByCategory', items);
            store.commit('updateCostsItemsByCategory', itemsByCategory);
            store.commit('updateTotalCosts', total);
        },
        getCostsGroupedByCategory(store, data) {

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
            });

            return Promise.resolve(
                {
                    itemsByCategory: result, 
                    total: totalCosts
                }
            );
        },
        getStatisticsData(store, items) {
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
        async createCost(store, item) {
            const newItem = {...item};
            newItem.id = Date.now();
            const items = [newItem, ...store.state.items];
            
            await Promise.all(
                [
                    store.dispatch('saveCostsInStore', items),
                    store.dispatch('recalculateCostsByCategory', items)
                ]
            );
            await store.dispatch('recalculateStatisticsData', store.state.itemsByCategory);
        },
        async saveCostsInStore(store, items) {
            localStorage.setItem(DATA_TOKEN, JSON.stringify(items));
            store.commit('updateCostsItems', items);
        },
        async deleteCostsByCategory(store, categoryKey) {
            const items = store.state.items.filter((item) => {
                return item.category !== categoryKey
            });

            await Promise.all(
                [
                    store.dispatch('saveCostsInStore', items),
                    store.dispatch('recalculateCostsByCategory', items)
                ]
            );
            await store.dispatch('recalculateStatisticsData', store.state.itemsByCategory);
        },
        async initCostsData(store) {
            const savedData = localStorage.getItem(DATA_TOKEN);
            const items = savedData ? JSON.parse(savedData) : DEFAULT_COSTS;
            const { itemsByCategory, total } = await store.dispatch('getCostsGroupedByCategory', items);
            const [ statistics, detailing ] = await Promise.all([
                store.dispatch('getStatisticsData', itemsByCategory),
                store.dispatch('recalculateDetailingData', itemsByCategory),
            ]);

            this.commit(
                'updateCostsState',
                {
                    items,
                    itemsByCategory,
                    statistics,
                    detailing,
                    total
                }
            );
        },
        async applyDemoCosts(store) {
            await Promise.all(
                [
                    store.dispatch('saveCostsInStore', DEMO_COSTS),
                    store.dispatch('recalculateCostsByCategory', DEMO_COSTS)
                ]
            );
            await store.dispatch('recalculateStatisticsData', store.state.itemsByCategory);
        }
    }
};