/* eslint-disable no-console */
(function ninja(doc, win, $) {
  let games;

  const app = () => ({
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
          games = JSON.parse(this.responseText);
        } catch (e) {
          console.error(
            `Houve um erro ao carregar o jogos: ${this.responseText}`
          );
        }
      }
    },
  });

  app().init();
})(document, window, window.DOM);
