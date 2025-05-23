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

export const getChavesByArmario = (req, res) => {

	let query = `
	SELECT NUMERO
		,NUMERO + ' - ' + DESCRIÇÃO AS DESCRIÇÃO
		,RESTRITO
	FROM RKF_CHAVES
	WHERE ARMARIO = '${req.params.armario}'
	ORDER BY NUMERO
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getChavesRestritas = (req, res) => {

	let query = `
	SELECT ARMARIO
		,NUMERO
		,DESCRIÇÃO
		,RESTRITO
	FROM RKF_CHAVES
	WHERE RESTRITO = 'S'
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
	INSERT INTO RKF_CHAVES (ARMARIO, NUMERO, DESCRIÇÃO, RESTRITO) VALUES ('${req.body.armario}','${req.body.numero}','${(req.body.descricao).replace("'","''")}','${req.body.restrito}')
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
	const { restrito, descricao, usuario } = req.body;

	let query = 'UPDATE RKF_CHAVES SET'
	let logQuery = `
		INSERT INTO RKF_CHAVES_LOG (USUARIO, DATAHORA, TABELA, ID_TABELA, TIPO, CAMPO, VALOR_ANTIGO, VALOR_NOVO)
		VALUES ('${usuario}', GETDATE(), 'RKF_CHAVES', '${req.params.idchave}', 'UPDATE'
	` // continua na condicional

	if (restrito) {
		query += ` RESTRITO = '${restrito}'`
		logQuery += `, 'RESTRITO', 'VALOR ANTIGO', '${restrito}')`
	}

	if (descricao) {
		query += ` DESCRIÇÃO = '${descricao}'`
		logQuery += `, 'DESCRIÇÃO', 'VALOR ANTIGO', '${restrito}')`
	}

	query += ` WHERE ARMARIO + NUMERO = '${req.params.idchave}'`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const deleteChave = (req, res) => {

	let query = `DELETE FROM RKF_CHAVES WHERE ARMARIO + NUMERO = '${req.params.idchave}'`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}