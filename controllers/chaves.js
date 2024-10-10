import sql from 'mssql';

export const getChaves = (req, res) => {

	let query = `
	SELECT ARMARIO
		,NUMERO
		,DESCRIÇÃO
		,CASE WHEN RESTRITO = 'S'
		THEN 'SIM'
		ELSE 'NÃO'
		END AS RESTRITO
	FROM RKF_CHAVES
	ORDER BY ARMARIO,NUMERO
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const postChave = (req, res) => {
	let query = `
	INSERT INTO RKF_CHAVES VALUES ('${armario}','${numero}','${descricao}','${restrito}')
	`
	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const patchChave = (req, res) => {
	const { idchave } = req.query;

	let query = 'UPDATE RKF_CHAVES SET'

	if (req.params.restrito) {
		query += ` RESTRITO = '${req.params.restrito}'`
	}

	if (req.params.descricao) {
		query += ` DESCRIÇÃO = '${req.params.descricao}'`
	}

	query += ` WHERE ARMARIO + NUMERO = '${idchave}'`

	console.log(query);


	// new sql.Request().query(query, (err, result) => {
	// 	if (err) {
	// 		console.error("Error executing query:", err);
	// 	} else {
	// 		res.send(result.recordset); // Send query result as response
	// 	}
	// });
}

export const deleteChave = (req, res) => {

	let query = `DELETE FROM RKF_CHAVES WHERE ARMARIO + NUMERO = '${req.params.armario + req.params.numero}'`


	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}
