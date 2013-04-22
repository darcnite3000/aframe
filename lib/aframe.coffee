$ = jQuery

class UrlHashbang
  split =
    hdata:
      group: '&'
      data: '='
    tdata:
      group: '|'
      data: ':'
  
  expand = (hashString, groupSplit, dataSplit)->
    output = {}
    if hashString? and hashString != ''
      groups = hashString.split groupSplit
      for data in groups
        [key, value] = data.split(dataSplit)
        output[key] = decodeURIComponent value
    output
      
  compress = (data, groupJoin, dataJoin)->
    (for key, value of data
      "#{key}#{dataJoin}#{encodeURIComponent value}" if key? and value?
    ).join groupJoin
  
  getHashbang = ()->
    hashbang = document.location.hash[1..]
    hashbang = if hashbang[0] == '!' then hashbang[1..] else hashbang
  
  readHashbang = ()->
    expand getHashbang(), split.hdata.group, split.hdata.data
  
  setHashbang = (data)->
    document.location.hash = "#!#{compress(data, split.hdata.group, split.hdata.data)}"
  
  updateHashbang = (tag, data)->
    hdata = readHashbang()
    hdata[tag] = compress data, split.tdata.group, split.tdata.data
    setHashbang hdata

  @read: (tag)->
    hdata = readHashbang()
    expand hdata[tag], split.tdata.group, split.tdata.data
  @update: (tag, data)->
    updateHashbang tag, data

$.fn.extend
  aFrame: (options)->
    settings =
      callbacks:
        onLoad: (frame, setup, data)->
    
    settings = $.extend settings, options
    
    return @each ()->
      $this = $ this
      setup =
        tag: $this.data 'tag'
        data:
          url: $this.data 'url'
      if setup.tag? and setup.tag != ''
        setup.data = $.extend setup.data, UrlHashbang.read(setup.tag)
      if setup.data.url?
        frameUpdate = (data, status, xhr)->
          $this.children().remove()
          $this.append data
          UrlHashbang.update setup.tag, setup.data
          settings.callbacks.onLoad $this, setup, data
        adata = $.extend true, {}, setup.data
        delete adata['url']
        $.ajax setup.data.url,
          data: adata
          success: frameUpdate
      this
          
          
          
        