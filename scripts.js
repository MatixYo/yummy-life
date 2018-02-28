const localizationPickerResults = document.querySelector('#localization-picker-results'),
linkElement = document.createElement('a'),
bodyClasses = ['page-landing', 'page-foods', 'page-status'],
setBodyClass = id => {
	bodyClasses.forEach(className => document.body.classList.remove(className));
	document.body.classList.add(bodyClasses[id]);
};

document.querySelector('#localization-picker-detect').addEventListener('click', event => {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(position => Map.geoCodeReverse([position.coords.latitude, position.coords.longitude]).then(data => {
		if(data.results.length) {
			drawPath([position.coords.longitude, position.coords.latitude]);
			document.querySelector('#header-location').textContent = data.results[0].formatted;
		}
	}));
	setBodyClass(1);
});

document.querySelector('#localization-picker-direct').addEventListener('input', event => {
	if(event.currentTarget.value) {
		localizationPickerResults.innerHTML = '';
		Map.geoCodeForward(event.currentTarget.value).then(data => {
			data.results.forEach(result => {
				let link = linkElement.cloneNode();
				link.textContent = result.formatted;
				link.addEventListener('click', () => {
					drawPath([result.geometry.lon, result.geometry.lat]);
					document.querySelector('#header-location').textContent = result.formatted;
					localizationPickerResults.innerHTML = '';
					setBodyClass(1);
				});
				localizationPickerResults.appendChild(link);
			});
		});
	}
});

document.querySelector('#section-foods-category-products').addEventListener('click', event => {
	event.preventDefault();
	document.querySelector('#section-foods').classList.remove('section-foods-restaurants');
	document.querySelector('#section-foods').classList.add('section-foods-products');
});

document.querySelector('#section-foods-category-restaurants').addEventListener('click', event => {
	event.preventDefault();
	document.querySelector('#section-foods').classList.remove('section-foods-products');
	document.querySelector('#section-foods').classList.add('section-foods-restaurants');
});

document.querySelector('#header-basket').addEventListener('click', event => {
	event.preventDefault();
	event.currentTarget.classList.toggle('open-basket');
});

function a(img, name, price) {
	document.querySelector('#product-overlay-image').src = 'images/food/' + img + '.jpg';
	document.querySelector('#product-overlay > h3').textContent = name;
	document.querySelector('#product-overlay > span').textContent = price + ' zł';
	document.body.classList.add('overlay');
}
document.querySelector('#product-cancel').addEventListener('click', event => {
	event.preventDefault();
	document.body.classList.remove('overlay');
});
document.querySelector('#product-add').addEventListener('click', () => {
	event.preventDefault();
	document.body.classList.remove('overlay');
	let li = document.createElement('li');
	li.textContent = document.querySelector('#product-overlay > h3').textContent + ' ' + document.querySelector('#product-overlay > span').textContent;
	document.querySelector('#basket > ul').appendChild(li);
});

document.querySelector('#basket-order').addEventListener('click', () => {
	setBodyClass(2);
});

const map = L.map('map', {center: [50.067466, 21.99734], zoom: 13});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

const drawPath = coords => {
	Map.getPath([[21.997349948097529, 50.067466912273076], coords]).then(data => {
		L.geoJSON(data.routes[0].geometry).addTo(map);
	});
};
