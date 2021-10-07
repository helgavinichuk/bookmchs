$(function(){

    $('.download-select').on('change', function(){
        var link = $(this).closest('.download-parent').find('.download-link');
        var url = $(this).find('option:selected').data('url');

        link.attr('href', url);
    });

});