Zepto(function($){
    // JS Utils
    Function.prototype.add_method = function(name, func) {
	    if(!this.prototype[name]) {
		    this.prototype[name] = func;
		    return this;
	    }
    }

    Function.add_method('inherits', function(Parent) {
	    function ImmediateConstructor() {
	    }        
	    ImmediateConstructor.prototype = Parent.prototype;
	    this.prototype = new ImmediateConstructor;
	    this.prototype.constructor = this;
	    return this;
    });


    var Browser = function(){
        this.current_page_index = 0;
        $("#content").html('<div class="no_flicker" id="flickable-wrapper"></div>');
        this.flickable_node = $('#flickable-wrapper').css('width', this.width() * 2);
    }.add_method('render_page', function(page){
        this.flickable_node.html(page.html_string());
        this.setup_page_transitions(page);
    }).add_method('setup_page_transitions', function(page){
        for(var i = 0; i < page.transitions.length; i++)
            this.setup_page_transition(page.transitions[i], page);        
    }).add_method('setup_page_transition', function(transition, current_page){
        var that = this;
        $('#' + transition.id).click(function(){
            that.remove_pages_except_the_current_page();
            that['add_page_to_' + transition.direction.split('_')[0]](transition.page);
            that['do_' + transition.direction + '_transition'](current_page);
            that.setup_page_transitions(transition.page);
        });
    }).add_method('remove_pages_except_the_current_page', function(){
        if(this.flickable_node.children().length === 2){
            var index_of_page_to_be_removed;
            if(this.current_page_index == 0){
                index_of_page_to_be_removed = 1;
                $(this.flickable_node.children()[index_of_page_to_be_removed]).remove();
            }else{
                index_of_page_to_be_removed = 0;
                $(this.flickable_node.children()[index_of_page_to_be_removed]).remove();
                this.flickable_node.css('-webkit-transition-duration', '0').css('-webkit-transform', 'translate3d(0px, 0px, 0px)');
            }   
         }
    }).add_method('add_page_to_right', function(page){
        this.flickable_node.append(page.html_string());
    }).add_method('add_page_to_left', function(page){
        this.flickable_node.prepend(page.html_string());
        this.flickable_node.css('-webkit-transition-duration', '0').css('-webkit-transform', 'translate3d(-' +  this.width() + 'px, 0px, 0px)'); 
    }).add_method('do_left_to_right_transition', function(current_page){
        this.flickable_node.anim({translate3d: '0px, 0px, 0px'}, 1, 'ease-out');
        this.current_page_index = 0;
    }).add_method('do_right_to_left_transition', function(current_page){
        this.flickable_node.anim({translate3d: '-' +  this.width() + 'px, 0px, 0px'}, 1, 'ease-out');
        this.current_page_index = 1;

    }).add_method('width', function(){
        return $(window).width() - 2 * parseInt($("#content").css('margin-top').split('px')[0]);
    });


    var browser = ( function() {
	    var inst;
	    return {
		    instance : function() {
			    if(!inst) {
				    inst = new Browser();
			    }
			    return inst;
		    }
	    }
    }());

    var Page = function(){
        this.initialize();
    }.add_method('initialize', function(){
        this.html = '';
        this.id = null;
        this.template_name = null;
        this.template_params = {width: 'width:' + this.width() + 'px'};
        this.transitions = [];
    }).add_method('add_transition', function(id, key, direction, page, style){
        this.transitions.push({id: id, key: key, direction: direction, page: page, style: style});
        this.template_params.transitions = this.transitions;
        this.generate_html();
        return this;
    }).add_method('html_string', function(){
        return this.html;
    }).add_method('width', function(){
        return $(window).width() - 2 * parseInt($("#content").css('margin-top').split('px')[0]);
    }).add_method('generate_html', function(){
        this.html = Handlebars.compile($(this.template_name).html())(this.template_params);        
    });

    
    var Note = function(id, text){
        this.initialize();

        this.note_id = id;
        this.id = id;
        this.note_text = text;

        this.template_name = '#note-template';

        this.template_params.id = this.note_id;
        this.template_params.text = this.note_text;

        this.generate_html();
    }.inherits(Page);

    var Calender = function(){
        this.initialize();
        
        
    }.inherits(Page);



    var ineligible_page = new Note('ineligible_page', 'You may not be eligible to use CycleTel at this time');

    var send_your_period_date_page = new Note('send_your_period_date_page', 'To start using CycleTel reply with the start date of your most recent period');

    var third_screening_question_page = new Note('third_screening_question', 'To use CycleTel you will have to abstain or use a condom on unsafe days.  Can you and your husband do this?')
        .add_transition('S3_Yes', 'Yes', 'right_to_left', send_your_period_date_page, 'green-with-gradient')
        .add_transition('S3_No', 'No', 'right_to_left', ineligible_page, 'red-with-gradient');

    var second_screening_question_page = new Note('second_screening_question', 'To start using CycleTel your periods must come about a month apart.  Do your periods currently come about a month apart?')
        .add_transition('S2_Yes', 'Yes', 'right_to_left', third_screening_question_page, 'green-with-gradient')
        .add_transition('S2_No', 'No', 'right_to_left', ineligible_page, 'red-with-gradient');

    var first_screening_question_page = new Note('first_screening_question', 'Have you used a contraceptive pill or shot in the last 3 months?')
        .add_transition('S1_Yes', 'Yes', 'right_to_left', ineligible_page, 'green-with-gradient')
        .add_transition('S1_No', 'No', 'right_to_left', second_screening_question_page, 'red-with-gradient');


    var welcome_page = new Note('welcome-note', 'You will be asked 3 questions to see if CycleTel will work for you')
        .add_transition('W_OK', 'OK', 'right_to_left', first_screening_question_page, 'green-with-gradient');
    
    //browser.instance().render_page(welcome_page);

    $.cycletel = {
        public_api : {
            render: function(device){
                browser.instance().render_page(welcome_page);
            } 
        }
    }
    
});


