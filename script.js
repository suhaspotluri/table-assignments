var spreadsheet_id = "1OHEBEOMg1HHbxhpwetpFtHW6i8vK0WccRjXnZArJR24"
var sheet_name = "Sheet1"
var api_key = "AIzaSyDEyUl9FZ8KnjNowpPW6JZBhzDtRZFvB-E"
var range = "Sheet1!B2:C"
var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${sheet_name}?alt=json&key=${api_key}&range=${range}`;
// The autoComplete.js Engine instance creator
const autoCompleteJS = new autoComplete({
	data: {
		src: async () => {
			try {
				// Loading placeholder text
				document
					.getElementById("autoComplete")
					.setAttribute("placeholder", "Loading...");
				// Fetch External Data Source
				const source = await fetch(url);
				const data = await source.json();
				const objs = data.values.map(x => ({
					name: x[0],
					table: x[1]
				}));
				// Post Loading placeholder text
				document
					.getElementById("autoComplete")
					.setAttribute("placeholder", autoCompleteJS.placeHolder);
				// Returns Fetched data
				return objs;
			} catch (error) {
				return error;
			}
		},
		keys: ["name"],
		cache: true
	},
	placeHolder: "Enter name to find table",
	resultsList: {
		element: (list, data) => {
			const info = document.createElement("p");
			if (data.results.length > 0) {
				info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
			} else {
				info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
			}
			list.prepend(info);
		},
		noResults: true,
		maxResults: 15,
		tabSelect: true
	},
	resultItem: {
		element: (item, data) => {
			// Modify Results Item Style
			item.style = "display: flex; justify-content: space-between;";
			// Modify Results Item Content
			item.innerHTML = `
      <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        ${data.match}
      </span>
      <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,0.0);">
        ${data.key}
      </span>`;
		},
		highlight: true
	},
	events: {
		input: {
			focus: () => {
				if (autoCompleteJS.input.value.length) autoCompleteJS.start();
			}
		}
	}
});

autoCompleteJS.input.addEventListener("selection", function (event) {
	const feedback = event.detail;
	autoCompleteJS.input.blur();
	// Prepare User's Selected Value
	const selection = feedback.selection.value[feedback.selection.key];
	const selection_table = feedback.selection.value.table;
	// Render selected choice to selection div
	document.querySelector(".selection").innerHTML = `${selection}:` ;
	document.querySelector("#table").innerHTML = `Table ${selection_table}` ;
	// Replace Input value with the selected value
	autoCompleteJS.input.value = selection;
	// Console log autoComplete data feedback
	console.log(feedback);
});

// Blur/unBlur page elements
const action = (action) => {
	const title = document.querySelector("h1");
	const mode = document.querySelector(".mode");
	const selection = document.querySelector(".selection");
	const footer = document.querySelector(".footer");

	if (action === "dim") {
		title.style.opacity = 1;
		mode.style.opacity = 1;
		selection.style.opacity = 1;
	} else {
		title.style.opacity = 0.3;
		mode.style.opacity = 0.2;
		selection.style.opacity = 0.1;
	}
};

// Blur/unBlur page elements on input focus
["focus", "blur"].forEach((eventType) => {
	autoCompleteJS.input.addEventListener(eventType, () => {
		// Blur page elements
		if (eventType === "blur") {
			action("dim");
		} else if (eventType === "focus") {
			// unBlur page elements
			action("light");
		}
	});
});