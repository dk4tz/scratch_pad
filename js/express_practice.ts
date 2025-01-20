import express from 'express';

let app = express();

app.get('/batting-average', (req, res) => {
	let hits = parseInt(req.query.hits);
	let atBats = parseInt(req.query.atBats);

	if (isNaN(hits) || isNaN(atBats)) {
		return res.status(400).json({
			error: 'need valid hits and atBats'
		});
	}

	if (hits < 0 || atBats < 0) {
		return res.status(400).json({
			error: 'hits and atBats must be > 0'
		});
	}

	const avg = Number((hits / atBats).toFixed(3));

	return res.status(200).json({
		batting_average: avg
	});
});

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
	console.log('running on ', PORT);
});
