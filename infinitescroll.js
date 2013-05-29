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
        $.Controller('Infinitescroll',
        {

        }, {
            init: function() {
                var self = this;
                if (!this.options.limit || !this.options.model || !this.options.template) {
                    throw new Error('Must provide integer for `limit` AND JMVC Model for `model` AND EJS string for `template`.');
                }
            },

            "click": function() {
                this.render();
            },

            render: function() {
                var self = this;
                this.options.model.findAll({ offset: 3 }, function( users ) {
                    users.each(function(index, model) {
                        self.element.find('table')
                            .append(new $.EJS({ text: self.options.template }).render({ model: model }));
                    });
                })
            }
        });
    })