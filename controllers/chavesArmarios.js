import sql from 'mssql';

export const getChavesArmarios = (req, res) => {

	let query = `
	SELECT ARMARIO
		,DESCRICAO
	FROM RKF_CHAVES_ARMARIOS
	ORDER BY ARMARIO
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const postChaveArmario = (req, res) => {
	let query = `
	INSERT INTO RKF_CHAVES_ARMARIOS (ARMARIO, DESCRICAO) VALUES ('${req.body.armario}','${(req.body.descricao).replace("'","''")}')
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const patchChaveArmario = (req, res) => {
	const { descricao } = req.body;

	let query = 'UPDATE RKF_CHAVES_ARMARIOS SET'

	if (descricao) {
		query += ` DESCRICAO = '${descricao}'`
	}

	query += ` WHERE ARMARIO = '${req.params.armario}'`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const deleteChaveArmario = (req, res) => {

	let query = `DELETE FROM RKF_CHAVES_ARMARIOS WHERE ARMARIO = '${req.params.armario}'`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}