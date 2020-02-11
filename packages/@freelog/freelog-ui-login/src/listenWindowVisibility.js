
export default function initWindowListener(listener) {
	listenWindowVisibility((type) => {
		if (type === 'visible') {
			listener(type)
		}
	})
}

function listenWindowVisibility(handleChange) {
	let hidden = 'hidden'
	const doc = document

	if (hidden in doc) {
		doc.addEventListener('visibilitychange', onchange)
	} else if ('mozHidden' in doc) {
		hidden = 'mozHidden'
		doc.addEventListener('mozvisibilitychange', onchange)
	} else if ('webkitHidden' in doc) {
		hidden = 'webkitHidden'
		doc.addEventListener('webkitvisibilitychange', onchange)
	} else if ('msHidden' in doc) {
		hidden = 'msHidden'
		doc.addEventListener('msvisibilitychange', onchange)
	} else {
		const events = ['onpageshow', 'onpagehide', 'onfocus', 'onblur']
		events.forEach((name) => {
			window[name] = onchange()
		})
	}

	function onchange(evt) {
		const v = 'visible'
		const h = 'hidden'
		const evtMap = {
			"focus": v, "focusin": v, "pageshow": v, "blur": h, "focusout": h, "pagehide": h
		}
		let type

		evt = evt || window.event
		if (evt.type in evtMap) {
			type = evtMap[evt.type]
		} else {
			type = this[hidden] ? 'hidden' : 'visible'
		}

		if (typeof handleChange === 'function') {
			handleChange(type)
		}
	}
}