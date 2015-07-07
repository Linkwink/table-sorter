/* Плагин для сортировки таблиц.
  Сортирует числа,строки,дату
  Что бы активировать плагин необходимо:
   - подключить данный скрипт в конец нужной страницы;
   - добавить к таблице класс "sorter-on";
   - установить data-type для th-заголовков таблицы:
      --> для строковых столбцов: data-type="string";
      --> для числовых столбцов: data-type="number";(даты должны быть в формате "дд/мм/гггг")
      --> для столбцов-дат: data-type="date";
  ----------Вячеслав Хромой 2015г----------------------------
*/
(function() {
  'use strict';

  function toArray(obj) {
    return [].slice.call(obj);
  }

  function reverseString(string) {
    return string.split('/').reverse().join('');
  }

  function TableSorter() {
    this.nodes = document.querySelectorAll('.sorter-on');
    this.flag = 0; //флаг для отслеживания переключения вида сортировки(возрастание(0)/убывание(1))
    this._init();
  }

  TableSorter.prototype._sortTable = function(flag) {
    var compare;
    var link = this;
    var switcher = flag;
    switch (this.dateAtr) {
      case 'number':
        compare = function(a, b) {
          if (switcher === 0) {
            return a.cells[link.cellIndex].innerText - b.cells[link.cellIndex].innerText;
          } else {
            return b.cells[link.cellIndex].innerText - a.cells[link.cellIndex].innerText;
          }
        };
        break;
      case 'string':
        compare = function(a, b) {
          if (switcher === 0) {
            return a.cells[link.cellIndex].innerText > b.cells[link.cellIndex].innerText;
          } else {
            return a.cells[link.cellIndex].innerText < b.cells[link.cellIndex].innerText;
          }
        };
        break;
      case 'date':
        compare = function(a, b) {
          var value1 = reverseString(a.cells[link.cellIndex].innerText);
          var value2 = reverseString(b.cells[link.cellIndex].innerText);
          if (switcher === 0) {
            return value1 > value2;
          } else {
            return value1 < value2;
          }
        };
        break;
    }
    return link.childsArr.sort(compare);
  };

  TableSorter.prototype._core = function() {
    var link = window.tableSorterInit;
    var target = event.target;
    var tbody = this.querySelector('tbody');
    if (target.tagName !== 'TH') return;
    link.cellIndex = target.cellIndex;
    link.dateAtr = target.getAttribute('data-type');
    if (!link.dateAtr) {
      console.error('не указан data-type для столбца:' + target.innerText);
      return;
    }
    link.childsArr = toArray(tbody.children);
    switch (link.flag) {
      case 1:
        link._sortTable(1);
        link.flag = 0;
        break;
      case 0:
        link._sortTable(0);
        link.flag = 1;
        break;
    }
    link.childsArr.forEach(function(elem) {
      tbody.appendChild(elem);
    });
  };

  TableSorter.prototype._init = function() {
    var arrayNodes = toArray(this.nodes);
    this.sortTables = arrayNodes.filter(function(elem) {
      return elem.nodeName === 'TABLE';
    });
    this.sortTables.forEach(function(elem) {
      elem.addEventListener('click', this._core, false);
    }, this);
  };

  window.tableSorterInit = new TableSorter();

}());