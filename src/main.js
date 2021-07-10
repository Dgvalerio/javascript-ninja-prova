/* eslint-disable no-continue */
(function ninja(doc, win, $, icons) {
  const app = (function controller() {
    let games = [];
    let currentGame = {};

    return {
      init() {
        this.loadGames();
      },

      loadGames() {
        const ajax = new XMLHttpRequest();
        ajax.open('GET', `./games.json`);
        ajax.send();

        ajax.addEventListener('readystatechange', this.onLoadGames, false);
      },

      onLoadGames() {
        if (this.readyState === 4 && this.status === 200) {
          try {
            games = JSON.parse(this.responseText).types;
            app.setCurrentGame(games[0]);
            app.mountPage();
          } catch (e) {
            win.alert.error(`Houve um erro ao carregar o jogos: \n`, e);
          }
        }
      },

      mountPage() {
        app.mountChooseGameButtons();
        app.addEvents();
      },

      addEvents() {
        $('[data-js="complete-game"]').on('click', this.completeGame, false);
        $('[data-js="clear-game"]').on('click', this.clearGame, false);
        $('[data-js="add-to-cart"]').on('click', this.addToCart, false);
        $('[data-js="save"]').on('click', this.saveGame, false);
      },

      saveGame() {
        const sum = $('[data-item-price]').reduce(
          (accumulator, current) =>
            accumulator + +current.getAttribute('data-item-price'),
          0
        );
        const min = games
          .map((m) => m['min-cart-value'])
          .reduce((major, current) => Math.max(major, current));

        if (sum < min) {
          win.alert(
            `A compra precisa ter um valor mínimo de ${sum.toLocaleString(
              'pt-br',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}`
          );
        } else {
          const items = $('.items').get();
          items.innerText = '';
          app.sumTotalCart();

          const blankDiv = doc.createElement('div');
          blankDiv.setAttribute('data-js', 'blank');
          const blankP = doc.createElement('p');
          blankDiv.innerText = 'Seu carrinho está vazio.';
          blankDiv.appendChild(blankP);
          items.appendChild(blankDiv);
        }
      },

      completeGame() {
        const { 'max-number': maxNumber, range } = currentGame;
        app.clearGame();

        const numbers = [];

        while (numbers.length < maxNumber) {
          const n = Math.floor(Math.random() * range);
          if (numbers.indexOf(n) >= 0) continue;

          numbers.push(n);
        }
        $('.numbers > .number').forEach((buttonActive, index) => {
          if (numbers.indexOf(index) >= 0) buttonActive.classList.add('active');
        });
      },

      clearGame() {
        $('.numbers > .number.active').forEach((buttonActive) =>
          buttonActive.classList.remove('active')
        );
      },

      addToCart() {
        const { type, 'max-number': maxNumber, price } = currentGame;
        const items = $('.items').get();

        const actives = $('.numbers > .number.active');

        if (actives.element.length < maxNumber) {
          win.alert(`Voce deve escolher ao menos ${maxNumber} números!`);
        } else {
          const blank = $('[data-js="blank"]');
          let pos = 0;
          if (blank.element.length > 0) {
            blank.get().outerHTML = '';
          } else {
            pos = +items.lastElementChild.getAttribute('data-item-pos') + 1;
          }

          const fragment = doc.createDocumentFragment();

          const cartItem = doc.createElement('div');
          cartItem.setAttribute('data-game-type', type);
          cartItem.setAttribute('data-item-price', price);
          cartItem.setAttribute('data-item-pos', pos);

          const button = doc.createElement('button');
          const icon = doc.createElement('i');
          icon.setAttribute('data-feather', 'trash-2');
          button.appendChild(icon);
          button.addEventListener(
            'click',
            () => {
              cartItem.outerHTML = '';
              app.sumTotalCart();

              if (items.childElementCount === 0) {
                const blankDiv = doc.createElement('div');
                blankDiv.setAttribute('data-js', 'blank');
                const blankP = doc.createElement('p');
                blankDiv.innerText = 'Seu carrinho está vazio.';
                blankDiv.appendChild(blankP);
                items.appendChild(blankDiv);
              }
            },
            false
          );

          const item = doc.createElement('div');
          item.classList.add('item');
          button.appendChild(icon);

          const p1 = doc.createElement('p');
          const span1 = doc.createElement('span');
          span1.innerText = actives.map((a) => a.innerText).join(', ');
          p1.appendChild(span1);
          item.appendChild(p1);

          const p2 = doc.createElement('p');
          const span21 = doc.createElement('span');
          span21.innerText = type;
          const span22 = doc.createElement('span');
          span22.innerText = Number(price).toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
          });
          p2.appendChild(span21);
          p2.appendChild(span22);
          item.appendChild(p2);

          cartItem.appendChild(button);
          cartItem.appendChild(item);

          fragment.appendChild(cartItem);

          items.appendChild(fragment);
          app.clearGame();
        }

        app.sumTotalCart();
        icons();
      },

      sumTotalCart() {
        const sum = $('[data-item-price]').reduce(
          (accumulator, current) =>
            accumulator + +current.getAttribute('data-item-price'),
          0
        );
        const finalValue = $('[data-js="final-value"]').get();
        finalValue.innerText = `TOTAL: ${sum.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        })}`;
      },

      mountChooseGameButtons() {
        const $choose = $('.chooseGame');

        const fragment = doc.createDocumentFragment();

        games.forEach((btn, index) => {
          const button = doc.createElement('button');
          button.setAttribute('type', 'button');
          button.setAttribute('data-choose-game', btn.type);

          if (index === 0) {
            button.classList.add('active');
            this.addStyle(
              `
                section:first-child > .numbers > button.number.active {
                  background-color: ${btn.color};
                }
              `
            );
          }

          button.innerText = btn.type;

          this.addStyle(`
            section:first-child > .chooseGame > button[data-choose-game="${btn.type}"] {
              color: ${btn.color};
              border-color: ${btn.color};
            }

            section:first-child > .chooseGame > button[data-choose-game="${btn.type}"]:hover {
              color: #ffffff;
              background-color: ${btn.color}cc;
            }

            section:first-child > .chooseGame > button[data-choose-game="${btn.type}"].active {
              color: #ffffff;
              background-color: ${btn.color};
            }

            section:first-child > .chooseGame > button[data-choose-game="${btn.type}"].active:hover {
              border-color: ${btn.color}cc;
              background-color: ${btn.color}cc;
            }

            section:last-child > div > .items > div[data-game-type="${btn.type}"] > button:hover {
              background-color: ${btn.color};
            }

            section:last-child > div > .items > div[data-game-type="${btn.type}"] > button:active {
              background-color: ${btn.color}aa;
            }

            section:last-child > div > .items > div[data-game-type="${btn.type}"] > .item {
              border-color: ${btn.color};
            }

            section:last-child > div > .items > div[data-game-type="${btn.type}"] > .item > p:last-child > span:first-child {
              color: ${btn.color};
            }
          `);

          button.addEventListener(
            'click',
            () => {
              if (button.className.split(' ').indexOf('active') === -1) {
                const $active = $('.chooseGame > button.active');
                $active.get().classList.remove('active');
                button.classList.add('active');

                this.replaceStyle(
                  /[\n ]+section:first-child > \.numbers > button\.number\.active {[\n ]+background-color: (.+);[\n ]+}[\n ]+/gm,
                  `
                    section:first-child > .numbers > button.number.active {
                      background-color: ${btn.color};
                    }
                  `
                );

                this.setCurrentGame(btn);
              }
            },
            false
          );

          fragment.appendChild(button);
        });

        $choose.get().appendChild(fragment);
      },

      updatePage() {
        const {
          type,
          description,
          'max-number': maxNumber,
          range,
        } = currentGame;
        const $type = $('[data-js="currentType"]').get();
        const $description = $('[data-js="currentDescription"]').get();

        $type.innerText = type;
        $description.innerText = description;

        this.mountNumbers({ range, maxNumber });
      },

      mountNumbers({ range, maxNumber }) {
        const $numbers = $('.numbers').get();

        const fragment = doc.createDocumentFragment();

        for (let i = 1; i <= range; i += 1) {
          const button = doc.createElement('button');
          button.setAttribute('type', 'button');
          button.setAttribute('class', 'number');
          button.innerText = `0${i}`.slice(-2);

          button.addEventListener(
            'click',
            () => {
              const { length } = $('.numbers > .number.active').element;
              if (length >= maxNumber && !button.classList.contains('active')) {
                win.alert(
                  `Você não pode escolher mais que ${maxNumber} números!`
                );
              } else {
                button.classList.toggle('active');
              }
            },
            false
          );

          fragment.appendChild(button);
        }

        $numbers.innerHTML = '';
        $numbers.appendChild(fragment);
      },

      addStyle(style) {
        const $style = $('[data-js="dynamic-style"]');

        $style.get().innerHTML += style;
      },

      replaceStyle(replace, style) {
        const $style = $('[data-js="dynamic-style"]');

        $style.get().innerHTML = $style.get().innerHTML.replace(replace, style);
      },

      setCurrentGame(game) {
        currentGame = game;
        this.updatePage();
      },
    };
  })();

  app.init();
})(document, window, window.DOM, window.featherIcons);
