// $.noConflict();

jQuery(document).ready(function ($) {
    // $('.dropdown-menu a').click(function() {
       
    //     var selectValue = $(this).attr('data-val');
    //     var selectText = $(this).attr('data-text');
    //     if (selectValue == 3) {
    //         $('#date_select').datepicker({
    //             daysOfWeekDisabled: "0,6",
    //             autoclose: true,
    //             todayHighlight: true
    //         });
    //         $("#date_select").datepicker("show");
    //     }
    //     else {
    //         $("#date_select").val(selectText);
    //     }
    // });
    
    $("select.add-date").change(function () {
        // $("select.add-date").find('option.date-option').remove();
        if ($(this).val() == "date") {
            //alert("In... now how to throw date picker....");         
            $(this).parents('.calendar-input').find('input.datepicker').show();
            $(this).parents('.calendar-input').find('input.datepicker').datepicker({
                onSelect: function (dateText, inst) {
                    // var opt = $('<option class="date-option"/>').attr('value', dateText).attr('selected', 'selected').text(dateText);
                    // var select = $(this).parents('.calendar-input').find('select.add-date');
                    $("select.add-date").find('option[value="default"]').text(dateText);
                    $("select.add-date").val('default');
                    // $(select).append(opt);
                    $("select.add-date").parents('.bootstrap-select').find('.filter-option-inner-inner').text(dateText); 

                }
            }).focus();
        } else {
            $(this).parents('.calendar-input').find('input.datepicker').hide();
        }
    });
    
    $('input.datepicker.for-option').blur(function (dateText, inst) {     
        $(this).hide(); 
    });
});




    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    }

    // 
    // $('select.yearselect').addClass('yearselectleft');
    // 
    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        separator: ' to ',
        mode: "enabled",
        showDropdowns: true,
        maxDate: moment().add(100,'year'),
        locale: {
            applyLabel: 'Submit',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        },
        showWeekNumbers: true,
        dateLimit: false,

        ranges: {
           'Today': [moment(), moment()],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
           'Last 2 Months': [moment().subtract(2, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
           'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
           'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
           'FY': [moment().month(3).startOf('month'), moment().month(2).endOf('month').add('years',1)],
           'CY': [moment().startOf('year'),moment().endOf('year')],
           'VFY': [moment().startOf('year'),moment().endOf('year')]
        }
    }, cb);

    cb(start, end);

