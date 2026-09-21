# progress-widget

Индикатор прогресса

## Запуск

```bash
bun install
bun run app
```

Поднимет dev-сервер Bun с хот-релоадом для `index.html`.

## Файлы

- `js/progress-widget.js` — класс `ProgressWidget`, рендерит индикатор прогресса прямо в переданный DOM-элемент (без Custom Elements и Shadow DOM — обычный JS-класс поверх обычного `<div>`).
- `js/app.js` — связывает виджет с контролами на странице (инпут значения, тумблеры анимации/скрытия).
- `index.html`, `css/` — разметка и стили демо-страницы.

## Состояния у видета

- **Normal** — значение `value` (0..100) определяет длину дуги. Дуга стартует на 12 часах и растёт по часовой стрелке, при 100 замыкаясь в полный круг.
- **Animated** — независимое состояние: дуга непрерывно вращается по часовой стрелке с заданным периодом, независимо от текущего значения.
- **Hidden** — убирает виджет со страницы.

## Использование

```html
<div class="progress-widget" id="widget" data-value="60" data-period="2000"></div>
```

```js
const widget = new ProgressWidget(document.getElementById('widget'));
```

Начальные `value`/`animate`/`period` можно задать через `data-*`-атрибуты на контейнере или вторым аргументом конструктора: `new ProgressWidget(el, { value: 60, animate: true, period: 2000 })`.

### JS API

```js
widget.value = 60;       // число 0..100, автоматически клампится и округляется
widget.animate = true;   // boolean
widget.hidden = true;    // boolean (нативное DOM-свойство контейнера)
widget.period = 2000;    // мс на полный оборот в режиме анимации

widget.setValue(60);
widget.setAnimate(true);
widget.setHidden(false);
widget.toggleAnimate();
widget.toggleHidden();
```

### События

`progress-change` — вызывается на контейнере (`widget.el`) при любом изменении `value`/`animate`/`hidden`. В `event.detail` приходит `{ value, animate, hidden }`.
