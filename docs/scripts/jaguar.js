(function() {
	let e = 0;
	let t;
	let n = document.querySelector('#source-code');
	if (n) {
		const i = config.linenums;
		if (i) {
			n = n.querySelectorAll('ol')[0];
			t = Array.prototype.slice.apply(n.children);
			t = t.map(function(t) {
				e++;
				t.id = 'line' + e;
			});
		} else {
			n = n.querySelectorAll('code')[0];
			t = n.innerHTML.split('\n');
			t = t.map(function(t) {
				e++;
				return '<span id="line' + e + '"></span>' + t;
			});
			n.innerHTML = t.join('\n');
		}
	}
})();

$(function() {
	$('#search').on('keyup', function(e) {
		const t = $(this).val();
		const n = $('.navigation');
		if (t) {
			const i = new RegExp(t, 'i');
			n.find('li, .itemMembers').hide();
			n.find('li').each(function(e, t) {
				const n = $(t);
				if (n.data('name') && i.test(n.data('name'))) {
					n.show();
					n.closest('.itemMembers').show();
					n.closest('.item').show();
				}
			});
		} else {
			n.find('.item, .itemMembers').show();
		}

		n.find('.list').scrollTop(0);
	});
	$('.navigation').on('click', '.title', function(e) {
		$(this)
			.parent()
			.find('.itemMembers')
			.toggle();
	});
	const e = $('.page-title')
		.data('filename')
		.replace(/\.[a-z]+$/, '');
	const t = $('.navigation .item[data-name*="' + e + '"]:eq(0)');
	if (t.length) {
		t.remove()
			.prependTo('.navigation .list')
			.show()
			.find('.itemMembers')
			.show();
	}

	const n = function() {
		const e = $(window).height();
		const t = $('.navigation');
		t.height(e)
			.find('.list')
			.height(e - 133);
	};

	$(window).on('resize', n);
	n();
	if (config.disqus) {
		$(window).on('load', function() {
			const e = config.disqus;
			const t = document.createElement('script');
			t.type = 'text/javascript';
			t.async = true;
			t.src = 'http://' + e + '.disqus.com/embed.js';
			(
				document.querySelectorAll('head')[0] ||
				document.querySelectorAll('body')[0]
			).append(t);
			const n = document.createElement('script');
			n.async = true;
			n.type = 'text/javascript';
			n.src = 'http://' + e + '.disqus.com/count.js';
			document.querySelectorAll('BODY')[0].append(n);
		});
	}
});
