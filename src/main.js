/* eslint-disable no-console */
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
        app.mountChooseGameButtons(
          games.map(({ type, color }) => ({ type, color }))
        );
        app.updatePage(games[0]);
      },

      mountChooseGameButtons(games) {
        const $choose = $('.chooseGame');

        const fragment = doc.createDocumentFragment();

        games.forEach((btn, index) => {
          const button = doc.createElement('button');
          button.setAttribute('type', 'button');
          button.setAttribute('data-cg-btn', index);

          if (index === 0) {
            button.classList.add('active');
          }

          button.innerText = btn.type;

          this.addStyle(`
            section:first-child > .chooseGame > button[data-cg-btn="${index}"] {
              color: ${btn.color};
              border-color: ${btn.color};
            }

            section:first-child > .chooseGame > button[data-cg-btn="${index}"]:hover {
              color: #ffffff;
              background-color: ${btn.color}cc;
            }

            section:first-child > .chooseGame > button[data-cg-btn="${index}"].active {
              color: #ffffff;
              background-color: ${btn.color};
            }

            section:first-child > .chooseGame > button[data-cg-btn="${index}"].active:hover {
              border-color: ${btn.color}cc;
              background-color: ${btn.color}cc;
            }
          `);

          fragment.appendChild(button);
        });

        $choose.get().appendChild(fragment);
      },

      updatePage(game) {
        const $type = $('[data-js="currentType"]').get();
        const $description = $('[data-js="currentDescription"]').get();

        $type.innerText = game.type;
        $description.innerText = game.description;

        this.mountNumbers(game.range);
      },

      mountNumbers(quantity) {
        const $numbers = $('.numbers').get();

        const fragment = doc.createDocumentFragment();

        for (let i = 1; i <= quantity; i += 1) {
          const button = doc.createElement('button');
          button.setAttribute('type', 'button');
          button.setAttribute('class', 'number');
          button.innerText = `0${i}`.slice(-2);

          fragment.appendChild(button);
        }

        $numbers.appendChild(fragment);
      },

      addStyle(style) {
        const $style = $('[data-js="dynamic-style"]');

        $style.get().innerHTML += style;
      },
    };
  })();

  app.init();
})(document, window, window.DOM);
