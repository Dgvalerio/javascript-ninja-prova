/* eslint-disable no-console, no-continue */
(function ninja(doc, win, $) {
  const app = (function controller() {
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
            app.mountPage(JSON.parse(this.responseText).types);
          } catch (e) {
            console.error(`Houve um erro ao carregar o jogos: \n`, e);
          }
        }
      },

      mountPage(games) {
        app.mountChooseGameButtons(games);
        app.updatePage(games[0]);
        app.addEvents(games[0]);
      },

      addEvents(game) {
        $('[data-js="complete-game"]').on(
          'click',
          () => this.completeGame(game),
          false
        );

        $('[data-js="clear-game"]').on('click', this.clearGame, false);
        $('[data-js="add-to-cart"]').on(
          'click',
          () => win.alert('add-to-cart'),
          false
        );
      },

      completeGame({ 'max-number': maxNumber, range }) {
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

      mountChooseGameButtons(games) {
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

                this.updatePage(btn);
              }
            },
            false
          );

          fragment.appendChild(button);
        });

        $choose.get().appendChild(fragment);
      },

      updatePage(game) {
        const $type = $('[data-js="currentType"]').get();
        const $description = $('[data-js="currentDescription"]').get();

        $type.innerText = game.type;
        $description.innerText = game.description;

        this.addEvents(game);
        this.mountNumbers(game);
      },

      mountNumbers({ range, 'max-number': maxNumber }) {
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
    };
  })();

  app.init();
})(document, window, window.DOM);
