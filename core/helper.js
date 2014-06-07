/**
* Parse markups
* options
*/
function parseCustomMark(options) {
    options.Element.text("");
    $('#board').html('');
    p = options.Text;
    tags = Array();    
    tags['video'] = function (params, options) {
        if (params['src'] == undefined) {
            return;
        }
        $("<div></div>").html(options.Text).appendTo(options.Element.selector);
        $('<iframe width="560" height="315" src="' + params['src'] + '" frameborder="0" allowfullscreen></iframe>').html('').appendTo('#board');
        return;
    };

    tags['link'] = function (params, options) {
        if (params['src'] == undefined) {
            return;
        }
        if (params['text'] != undefined) {
            params['text'] = params['text'].replace('_', '&nbsp;');
        }

        $("<div></div>").html(options.Text + "&nbsp;").appendTo(options.Element.selector);
        $('<a href="' + params['src'] + '" target="_blank"></a>').html(params['text']).appendTo(options.Element.selector);
        return;
    };

    tags['nl'] = function (params, options) {
        $("<div></div>").html(options.Text).appendTo(options.Element.selector);
        $('<br/>').html('').appendTo(options.Element.selector);
        return;
    };

    n = 0;
    m = 0;
    b = 0;
    txt = "";
    isFound = false;
    while (true) {
        b = n;
        n = p.indexOf('{[', n);
        if (n == -1) {
            if (isFound) {
                //txt += p.substring(b + 2, p.length);
                $("<div></div>").html(p.substring(b + 2, p.length)).appendTo(options.Element.selector);
                return;
            }
            options.Element.text(options.Text);
            return p;
        }
        m = p.indexOf(']}', n + 2);    
        if (m == -1) {
            if (isFound) {
                $("<div></div>").html(p.substring(b + 2, p.length)).appendTo(options.Element.selector);
                return;
            }
            options.Element.text(options.Text);
            return p;
        }
        isFound = true;
        if (txt != "") {
            b += 2;
        }
        txt += p.substring(b + 2, n);
        f = p.substring(n + 2, m);
        a = f.split(' ');    
        if (a[0] == undefined || tags[a[0]] == undefined) {
            n = m;
            continue;
        }
        var element = tags[a[0]](getAttrParams(a), { Element: options.Element, Text: p.substring(b, n) });
    
        if (element != undefined) {
            txt += element;
        }
        n = m;
    }
}

/**
* Get markup's attribute
*/   
function getAttrParams(a) {
    params = [];
    for (i = 1; i < a.length; i++) {
        var attr = a[i].split('=');
        if (attr[0] == undefined || attr[1] == undefined) {
            continue;
        }
        params[attr[0]] = attr[1];
    }
    return params;
}

/**
* How to behave. 
* avatar - current avatar
*/
function basicBehavior(avatar)
{
    $('#' + avatar.getName()).mouseover(function () {
        avatar.about();
    });
    $('#' + avatar.getName()).mouseout(function () {
        /*if (temp.length == 0) {
            return;
        }*/
        avatar.repeat();
    });
}