# My Costs - учёт расходов

Позволяет отслеживать расходы по категориям на круговой диаграмме

Демо на [GitHub Pages](https://ssupermassive.github.io/my_costs_app/)

## Стэк технологий:
* Vue 2
* Vuex
* BootstrapVue
* HighchartsVue
* SCSS

## DEV - компиляция

* Клонировать репозиторий
* Перейти в корень и в терминале выполнить npm start
* По окончанию сборки перейти на http://localhost:8080/

## Публикация на GitHub Pages
* Выполнить `git checkout gh-pages`
* Вмержить rc - ветку `git merge rc-x.x.x`
* Выполнить `npm run build`
* Выполнить `git add *` и `git commit -m 'gh-pages'`
* Выполнить `git subtree push --prefix dist origin gh-pages`
