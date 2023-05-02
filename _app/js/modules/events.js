import { apikey } from "../env.js";
export default async function events() {
	let currentSort = null;
	const endpoint = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}&city=oslo&locale=*&sort=date,asc`;
	const response = await fetch(endpoint);
	const result = await response.json();
	let events = result._embedded.events;
	let eventsNotSorted = [...events];

	const eventsContainer = document.querySelector('.events ul')
	const dateButton = document.querySelector('.date-button');
	const showButton = document.querySelector('.showname-button');
	const venueButton = document.querySelector('.venue-button');

	const sortButtons = document.querySelectorAll('.header__sort-button');

	dateButton.addEventListener('click', handleDateButtonClick);
	showButton.addEventListener('click', handleShowButtonClick);
	venueButton.addEventListener('click', handlevenueButtonClich);

	function handleDateButtonClick() {
		setSort('date')
		if (currentSort === null) {
			events = [...eventsNotSorted]
		} else {
			sortDate()
		}
		renderHTML() 
	}

	function handleShowButtonClick(){
		setSort('show')
		if (currentSort === null) {
			events = [...eventsNotSorted]
		} else {
			sortShow()
		}
		renderHTML()
	}

	function handlevenueButtonClich() {
		setSort('venue')
		if (currentSort === null) {
			events = [...eventsNotSorted]
		} else {
			sortVenu()
		}
		renderHTML()
	}

	function sortDate() {
		events.sort((a, b) => {
			if (a.dates.start.localDate < b.dates.start.localDate ) {
				return -1;
			} else if (a.dates.start.localDate > b.dates.start.localDate ) {
				return 1;
			} else {
				return 0;
			}
		})
	}

	function sortShow() {
		events.sort((a, b) => {
			if (a.name < b.name ) {
				return -1;
			} else if (a.name > b.name ) {
				return 1;
			} else {
				return 0;
			}
		})
	}

	function sortVenu() {
		events.sort((a, b) => {
			if (a._embedded.venues[0].name < b._embedded.venues[0].name ) {
				return -1;
			} else if (a._embedded.venues[0].name > b._embedded.venues[0].name ) {
				return 1;
			} else {
				return 0;
			}
		})
	}

	function setSort(name) {
		if (currentSort === name) {
			currentSort = null;
		} else {
			currentSort = name;
		}

		console.log(currentSort)
	}

	function renderHTML() {
		renderSortButtons();
		renderEvents();

		function renderSortButtons() {
			for (const sortButton of sortButtons) {
				sortButton.classList.remove('header__sort-button--active')
	
				if (sortButton.innerText.toLowerCase() === currentSort) {
					sortButton.classList.add('header__sort-button--active')
				}
			}
		}
	
		function renderEvents() {
			eventsContainer.innerHTML = '';
	
			for (const event of events) {
				const mainContainer = document.createElement('li');
	
				const imageContaier = document.createElement('div');
				const image = document.createElement('img');
	
				const timeContainer = document.createElement('div');
				const date = document.createElement('p');
				const time = document.createElement('p');
	
				const informationContainer = document.createElement('div');
				const title = document.createElement('p');
				const venue = document.createElement('p');
	
				const buyLink = document.createElement('a');
	
				// Innner Text
				date.innerText = event.dates.start.localDate;
				time.innerText = event.dates.start.localTime;
	
				title.innerText = event.name;
				venue.innerText = event._embedded.venues[0].name;
	
				buyLink.innerText = 'Buy tickets'
	
				// Class
				mainContainer.className = 'events__event';
				imageContaier.className = 'events__image';
				timeContainer.className = 'events__time-container';
				buyLink.className = 'events__buy-tickets';
	
				// Src
				image.src = event.images[0].url;
	
				// Href
				buyLink.href = event.url;
	
				// Append
				imageContaier.append(image);
				
				timeContainer.append(date);
				if (event.dates.start.localTime) {
					timeContainer.append(time);
				}
	
				informationContainer.append(title);
				informationContainer.append(venue)
				
				mainContainer.append(imageContaier);
				mainContainer.append(timeContainer);
				mainContainer.append(informationContainer);
				mainContainer.append(buyLink);
				
				eventsContainer.append(mainContainer);
			}
		}
	}
	
	// callled functions
	renderHTML();
}