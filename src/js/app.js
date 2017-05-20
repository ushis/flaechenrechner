(function($) {
  'use strict';

  var AreaCalculator = function(el) {
    this.el = el;

    this.form = $('<form>');
    this.form.appendTo(this.el);
    this.form.on('submit', this.submit.bind(this));

    this.form.on('click', '[data-increment]', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var btn = $(this);
      var target = $(btn.data('increment'));
      var step = window.parseFloat(btn.data('increment-by')) || 1;
      var value = window.parseFloat(target.val()) || 0;

      if (value >= -step)
        target.val(value + step);
    });

    $.getJSON(el.data('calculator'), (function(data) {
      this.build(data.groups);
    }).bind(this));
  };

  AreaCalculator.prototype.build = function(groups) {
    groups.forEach(function(group, i) {
      var fieldSet = $('<fieldset>');
      this.form.append(fieldSet);

      var legend = $('<legend>', {text: group.name});
      fieldSet.append(legend);

      group.items.forEach(function(item, j) {
        var id = 'item-' + i + '-' + j;

        var formGroup = $('<div>', {
          class: 'form-group'
        }).appendTo(fieldSet);

        var label = $('<label>', {
          for: id,
          class: 'control-label',
          text: item.name
        }).appendTo(formGroup);

        var inputGroup = $('<div>', {
          class: 'input-group'
        }).appendTo(formGroup);

        var minusWrap = $('<span>', {
          class: 'input-group-btn'
        }).appendTo(inputGroup);

        var minusButton = $('<button>', {
          class: 'btn btn-default',
          type: 'button',
          'data-increment': '#' + id,
          'data-increment-by': -1
        }).appendTo(minusWrap);

        var minusLabel = $('<strong>', {
          text: '-'
        }).appendTo(minusButton);

        var input = $('<input>', {
          id: id,
          type: 'number',
          value: 0,
          min: 0,
          class: 'form-control',
          'data-area': item.area
        }).appendTo(inputGroup);

        var plusWrap = $('<span>', {
          class: 'input-group-btn'
        }).appendTo(inputGroup);

        var plusButton = $('<button>', {
          class: 'btn btn-default',
          type: 'button',
          'data-increment': '#' + id,
          'data-increment-by': 1
        }).appendTo(plusWrap);

        var minusLabel = $('<strong>', {
          text: '+'
        }).appendTo(plusButton);
      });
    }, this);

    this.form.append($('<button>', {
      type: 'submit',
      class: 'btn btn-success',
      text: 'Berechnen'
    }));
  };

  AreaCalculator.prototype.submit = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.showResult(this.calculate());
  };

  AreaCalculator.prototype.calculate = function() {
    return this.form.find('input[data-area]')
      .map(function() {
        var el = $(this);
        var val = window.parseFloat(el.val()) || 0;
        var area = window.parseFloat(el.data('area')) || 0;
        return val * area;
      })
      .toArray()
      .reduce(function(sum, area) {
        return sum + area;
      }, 0);
  };

  AreaCalculator.prototype.showResult = function(area) {
    var annualArea = area * 365;
    var diff = (annualArea - 2000).toFixed(2);

    var modal = $('<div>', {
      class: 'modal fade'
    }).appendTo(this.el);

    var dialog = $('<div>', {
      class: 'modal-dialog'
    }).appendTo(modal);

    var content = $('<div>', {
      class: 'modal-content'
    }).appendTo(dialog);

    var header = $('<div>', {
      class: 'modal-header'
    }).appendTo(content);

    var close = $('<button>', {
      class: 'close',
      'data-dismiss': 'modal',
      text: '×'
    }).appendTo(header);

    var title = $('<h4>', {
      class: 'modal-title',
      text: 'Dein Flächenbedarf'
    }).appendTo(header);

    var body = $('<div>', {
      class: 'modal-body'
    }).appendTo(content);

    var daily = $('<p>').appendTo(body);

    var dailyLabel = $('<strong>', {
      text: 'Täglicher Flächenbedarf: '
    }).appendTo(daily);

    var dailyValue = $('<span>', {
      text: area.toFixed(2) + ' m²'
    }).appendTo(daily);

    var annual = $('<p>').appendTo(body);

    var annualLabel = $('<strong>', {
      text: 'Jährlicher Flächenbedarf: '
    }).appendTo(annual);

    var annualValue = $('<span>', {
      text: annualArea.toFixed(2) + ' m²'
    }).appendTo(annual);

    var result = $('<p>').appendTo(body);

    if (diff > 0) {
      $('<strong>', {
        text: 'Du benötigst ' + diff + ' m² zu viel Ackerfläche.'
      }).appendTo(result);
    } else {
      $('<strong>', {
        text: 'Du hast noch ' + -diff + ' m² Ackerfläche zur Verfügung.'
      }).appendTo(result);
    }

    modal.modal('show');
  };

  $.fn.areaCalculator = function() {
    this.each(function() {
      new AreaCalculator($(this));
    });
  };

  // Init application
  $(document).ready(function() {
    $('[data-calculator]').areaCalculator();
  });
}).call(this, jQuery);
