jQuery.ajaxSetup({
    'beforeSend': function(xhr) {
        xhr.setRequestHeader('Accept', 'application/json');
    }
});


jQuery(document).ready(function() {
    var username;

    function el(name, attributes) {
        var element = new Element(name, attributes);
        var children = [];
        if (arguments.length > 2)
            children = $A(arguments).slice(2).flatten().toArray();
        children.each(function(child) {
            if (typeof child == "string") {
                if (!child.startsWith("<"))
                    child = document.createTextNode(child);
            }
            if (typeof child == "string")
                element.innerHTML = child;
            else
                element.appendChild(child);
        });
        return element;
    }

    function createBookItem(book, buttonType) {

        return el('li', null,
                el('img', {class: 'book-image', src: book.image_url}),
                el('div', {class: 'book-title'}, book.title),
                el('span', {class: 'book-author'}, book.author),
                el('button', {class: buttonType.toLowerCase() + '-button'}, buttonType.capitalize())
                );
    }

    jQuery('#search-form').submit(function() {
        jQuery.get(jQuery(this).attr('action'), jQuery(this).serialize(), function(data) {
            var results = jQuery('#search-results')
            results.empty();
            data.each(function(item) {
                results.append(createBookItem(item.book, 'borrow'));
            });
        });
        return false;
    });

    jQuery('#login-form').submit(function() {
//        jQuery.get(jQuery(this).attr('action'), jQuery(this).serialize(), function(data) {
            username = jQuery('#login-field').val();
            jQuery('#logged-out-panel').hide();
            jQuery('#logged-in-panel').show();
            jQuery('#logged-in-username').text(username);
            updateLoans(username);
//        });
        return false;
    });

    function updateLoans(username) {
        var loansUrl = '/users/' + username + '/loans';
        jQuery.get(loansUrl, function(data) {
            var loans = jQuery('#loans');
            loans.empty();
            data.each(function(item) {
                loans.append(createBookItem(item.book, 'return'));
            });
        });
    }

    function initPanels() {
        jQuery('#logged-out-panel').show();
        jQuery('#logged-in-panel').hide();
    }

    initPanels();

});

