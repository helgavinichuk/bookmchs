function popup(url)
{
    popupWin = window.open(url, 'Поделиться', 'location,width=800,height=600,top=0');
    popupWin.focus();
    return false;
}

function $_GET(key)
{
    var s = window.location.search;
    s = s.match( new RegExp(key + '=([^&=]+)') );
    return s ? s[1] : false;
}


$(function(){

    var share_id = $_GET('share');
    var share_url = $('#share_url').val();

    if ( share_id )
    {
        if ( share_url )
        {
            share_url = share_url.replace('<id>', share_id);
        }
        else
        {
            share_url = share_id;
        }

        if ( share_url.match(/^[\/a-z0-9]+$/) )
        {
            var anchor = $('<a />');
            anchor
                .attr('href', share_url)
                .popup({
                    layer: '#layer',
                    type: 'ajax',
                    width: 770,
                    popupClass: 't-3',
                    onOpen: function () {
                        $(document.body).addClass('f-popup');
                    },
                    onClose: function () {
                        $(document.body).removeClass('f-popup');
                    }
                })
                .trigger('click');
        }
    }

    $('.list-more').on('click', function(){
        if ( $(this).attr('data-load') == 1 )
            return false;

        var btn_more = $(this);
        var block = $(this).closest('.list-block');
        var items = block.find('.list-item');
        var offset = items.size();
        var url = btn_more.attr('href').replace(/#.*$/, '')
            ? btn_more.attr('href')
            : location.pathname;

        url = url.replace(/\/$/, '') + '/' + offset + location.search;

        btn_more.attr('data-load', 1);

        $.post(
            url,
            function(result) {
                items.last().after(result.list);

                if ( !result.more )
                    btn_more.hide();

                btn_more.attr('data-load', 0);
            }, 'json'
        );

        return false;
    });

    $('.invite-friend').on('click', function(e){
        e.preventDefault();

        var form = $(this).closest('form');
        var email = form.find('[name="email"]').val();

        if ( !email )
        {
            alert('Введите email');
            return;
        }

        $.post(
            '/invite',
            {email: email},
            function(result){
                console.log( result );

                alert('Письмо отправлено');
            }
        );

    });

    $('body').on('click', '.alternative-popup-close', function(){
        $(this).closest('.popup-wrapper').find('.popup-but-close').trigger('click');
    });

});