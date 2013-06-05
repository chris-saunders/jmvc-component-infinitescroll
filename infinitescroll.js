steal(
    './infinitescroll.css',             // application CSS file
    './models/models.js',       // steals all your models
    './fixtures/fixtures.js',   // sets up fixtures for your models
    'jquery/class',
    'jquery/model',
    'jquery/model/list',
    'jquery/controller',
    'jquery/controller/view',
    'jquery/view/ejs',
    function(){                 // configure your application
        
    $.Controller('Infinitescroll', {},
    {
        pixelBoundary: 500,
        trigger: 'infinitescroll.request',
        fetching: false,
        _appendQueue: [],

        init: function() {
            var self = this;

            // Overwrite the default options as neccesary
            this.pixelBoundary = this.options.pixelBoundary || this.pixelBoundary;
            this.trigger = this.options.trigger || this.trigger;
            this.search_params = this.options.search_params || {};
            this.row = this.options.row || null;
            this.smoothScroll = typeof this.options.smoothScroll === 'boolean' ? this.options.smoothScroll : this.smoothScroll;
            this.empty = this.options.empty || null;

            // Pass of the rest of the options to instantiate on the normal tablesort component
            this.fetch();

            // Setup the queuer
            this._handleQueue();
        },

        /**
         * Queue
         *
         * The method takes a model list of items and pushes them into the queue
         * An update to the total count is updated and is used in the scroll method
         */
        queue: function(list) {
            var self = this;

            // handle the total
            this.resultsCount = list.count;

            list.rows.each(function(idx, row) {
                self._appendQueue.push(row);
            });
        },


        /**
         * _handleQueue
         *
         * Triggers the queue and attempts to empty the contents of the queue into the dom.
         */
        _handleQueue: function() {
            var self = this;

            if (this._appendQueue.length) {
                if (this.smoothScroll) {
                    this.render(this._appendQueue.splice(0, 1));
                    setTimeout(function() {
                        self._handleQueue();
                    }, 25);
                } else {
                    this.render(this._appendQueue);
                    this._appendQueue = [];
                    self._handleQueue();
                }

            } else {
                // We reached the end of the queue, trigger a scroll incase the amount doesnt cause an overflow
                this.element.trigger('scroll');
            }
        },

        /**
         * Scroll
         *
         * The method is fired by a bind added in the init method.
         * Unfortunately the component is not acually initialised on the element doing the scrolling so
         * we need to reach out to listen for this event
         */
        _scroll: function(ev) {
            var container = $(ev.target);

            // No searching is neccesary if the limit has been reached || we are currently fetching
            if (this.fetching || this.search_params.offset + this.search_params.limit > this.resultsCount) { return; }

            if ( container.scrollTop() + this.pixelBoundary + container.height() >= this.element.height() ) {
                this.search_params.offset = this.search_params.offset + this.search_params.limit;
                this.fetch();
            }
        },

        /**
         * Render
         *
         * Accepts a list and appends it the the table
         */
        render: function(rows) {
            this.trigger('infinitescroll.render', rows.length ? rows : [rows]);

            // var html = '';

            //

            // for (var i = 0, len = rows.length; i < len; i++) {
            //     html += this.view(this.row, {
            //         row: rows[i]
            //     });
            //     this.options.$content.append(html);
            // }
        },

        /**
         * Fetch
         *
         * Handles the fetching of data by triggering an event that can be caught by another controller.
         * Expects the deferred to be resolved by the controller that catches the event.
         * Expects a model list of data
         */
        fetch: function() {
            var self = this;

            this.fetching = true;

            $.Deferred(function(obj) {
                self.element.trigger(self.trigger, obj);
            }).done(function(dataset) {
                if (dataset && !dataset.rows.length) {
                    self.handleEmpty();
                }
                self.fetching = false;
                self.queue(dataset);
                self._handleQueue();
            });
        },

        handleEmpty: function() {
            this.trigger('infinitescroll.nodata');
        },

        /**
         * 'infinitescroll.refresh'
         *
         * This event can be called to clear all data and rerun another search.
         * The search object should be updated before calling the event
         */
        'infinitescroll.refresh': function(el, ev, data) {
            if (data) {
                this.search_params = data;
            }
            this._appendQueue = [];
            this.fetch();
        },

        'scroll': function(el, ev) {
            this.element.trigger('infinitescroll.scroll');
            this._scroll(ev);
        },

        'resize': function(el, ev) {
            this.element.trigger('infinitescroll.scroll');
            this._scroll(ev);
        }

    });
});


        // $.Controller('Infinitescroll',
        // {

        // }, {
        //     init: function() {
        //         var self = this;
        //         if (!this.options.limit || !this.options.model || !this.options.template) {
        //             throw new Error('Must provide integer for `limit` AND JMVC Model for `model` AND EJS string for `template`.');
        //         }
        //     },

        //     "click": function() {
        //         this.render();
        //     },

        //     render: function() {
        //         var self = this;
        //         this.options.model.findAll({ offset: 3 }, function( users ) {
        //             users.each(function(index, model) {
        //                 self.element.find('table')
        //                     .append(new $.EJS({ text: self.options.template }).render({ model: model }));
        //             });
        //         })
        //     }
        // });
    })