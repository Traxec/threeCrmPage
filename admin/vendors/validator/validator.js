/*
    Validator v1.1.0
    (c) Yair Even Or
    https://github.com/yairEO/validator

    MIT-style license.
*/

var validator = (function($){
    var message, tests, checkField, validate, mark, unmark, field, minmax, defaults,
        validateWords, lengthRange, lengthLimit, pattern, alertTxt, data,
        email_illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]]/,
        email_filter = /^.+@.+\..{2,6}$/, // exmaple email "steve@s-i.photo"
        phone_illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]\@\.]/,
        phone_filter = /^1[34578][0-9]{9}$/;  // exmaple phone "13203836651"
        IDCard_illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]\@\.]/,
        IDCard_filter = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;  // exmaple IDCard "410181199103151000"
        ch_zn_illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]\@\.]/,
        ch_zn_filter = /^[A-Za-z\u4e00-\u9fa5]*$/;
        chinese_illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]\@\.]/,
        chinese_filter = /^[\u4E00-\u9FA5]{2,5}$/;
        money_illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]\@\.]/,
        money_filter = /^[0-9]{1,8}([.][0-9]{1,5})?$/;
    /* general text messages
    */
    message = {
        chinese         : '请输入2-5位中文',
        money           : '请输入整数金额',
        ch_zn           : '请输入正确的姓名',
        invalid         : '输入格式不正确',
        checked         : '请选择复选框',
        empty           : '',
        min             : '输入长度过短',
        max             : '输入长度过长',
        number_min      : '输入长度过短',
        number_max      : '输入长度过长',
        url             : '请输入有效的网址',
        number          : '请输入数字',
        email           : '邮箱格式不正确',
        email_repeat    : '邮箱不匹配',
        phone           : '手机号格式不正确',
        phone_repeat    : '手机号码不匹配',
        IDCard          : '请输入正确的身份证号',
        IDCard_repeat   : '身份证号码不必配',
        IDCard_check    : '请输入正确的身份证号',
        password_repeat : '两次输入密码不一致',
        repeat          : '请重复输入',
        complete        : '输入内容不完整',
        select          : '请选择一个选项'
    };

    if(!window.console){
        console={};
        console.log=console.warn=function(){ return; }
    }

    // defaults
    defaults = {
        alerts  : true,
        classes : {
	        item    : 'item',
	        alert   : 'alert',
	        bad     : 'bad'
        }
    };

    /* Tests for each type of field (including Select element)
    */
    tests = {
        sameAsPlaceholder : function(a){
            return $.fn.placeholder && a.attr('placeholder') !== undefined && data.val == a.prop('placeholder');
        },
        hasValue : function(a){
            if( !a ){
                alertTxt = field['0'].title;
                return false;
            }
            return true;
        },
        // 'linked' is a special test case for inputs which their values should be equal to each other (ex. confirm email or retype password)
        linked : function(a,b){
            if( b != a ){
                // choose a specific message or a general one
                alertTxt = message[data.type + '_repeat'] || message.no_match;
                return false;
            }
            return true;
        },
        IDCard: function(a){
            if ( !IDCard_filter.test( a ) || a.match( IDCard_illegalChars ) ){
                alertTxt = a ? message.IDCard: message.empty;
                return false;
            }
            if(a.length == 18){
              var code = a.split('');
              //∑(ai×Wi)(mod 11)
              //加权因子
              var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
              //校验位
              var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
              var sum = 0;
              var ai = 0;
              var wi = 0;
              for (var i = 0; i < 17; i++)
              {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
              }
              var last = parity[sum % 11];
              if(parity[sum % 11] != code[17]){
                alertTxt = message.IDCard_check;
                return false;
              }
            }
            return true;
        },
        phone: function(a){
            if ( !phone_filter.test( a ) || a.match( phone_illegalChars ) ){
                alertTxt = a ? message.phone: message.empty;
                return false;
            }
            return true;
        },
        chinese: function(a){
            if ( !chinese_filter.test( a ) || a.match( chinese_illegalChars ) ){
                alertTxt = a ? message.chinese: message.empty;
                return false;
            }
            return true;
        },
        email : function(a){
            if ( !email_filter.test( a ) || a.match( email_illegalChars ) ){
                alertTxt = a ? message.email : message.empty;
                return false;
            }
            return true;
        },
        ch_zn : function(a,skip){
            if ( !ch_zn_filter.test( a ) || a.match( ch_zn_illegalChars ) ){
                alertTxt = a ? message.ch_zn : message.empty;
                return false;
            }
            if( skip && lengthRange && a.length < lengthRange[0] ){
                alertTxt = message.min;
                return false;
            }

            // check if there is max length & field length is greater than the allowed
            if( lengthRange && lengthRange[1] && a.length > lengthRange[1] ){
                alertTxt = message.max;
                return false;
            }
            return true;
        },
        money : function(a){
            if ( !money_filter.test( a ) || a.match( money_illegalChars ) ){
                alertTxt = a ? message.money : message.empty;
                return false;
            }
            return true;
        },
        // a "skip" will skip some of the tests (needed for keydown validation)
        text : function(a, skip){
            // make sure there are at least X number of words, each at least 2 chars long.
            // for example 'john F kenedy' should be at least 2 words and will pass validation
            if( validateWords ){
                var words = a.split(' ');
                // iterrate on all the words
                var wordsLength = function(len){
                    for( var w = words.length; w--; )
                        if( words[w].length < len )
                            return false;
                    return true;
                };

                if( words.length < validateWords || !wordsLength(2) ){
                    alertTxt = message.complete;
                    return false;
                }
                return true;
            }
            if( skip && lengthRange && a.length < lengthRange[0] ){
                alertTxt = message.min;
                return false;
            }

            // check if there is max length & field length is greater than the allowed
            if( lengthRange && lengthRange[1] && a.length > lengthRange[1] ){
                alertTxt = message.max;
                return false;
            }

            // check if the field's value should obey any length limits, and if so, make sure the length of the value is as specified
            if( lengthLimit && lengthLimit.length ){
                while( lengthLimit.length ){
                    if( lengthLimit.pop() == a.length ){
                        alertTxt = message.complete;
                        return false;
                    }
                }
            }

            if( pattern ){
                var regex, jsRegex;
                switch( pattern ){
                    case 'alphanumeric' :
                        regex = /^[a-zA-Z0-9]+$/i;
                        break;
                    case 'numeric' :
                        regex = /^[0-9]+$/i;
                        break;
                    case 'phone' :
                        regex = /^\+?([0-9]|[-|' '])+$/i;
                        break;
                    default :
                        regex = pattern;
                }
                try{
                    jsRegex = new RegExp(regex).test(a);
                    if( a && !jsRegex )
                        return false;
                }
                catch(err){
                    console.log(err, field, 'regex is invalid');
                    return false;
                }
            }

            return true;
        },
        number : function(a){
            // if not not a number
            if( isNaN(parseFloat(a)) && !isFinite(a) ){
                alertTxt = message.number;
                return false;
            }
            // not enough numbers
            else if( lengthRange && a.length < lengthRange[0] ){
                alertTxt = message.min;
                return false;
            }
            // check if there is max length & field length is greater than the allowed
            else if( lengthRange && lengthRange[1] && a.length > lengthRange[1] ){
                alertTxt = message.max;
                return false;
            }
            else if( minmax[0] && (a|0) < minmax[0] ){
                alertTxt = message.number_min;
                return false;
            }
            else if( minmax[1] && (a|0) > minmax[1] ){
                alertTxt = message.number_max;
                return false;
            }
            return true;
        },
        // Date is validated in European format (day,month,year)
        date : function(a){
            var day, A = a.split(/[-./]/g), i;
            // if there is native HTML5 support:
            if( field[0].valueAsNumber )
                return true;

            for( i = A.length; i--; ){
                if( isNaN(parseFloat(a)) && !isFinite(a) )
                    return false;
            }
            try{
                day = new Date(A[2], A[1]-1, A[0]);
                if( day.getMonth()+1 == A[1] && day.getDate() == A[0] )
                    return day;
                return false;
            }
            catch(er){
                console.log('date test: ', err);
                return false;
            }
        },
        url : function(a){
            // minimalistic URL validation
            function testUrl(url){
                return /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/.test( url );
            }
            if( !testUrl( a ) ){
                alertTxt = a ? message.url : message.empty;
                return false;
            }
            return true;
        },
        hidden : function(a){
            if( lengthRange && a.length < lengthRange[0] ){
                alertTxt = message.min;
                return false;
            }
            if( pattern ){
                var regex;
                if( pattern == 'alphanumeric' ){
                    regex = /^[a-z0-9]+$/i;
                    if( !regex.test(a) ){
                        return false;
                    }
                }
            }
            return true;
        },
        select : function(a){
            if( !tests.hasValue(a) ){
                alertTxt = message.select;
                return false;
            }
            return true;
        }
    };

    /* marks invalid fields
    */
    mark = function( field, text ){
        if( !text || !field || !field.length )
            return false;

        // check if not already marked as a 'bad' record and add the 'alert' object.
        // if already is marked as 'bad', then make sure the text is set again because i might change depending on validation
        var item = field.closest('.' + defaults.classes.item),
            warning;

        if( item.hasClass(defaults.classes.bad) ){
            if( defaults.alerts )
                item.find('.'+defaults.classes.alert).html(text);
        }


        else if( defaults.alerts ){
            warning = $('<div class="'+ defaults.classes.alert +'">').html( text );
            item.append( warning );
        }

        item.removeClass(defaults.classes.bad);
        // a delay so the "alert" could be transitioned via CSS
        setTimeout(function(){
            item.addClass(defaults.classes.bad);
        }, 0);
    };
    /* un-marks invalid fields
    */
    unmark = function( field ){
        if( !field || !field.length ){
            console.warn('no "field" argument, null or DOM object not found');
            return false;
        }

        field.closest('.' + defaults.classes.item)
             .removeClass(defaults.classes.bad)
             .find('.'+ defaults.classes.alert).remove();
    };

    function testByType(type, value){
        if( type == 'tel' )
            pattern = pattern || 'phone';

        if( !type || type == 'password' || type == 'tel' || type == 'search' || type == 'file' )
            type = 'text';


        return tests[type] ? tests[type](value, true) : true;
    }

    function prepareFieldData(el){
        field = $(el);

        field.data( 'valid', true );                // initialize validity of field
        field.data( 'type', field.attr('type') );   // every field starts as 'valid=true' until proven otherwise
        pattern = field.attr('pattern');
    }

    /* Validations per-character keypress
    */
    function keypress(e){
        prepareFieldData(this);
        //  String.fromCharCode(e.charCode)

        if( e.charCode ){
            return testByType( this.type, this.value );
        }
    }

    /* Checks a single form field by it's type and specific (custom) attributes
    */
    function checkField(){
        // skip testing fields whom their type is not HIDDEN but they are HIDDEN via CSS.
        if( this.type !='hidden' && $(this).is(':hidden') )
            return true;

        prepareFieldData(this);

        field.data( 'val', field[0].value.replace(/^\s+|\s+$/g, "") );  // cache the value of the field and trim it
        data = field.data();

        // Check if there is a specific error message for that field, if not, use the default 'invalid' message
        alertTxt = message[field.prop('name')] || message.invalid;

        // Special treatment
        if( field[0].nodeName.toLowerCase() === "select" ){
            data.type = 'select';
        }
        else if( field[0].nodeName.toLowerCase() === "textarea" ){
            data.type = 'text';
        }
        /* Gather Custom data attributes for specific validation:
        */
        validateWords   = data['validateWords'] || 0;
        lengthRange     = data['validateLengthRange'] ? (data['validateLengthRange']+'').split(',') : [1];
        lengthLimit     = data['validateLength'] ? (data['validateLength']+'').split(',') : false;
        minmax          = data['validateMinmax'] ? (data['validateMinmax']+'').split(',') : ''; // for type 'number', defines the minimum and/or maximum for the value as a number.

        data.valid = tests.hasValue(data.val);

        if( field.hasClass('optional') && !data.valid )
            data.valid = true;


        // for checkboxes
        if( field[0].type === "checkbox" ){
            data.valid = field[0].checked;
            alertTxt = message.checked;
        }

        // check if field has any value
        else if( data.valid ){
            /* Validate the field's value is different than the placeholder attribute (and attribute exists)
            * this is needed when fixing the placeholders for older browsers which does not support them.
            * in this case, make sure the "placeholder" jQuery plugin was even used before proceeding
            */
            if( tests.sameAsPlaceholder(field) ){
                alertTxt = message.empty;
                data.valid = false;
            }

            // if this field is linked to another field (their values should be the same)
            if( data.validateLinked ){
                var linkedTo = data['validateLinked'].indexOf('#') == 0 ? $(data['validateLinked']) : $(':input[name=' + data['validateLinked'] + ']');
                data.valid = tests.linked( data.val, linkedTo.val() );
            }
            /* validate by type of field. use 'attr()' is proffered to get the actual value and not what the browsers sees for unsupported types.
            */
            else if( data.valid || data.type == 'select' )
                data.valid = testByType(data.type, data.val);

        }

        // mark / unmark the field, and set the general 'submit' flag accordingly
        if( data.valid )
            unmark( field );
        else{
            mark( field, alertTxt );
            submit = false;
        }

        return data.valid;
    }

    /* vaildates all the REQUIRED fields prior to submiting the form
    */
    function checkAll( $form ){
        $form = $($form);

        if( $form.length == 0 ){
            console.warn('element not found');
            return false;
        }

        var that = this,
            submit = true, // save the scope
            // get all the input/textareas/select fields which are required or optional (meaning, they need validation only if they were filled)
            fieldsToCheck = $form.find(':input').filter('[required=required], .required, .optional').not('[disabled=disabled]');

        fieldsToCheck.each(function(){
            // use an AND operation, so if any of the fields returns 'false' then the submitted result will be also FALSE
            submit = submit * checkField.apply(this);
        });

        return !!submit;  // casting the variable to make sure it's a boolean
    }

    return {
        defaults    : defaults,
        checkField  : checkField,
        keypress    : keypress,
        checkAll    : checkAll,
        mark        : mark,
        unmark      : unmark,
        message     : message,
        tests       : tests
    }
})(jQuery);
