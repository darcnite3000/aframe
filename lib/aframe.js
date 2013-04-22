(function() {
  var $, UrlHashbang;

  $ = jQuery;

  UrlHashbang = (function() {
    var compress, expand, getHashbang, readHashbang, setHashbang, split, updateHashbang;

    function UrlHashbang() {}

    split = {
      hdata: {
        group: '&',
        data: '='
      },
      tdata: {
        group: '|',
        data: ':'
      }
    };

    expand = function(hashString, groupSplit, dataSplit) {
      var data, groups, key, output, value, _i, _len, _ref;

      output = {};
      if ((hashString != null) && hashString !== '') {
        groups = hashString.split(groupSplit);
        for (_i = 0, _len = groups.length; _i < _len; _i++) {
          data = groups[_i];
          _ref = data.split(dataSplit), key = _ref[0], value = _ref[1];
          output[key] = decodeURIComponent(value);
        }
      }
      return output;
    };

    compress = function(data, groupJoin, dataJoin) {
      var key, value;

      return ((function() {
        var _results;

        _results = [];
        for (key in data) {
          value = data[key];
          if ((key != null) && (value != null)) {
            _results.push("" + key + dataJoin + (encodeURIComponent(value)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      })()).join(groupJoin);
    };

    getHashbang = function() {
      var hashbang;

      hashbang = document.location.hash.slice(1);
      return hashbang = hashbang[0] === '!' ? hashbang.slice(1) : hashbang;
    };

    readHashbang = function() {
      return expand(getHashbang(), split.hdata.group, split.hdata.data);
    };

    setHashbang = function(data) {
      return document.location.hash = "#!" + (compress(data, split.hdata.group, split.hdata.data));
    };

    updateHashbang = function(tag, data) {
      var hdata;

      hdata = readHashbang();
      hdata[tag] = compress(data, split.tdata.group, split.tdata.data);
      return setHashbang(hdata);
    };

    UrlHashbang.read = function(tag) {
      var hdata;

      hdata = readHashbang();
      return expand(hdata[tag], split.tdata.group, split.tdata.data);
    };

    UrlHashbang.update = function(tag, data) {
      return updateHashbang(tag, data);
    };

    return UrlHashbang;

  })();

  $.fn.extend({
    aFrame: function(options) {
      var settings;

      settings = {
        callbacks: {
          onLoad: function(frame, setup, data) {}
        }
      };
      settings = $.extend(settings, options);
      return this.each(function() {
        var $this, adata, frameUpdate, setup;

        $this = $(this);
        setup = {
          tag: $this.data('tag'),
          data: {
            url: $this.data('url')
          }
        };
        if ((setup.tag != null) && setup.tag !== '') {
          setup.data = $.extend(setup.data, UrlHashbang.read(setup.tag));
        }
        if (setup.data.url != null) {
          frameUpdate = function(data, status, xhr) {
            $this.children().remove();
            $this.append(data);
            UrlHashbang.update(setup.tag, setup.data);
            return settings.callbacks.onLoad($this, setup, data);
          };
          adata = $.extend(true, {}, setup.data);
          delete adata['url'];
          $.ajax(setup.data.url, {
            data: adata,
            success: frameUpdate
          });
        }
        return this;
      });
    }
  });

}).call(this);
