(function($) {
  'use strict';

  var AreaCalculator = function(el) {
    this.el = el;

    this.form = $('<form>');
    this.form.appendTo(this.el);
    this.form.on('submit', this.submit.bind(this));

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

        var formGroup = $('<div>', {class: 'form-group'});
        fieldSet.append(formGroup);

        formGroup.append($('<label>', {
          for: id,
          class: 'control-label',
          text: item.name
        }));

        formGroup.append($('<input>', {
          id: id,
          type: 'number',
          value: 0,
          class: 'form-control',
          'data-area': item.area
        }));
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

    var modal = $('<div>', {class: 'modal fade'});

    var dialog = $('<div>', {class: 'modal-dialog'});
    modal.append(dialog);

    var content = $('<div>', {class: 'modal-content'});
    dialog.append(content);

    var header = $('<div>', {class: 'modal-header'});
    content.append(header);

    var close = $('<button>', {class: 'close', 'data-dismiss': 'modal', text: '×'});
    header.append(close);

    var title = $('<h4>', {class: 'modal-title', text: 'Dein Flächenbedarf'});
    header.append(title);

    var body = $('<div>', {class: 'modal-body'});
    content.append(body);

    var daily = $('<p>');
    body.append(daily);

    var dailyLabel = $('<strong>', {text: 'Täglicher Flächenbedarf: '});
    daily.append(dailyLabel);

    var dailyValue = $('<span>', {text: area.toFixed(2) + ' m²'});
    daily.append(dailyValue);

    var annual = $('<p>');
    body.append(annual);

    var annualLabel = $('<strong>', {text: 'Jährlicher Flächenbedarf: '});
    annual.append(annualLabel);

    var annualValue = $('<span>', {text: annualArea.toFixed(2) + ' m²'});
    annual.append(annualValue);

    var result = $('<p>');
    body.append(result);

    var text = 'Du benötigst ' + (annualArea - 2000).toFixed(2) + ' m² zu viel Ackerfläche.';

    if (annualArea <= 2000) {
      text = 'Du hast noch ' + (2000 - annualArea).toFixed(2) + ' m² Ackerfläche zur Verfügung.';
    }
    result.append($('<strong>', {text: text}));

    this.el.append(modal);
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
